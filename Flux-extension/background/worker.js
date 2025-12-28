console.log("FETCHX WORKER LOADED (ID-BASED SAFETY)");

//const BACKEND_URL = "https://fetchx-suit.onrender.com";
const BACKEND_URL="http://localhost:3000";

/* ================= CONSTANTS ================= */
const STORAGE_KEY = "fetchxJob";
const MAX_RETRIES = 2;
const UNSPLASH_MAX_PAGES = 125;
const UNSPLASH_PER_PAGE = 30;
const PIXABAY_MAX_ITEMS = 500;

const PROVIDER_ORDER = ["pexels", "unsplash", "pixabay"];
const LOOP_YIELD_MS = 200;

/* ================= STATE ================= */
let state = null;
let activeRunId = 0; // 🔥 NEW: Unique ID for the current active job

/* ================= HELPERS ================= */
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function safeSendMessage(message) {
  chrome.runtime.sendMessage(message, () => {
    void chrome.runtime.lastError;
  });
}

/* ================= STORAGE ================= */
async function saveState() {
  if (!state) return;
  await chrome.storage.session.set({
    [STORAGE_KEY]: structuredClone(state),
  });
}

async function loadState() {
  const res = await chrome.storage.session.get(STORAGE_KEY);
  return res[STORAGE_KEY] || null;
}

async function clearState() {
  await chrome.storage.session.remove(STORAGE_KEY);
}

/* ================= MEDIA ================= */
function normalizeType(type) {
  return type === "videos" ? "videos" : "images";
}

function resolveRoute(provider, mediaType) {
  if (provider === "pexels") return mediaType;
  if (provider === "pixabay")
    return mediaType === "videos" ? "videos" : "photos";
  if (provider === "unsplash") return "images";
}

function providerSupportsMedia(provider, mediaType) {
  if (provider === "unsplash") return mediaType === "images";
  return true;
}

function extractUrl(provider, item, mediaType) {
  if (provider === "pexels") {
    return mediaType === "videos"
      ? item.video_files?.[0]?.link
      : item.src?.original;
  }
  if (provider === "unsplash") return item.urls?.full;
  if (provider === "pixabay") {
    return mediaType === "videos"
      ? item.videos?.large?.url
      : item.largeImageURL;
  }
  return null;
}

function buildFilename(query, provider, item, mediaType) {
  const ext = mediaType === "videos" ? "mp4" : "jpg";
  const safeQuery = query.replace(/[^a-z0-9]/gi, '_');
  return `${safeQuery}/${provider}/${provider}_${item.id}.${ext}`;
}

/* ================= DOWNLOAD ================= */
function downloadOnce(url, filename) {
  return new Promise((resolve) => {
    let finished = false;

    chrome.downloads.download(
      { url, filename, saveAs: false, conflictAction: "uniquify" },
      (id) => {
        if (chrome.runtime.lastError || !id) return resolve(false);

        const timeout = setTimeout(() => {
          if (!finished) {
            finished = true;
            chrome.downloads.onChanged.removeListener(listener);
            console.warn(`⚠️ Timeout - Skipping: ${filename}`);
            resolve(true); 
          }
        }, 12000); 

        const listener = (d) => {
          if (d.id !== id) return;
          if (d.state?.current === "complete") {
            finished = true;
            clearTimeout(timeout);
            chrome.downloads.onChanged.removeListener(listener);
            resolve(true);
          } else if (d.state?.current === "interrupted") {
            finished = true;
            clearTimeout(timeout);
            chrome.downloads.onChanged.removeListener(listener);
            resolve(false);
          }
        };
        chrome.downloads.onChanged.addListener(listener);
      }
    );
  });
}

async function downloadWithRetry(url, filename) {
  for (let i = 1; i <= MAX_RETRIES; i++) {
    if (await downloadOnce(url, filename)) return true;
    await sleep(500);
  }
  return false;
}

/* ================= PROGRESS ================= */
function emitProgress() {
  if (!state || state.status !== "running") return;
  safeSendMessage({
    type: "PROGRESS",
    downloaded: state.totalDownloaded,
    target: state.job.targetCount,
    providers: state.providers,
  });
}

function nextProvider() {
  state.providerIndex = (state.providerIndex + 1) % PROVIDER_ORDER.length;
}

/* ================= MAIN LOOP ================= */
// 🔥 NEW: run() now accepts an ID. If ID doesn't match global, it quits.
async function run(myRunId) {
  console.log(`Starting Run ID: ${myRunId}`);
  
  const mediaType = normalizeType(state.job.mediaType);
  let emptyCycles = 0; 

  while (
    state &&
    state.status === "running" &&
    state.totalDownloaded < state.job.targetCount
  ) {
    // 🔥 SAFETY CHECK: Am I still the active runner?
    if (myRunId !== activeRunId) {
        console.log(`Run ID ${myRunId} is stale. Stopping.`);
        return; // Die silently
    }

    let cycleHasActivity = false;

    for (let i = 0; i < PROVIDER_ORDER.length; i++) {
      if (myRunId !== activeRunId) return; // Die instantly inside loop

      const providerName = PROVIDER_ORDER[state.providerIndex];
      const p = state.providers[providerName];
      const advance = () => nextProvider();

      if (!providerSupportsMedia(providerName, mediaType) || p.exhausted) {
        advance(); continue;
      }
      if (providerName === "unsplash" && p.page > UNSPLASH_MAX_PAGES) { p.exhausted = true; advance(); continue; }
      if (providerName === "pixabay" && p.downloaded >= PIXABAY_MAX_ITEMS) { p.exhausted = true; advance(); continue; }

      let data;
      try {
        const res = await fetch(
          `${BACKEND_URL}/metadata/${providerName}/${resolveRoute(providerName, mediaType)}?query=${encodeURIComponent(state.job.query)}&page=${p.page}&perPage=${p.perPage}`,
          {
            headers: {
              "Authorization": `Bearer bc742fd8-9b78-45d5-a44c-83200288ed7c`,
            }
          }
        );
        data = await res.json();
      } catch (err) {
        advance(); continue;
      }

      if (!data.items || data.items.length === 0) {
        p.exhausted = true; advance(); continue;
      }

      for (const item of data.items) {
        // 🔥 Loop Check
        if (myRunId !== activeRunId || state.status !== "running" || state.totalDownloaded >= state.job.targetCount) break;

        const url = extractUrl(providerName, item, mediaType);
        if (!url) continue;

        const filename = buildFilename(state.job.query, providerName, item, mediaType);
        if (await downloadWithRetry(url, filename)) {
          state.totalDownloaded++;
          p.downloaded++;
          cycleHasActivity = true; 
          emitProgress();
        } 
        
        await sleep(150);
      }

      p.page++;
      advance();
    }

    await saveState();

    if (!cycleHasActivity) {
      emptyCycles++;
      if (emptyCycles >= 5) break; 
    } else {
      emptyCycles = 0; 
    }

    await sleep(LOOP_YIELD_MS);
  }

  // Only report DONE if we are still the main runner
  if (myRunId === activeRunId && state) {
      if (state.totalDownloaded >= state.job.targetCount || PROVIDER_ORDER.every((n) => state.providers[n].exhausted)) {
        state.status = "done";
        await saveState();
        safeSendMessage({ type: "DONE" });
      } else if (emptyCycles >= 5) {
          state.status = "done";
          await saveState();
          safeSendMessage({ type: "DONE", reason: "No more content" });
      }
  }
}

/* ================= MESSAGING ================= */
chrome.runtime.onMessage.addListener((msg, _, sendResponse) => {
  (async () => {
    if (msg.type === "START_JOB") {
      activeRunId++; // 🔥 Invalidate any previous loops
      const currentId = activeRunId; // Capture ID for this run

      state = {
        status: "running",
        job: msg.job,
        totalDownloaded: 0,
        providerIndex: 0,
        providers: {
          pexels: { page: 1, perPage: msg.job.mediaType === "videos" ? 30 : 80, downloaded: 0, exhausted: false },
          unsplash: { page: 1, perPage: UNSPLASH_PER_PAGE, downloaded: 0, exhausted: false },
          pixabay: { page: 1, perPage: msg.job.mediaType === "videos" ? 50 : 80, downloaded: 0, exhausted: false },
        },
      };
      await saveState();
      
      // Start the run with the specific ID
      run(currentId);
      
      sendResponse({ ok: true });
    }

    if (msg.type === "PAUSE_JOB") {
      if (!state) return sendResponse({ ok: false });
      state.status = "paused";
      // We don't increment ID here because we want to resume later
      await saveState();
      safeSendMessage({ type: "PAUSED" });
      sendResponse({ ok: true });
    }

    if (msg.type === "RESUME_JOB") {
      if (!state || state.status !== "paused") return sendResponse({ ok: false });
      state.status = "running";
      
      activeRunId++; // 🔥 New run ID for the resume
      await saveState();
      safeSendMessage({ type: "RUNNING", snapshot: state });
      run(activeRunId);
      
      sendResponse({ ok: true });
    }

    if (msg.type === "STOP_JOB") {
      activeRunId++; // 🔥 Kill all loops immediately
      await clearState();
      state = null;
      sendResponse({ ok: true });
    }

    if (msg.type === "GET_JOB") {
      const saved = await loadState();
      sendResponse(saved || null);
    }
  })();
  return true;
});

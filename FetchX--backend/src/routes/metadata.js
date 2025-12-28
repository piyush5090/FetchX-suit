import express from "express";
import {
  getPexelsImages,
  getPexelsVideos,
} from "../services/pexels.js";
import { getUnsplashImages } from "../services/unsplash.js";
import { getPixabayMetadata } from "../services/pixabay.js";
import { authenticateAndCheckQuota } from "../middleware/auth.js";
import {
  normalizePexels,
  normalizeUnsplash,
  normalizePixabayImages,
  normalizePixabayVideos,
  normalizePexelsVideos
} from "../utils/normalize.js";

const router = express.Router();

// Apply authentication and quota middleware to all metadata routes
router.use(authenticateAndCheckQuota);

/* =========================
   ALL (Aggregated)
========================= */

router.get("/all/images", async (req, res) => {
  const { query, page = 1, perPage = 20 } = req.query; // Smaller perPage for aggregated endpoint
  if (!query) return res.status(400).json({ error: "query is required" });

  try {
    const [pexelsData, unsplashData, pixabayData] = await Promise.all([
      getPexelsImages(query, Number(page), Number(perPage)),
      getUnsplashImages(query, Number(page), Number(perPage)),
      getPixabayMetadata("photos", query, Number(page), Number(perPage)),
    ]);

    const normalizedPexels = normalizePexels(pexelsData);
    const normalizedUnsplash = normalizeUnsplash(unsplashData);
    const normalizedPixabay = normalizePixabayImages(pixabayData);

    const allItems = [...normalizedPexels, ...normalizedUnsplash, ...normalizedPixabay];

    // Simple shuffle to mix results
    allItems.sort(() => Math.random() - 0.5);

    res.json({
      provider: "all",
      type: "images",
      query,
      page: Number(page),
      perPage: Number(perPage) * 3, // Effective perPage
      total: pexelsData.total + unsplashData.total + pixabayData.total,
      items: allItems,
    });
  } catch (err) {
    console.error("Aggregated images error:", err.message);
    res.status(500).json({ error: "Failed to fetch aggregated images" });
  }
});

router.get("/all/videos", async (req, res) => {
  const { query, page = 1, perPage = 20 } = req.query;
  if (!query) return res.status(400).json({ error: "query is required" });

  try {
    const [pexelsData, pixabayData] = await Promise.all([
      getPexelsVideos(query, Number(page), Number(perPage)),
      getPixabayMetadata("videos", query, Number(page), Number(perPage)),
    ]);

    const normalizedPexels = normalizePexelsVideos(pexelsData);
    const normalizedPixabay = normalizePixabayVideos(pixabayData);

    const allItems = [...normalizedPexels, ...normalizedPixabay];
    allItems.sort(() => Math.random() - 0.5);

    res.json({
      provider: "all",
      type: "videos",
      query,
      page: Number(page),
      perPage: Number(perPage) * 2,
      total: pexelsData.total + pixabayData.total,
      items: allItems,
    });
  } catch (err) {
    console.error("Aggregated videos error:", err.message);
    res.status(500).json({ error: "Failed to fetch aggregated videos" });
  }
});


/* =========================
   PEXELS
========================= */

router.get("/pexels/images", async (req, res) => {
  const { query, page = 1, perPage = 80 } = req.query;
  if (!query) return res.status(400).json({ error: "query is required" });

  try {
    const data = await getPexelsImages(
      query,
      Number(page),
      Number(perPage)
    );

    res.json({
      provider: "pexels",
      type: "photos",
      query,
      ...data,
    });
  } catch (err) {
    console.error("Pexels images error:", err.message);
    res.status(500).json({ error: "Failed to fetch Pexels images" });
  }
});

router.get("/pexels/videos", async (req, res) => {
  const { query, page = 1, perPage = 30 } = req.query;
  if (!query) return res.status(400).json({ error: "query is required" });

  try {
    const data = await getPexelsVideos(
      query,
      Number(page),
      Number(perPage)
    );

    res.json({
      provider: "pexels",
      type: "videos",
      query,
      ...data,
    });
  } catch (err) {
    console.error("Pexels videos error:", err.message);
    res.status(500).json({ error: "Failed to fetch Pexels videos" });
  }
});

/* =========================
   UNSPLASH (photos only)
========================= */

router.get("/unsplash/images", async (req, res) => {
  const { query, page = 1, perPage = 30 } = req.query;
  if (!query) return res.status(400).json({ error: "query is required" });

  try {
    const data = await getUnsplashImages(
      query,
      Number(page),
      Number(perPage)
    );

    res.json({
      provider: "unsplash",
      type: "photos",
      query,
      ...data,
    });
  } catch (err) {
    console.error("Unsplash photos error:", err.message);
    res.status(500).json({ error: "Failed to fetch Unsplash photos" });
  }
});

/* =========================
   PIXABAY
========================= */

router.get("/pixabay/photos", async (req, res) => {
  const { query, page = 1, perPage = 80 } = req.query;
  if (!query) return res.status(400).json({ error: "query is required" });

  try {
    const data = await getPixabayMetadata(
      query,
      "photos",
      Number(page),
      Number(perPage)
    );

    res.json({
      provider: "pixabay",
      type: "photos",
      query,
      ...data,
    });
  } catch (err) {
    console.error("Pixabay photos error:", err.message);
    res.status(500).json({ error: "Failed to fetch Pixabay photos" });
  }
});

router.get("/pixabay/illustrations", async (req, res) => {
  const { query, page = 1, perPage = 80 } = req.query;
  if (!query) return res.status(400).json({ error: "query is required" });

  try {
    const data = await getPixabayMetadata(
      query,
      "illustrations",
      Number(page),
      Number(perPage)
    );

    res.json({
      provider: "pixabay",
      type: "illustrations",
      query,
      ...data,
    });
  } catch (err) {
    console.error("Pixabay illustrations error:", err.message);
    res.status(500).json({ error: "Failed to fetch Pixabay illustrations" });
  }
});

router.get("/pixabay/vectors", async (req, res) => {
  const { query, page = 1, perPage = 80 } = req.query;
  if (!query) return res.status(400).json({ error: "query is required" });

  try {
    const data = await getPixabayMetadata(
      query,
      "vectors",
      Number(page),
      Number(perPage)
    );

    res.json({
      provider: "pixabay",
      type: "vectors",
      query,
      ...data,
    });
  } catch (err) {
    console.error("Pixabay vectors error:", err.message);
    res.status(500).json({ error: "Failed to fetch Pixabay vectors" });
  }
});

router.get("/pixabay/videos", async (req, res) => {
  const { query, page = 1, perPage = 50 } = req.query;
  if (!query) return res.status(400).json({ error: "query is required" });

  try {
    const data = await getPixabayMetadata(
      query,
      "videos",
      Number(page),
      Number(perPage)
    );

    res.json({
      provider: "pixabay",
      type: "videos",
      query,
      ...data,
    });
  } catch (err) {
    console.error("Pixabay videos error:", err.message);
    res.status(500).json({ error: "Failed to fetch Pixabay videos" });
  }
});

export default router;

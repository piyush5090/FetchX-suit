import { supabase } from "../config/supabase.js";

const FREE_TIER_QUOTA = 5000;
const CYCLE_LENGTH_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

/**
 * API KEY AUTH — used for /search and /metadata endpoints
 * Tracks usage + quota
 */
export const authenticateAndCheckQuota = async (req, res, next) => {
  console.log("--- New API Request ---");
  console.log(req.headers);

  const authHeader = req.headers.authorization;

  // 🔐 Ensure API key format
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Unauthorized: API key missing or malformed",
      message: "Use API key: Authorization: Bearer <api_key>"
    });
  }

  const token = authHeader.split(" ")[1];

  // 🆚 Block JWT tokens from being used as API keys
  if (token.split(".").length === 3) {
    return res.status(400).json({
      error: "Invalid credential",
      message: "JWT token detected — API routes require API key, not JWT"
    });
  }

  const apiKey = token;

  try {
    // 1️⃣ Lookup user by API key
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("api_key", apiKey)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: "Unauthorized: Invalid API key" });
    }

    // 2️⃣ Rolling usage cycle (automatic reset)
    const now = new Date();
    const cycleEnd = new Date(user.usage_cycle_end);

    if (now > cycleEnd) {
      console.log(`⟳ Resetting quota for: ${user.email}`);

      const newStart = now;
      const newEnd = new Date(now.getTime() + CYCLE_LENGTH_MS);

      await supabase
        .from("users")
        .update({
          usage_count: 0,
          usage_cycle_start: newStart.toISOString(),
          usage_cycle_end: newEnd.toISOString()
        })
        .eq("api_key", apiKey);

      user.usage_count = 0;
      user.usage_cycle_start = newStart;
      user.usage_cycle_end = newEnd;
    }

    // 3️⃣ Quota helpers
    const monthlyQuota = user.monthly_quota ?? FREE_TIER_QUOTA;
    const isUnlimited = monthlyQuota === -1;

    // 4️⃣ Validate quota
    if (!isUnlimited && user.usage_count >= monthlyQuota) {
      return res.status(429).json({
        error: "Quota exceeded",
        message: `Monthly quota of ${monthlyQuota} requests reached`
      });
    }

    // 5️⃣ Attach user for downstream handlers
    req.user = user;

    // 6️⃣ Increment usage only if limited
    if (!isUnlimited) {
      supabase
        .from("users")
        .update({ usage_count: user.usage_count + 1 })
        .eq("api_key", apiKey)
        .then(({ error }) => {
          if (error) console.error("⚠ Failed increment:", error);
        });
    }

    next();
  } catch (err) {
    console.error("⚠ API key auth error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

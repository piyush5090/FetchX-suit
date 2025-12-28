import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { supabase } from "../config/supabase.js";
import { OAuth2Client } from "google-auth-library";

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ================= JWT HELPER =================
function generateToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
}

// ================= VERIFY JWT =================
// Used only for dashboard/endpoints that should NOT consume quota
function verifyJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or malformed token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.jwtUser = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email & password required" });

  try {
    const passwordHash = await bcrypt.hash(password, 12);

    const { data: user, error } = await supabase
      .from("users")
      .insert({ email, password_hash: passwordHash })
      .select("*")
      .single();

    if (error) return res.status(500).json({ error });

    const token = generateToken(user);

    res.json({
      message: "User registered",
      token,
      user: {
        email: user.email,
        api_key: user.api_key,
        usage_count: user.usage_count,
        monthly_quota: user.monthly_quota,
        usage_cycle_end: user.usage_cycle_end
      }
    });
  } catch (err) {
    console.error("Register failed:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Email & password required" });

  try {
    const { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (!user)
      return res.status(401).json({ error: "Invalid email or password" });

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid)
      return res.status(401).json({ error: "Invalid email or password" });

    const token = generateToken(user);

    res.json({
      message: "Login successful",
      token,
      user: {
        email: user.email,
        api_key: user.api_key,
        usage_count: user.usage_count,
        monthly_quota: user.monthly_quota,
        usage_cycle_end: user.usage_cycle_end
      }
    });
  } catch (err) {
    console.error("Login failed:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ================= GOOGLE LOGIN =================
router.post("/google", async (req, res) => {
  const idToken = req.headers.authorization?.split(" ")[1];
  if (!idToken)
    return res.status(400).json({ error: "Missing Google token" });

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload.email;

    if (!email)
      return res.status(401).json({ error: "Google token invalid" });

    let { data: user } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (!user) {
      const { data: newUser } = await supabase
        .from("users")
        .insert({ email })
        .select("*")
        .single();
      user = newUser;
    }

    const token = generateToken(user);

    return res.json({
      message: "Google login successful",
      token,
      user: {
        email: user.email,
        api_key: user.api_key,
        usage_count: user.usage_count,
        monthly_quota: user.monthly_quota,
        usage_cycle_end: user.usage_cycle_end
      }
    });

  } catch (err) {
    console.error("Google login failed:", err);
    res.status(401).json({ error: "Invalid Google token" });
  }
});

// ================= DASHBOARD PROFILE (JWT) =================
router.get("/profile", verifyJWT, async (req, res) => {
  try {
    const { userId } = req.jwtUser;

    const { data: user, error } = await supabase
      .from("users")
      .select("email, api_key, usage_count, monthly_quota, usage_cycle_end")
      .eq("id", userId)
      .single();

    if (error || !user)
      return res.status(404).json({ error: "User not found" });

    res.json({
      message: "Profile fetched",
      user
    });

  } catch (err) {
    console.error("Profile fetch error:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

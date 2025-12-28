import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 3000;
export const SUPABASE_URL = process.env.SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

export const PEXELS_API_KEYS = process.env.PEXELS_API_KEYS
  ? process.env.PEXELS_API_KEYS.split(",").map(k => k.trim())
  : [];

if (PEXELS_API_KEYS.length === 0) {
  console.warn("⚠️ PEXELS_API_KEYS missing in .env. Pexels API will not be available.");
}

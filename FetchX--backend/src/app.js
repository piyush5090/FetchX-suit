import express from "express";
import cors from "cors";

import healthRoutes from "./routes/health.js";
import searchRoutes from "./routes/search.js";
import metadataRoutes from "./routes/metadata.js";
import authRoutes from "./routes/auth.js";       // 👈 ADD THIS

const app = express();

app.use(express.json());

// enable cors
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://fetchx-backend.onrender.com",
      "https://nexus-web-steel.vercel.app",
      "http://localhost:5173",
      /^chrome-extension:\/\//,
    ],
  })
);

// register routes
app.use("/auth", authRoutes);        // 👈 LOGIN + REGISTER
app.use("/health", healthRoutes);
app.use("/search", searchRoutes);
app.use("/metadata", metadataRoutes);

export default app;

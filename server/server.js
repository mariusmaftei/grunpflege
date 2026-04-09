import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import { config, assertConfig } from "./config/index.js";
import { connectDatabase } from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import * as authController from "./controllers/authController.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
assertConfig();

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  }),
);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

const uploadLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 120,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);
      const allowed = config.corsOrigin;
      if (allowed === "*") return cb(null, true);
      if (Array.isArray(allowed)) return cb(null, allowed.includes(origin));
      return cb(null, String(allowed) === origin);
    },
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(express.json({ limit: "1mb" }));

const uploadsDir = path.join(__dirname, "uploads");
app.use("/uploads", express.static(uploadsDir));

function healthPayload() {
  const state = mongoose.connection?.readyState;
  return {
    ok: true,
    env: config.nodeEnv,
    uptimeSec: Math.round(process.uptime()),
    db: {
      state,
      connected: state === 1,
    },
  };
}

app.get("/", (req, res) => {
  res.status(200).json(healthPayload());
});

app.get("/healthz", (req, res) => {
  const body = healthPayload();
  res.status(body.db.connected ? 200 : 503).json(body);
});

app.get("/api/health", (req, res) => {
  const body = healthPayload();
  res.status(body.db.connected ? 200 : 503).json(body);
});

app.post("/auth/google/callback", authLimiter, authController.googleGsiCallback);

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/uploads", uploadLimiter, uploadRoutes);

app.use((err, req, res, next) => {
  if (err?.name === "MulterError") {
    return res.status(400).json({ error: err.message || "Upload error" });
  }
  if (err?.message === "Only image uploads are allowed") {
    return res.status(400).json({ error: err.message });
  }
  console.error(err);
  return res.status(500).json({ error: "Internal server error" });
});

async function start() {
  try {
    await connectDatabase();
    console.log("[db] MongoDB connected");
  } catch (e) {
    console.error("[db] MongoDB connection failed:", e.message);
    process.exit(1);
  }

  app.listen(config.port, () => {
    console.log(`[server] http://localhost:${config.port}`);
  });
}

start();

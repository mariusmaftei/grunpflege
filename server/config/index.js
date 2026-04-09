import dotenv from "dotenv";

dotenv.config();

function parseCorsOrigin(raw) {
  const s = String(raw || "").trim();
  if (!s || s === "*") return "*";
  const parts = s.split(",").map((x) => x.trim()).filter(Boolean);
  if (parts.length === 0) return "http://localhost:3000";
  if (parts.length === 1) return parts[0];
  return parts;
}

function parseOptionalOriginList(raw) {
  const s = String(raw || "").trim();
  if (!s) return "";
  if (s === "*") return "*";
  const parts = s.split(",").map((x) => x.trim()).filter(Boolean);
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0];
  return parts;
}

export const config = {
  port: Number(process.env.PORT) || 8080,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGODB_URI || "",
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  /** Optional. ID-token login does not need it; use for auth-code exchange / Google APIs later. Never expose in the browser. */
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  jwtSecret: process.env.JWT_SECRET || "",
  allowedAdminEmails: (process.env.ALLOWED_ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean),
  corsOrigin: parseCorsOrigin(process.env.CORS_ORIGIN || "http://localhost:3000"),
  adminAppOrigin: parseOptionalOriginList(process.env.ADMIN_APP_ORIGIN),
  defaultReturnOrigin: String(process.env.DEFAULT_RETURN_ORIGIN || "").trim().replace(/\/$/, ""),
};

export function assertConfig() {
  const missing = [];
  if (!config.mongoUri) missing.push("MONGODB_URI");
  if (!config.googleClientId) missing.push("GOOGLE_CLIENT_ID");
  if (!config.jwtSecret) missing.push("JWT_SECRET");
  if (missing.length) {
    console.warn(`[config] Missing env: ${missing.join(", ")} — some features will fail until set.`);
  }
}

import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { config } from "../config/index.js";
import { User } from "../models/User.js";

const googleClient = config.googleClientId
  ? new OAuth2Client(
      config.googleClientId,
      config.googleClientSecret || undefined,
    )
  : null;

function isAdminEmailAllowed(email) {
  if (!config.allowedAdminEmails.length) return true;
  return config.allowedAdminEmails.includes(String(email).toLowerCase());
}

function asOriginList(v) {
  if (!v) return [];
  if (v === "*") return ["*"];
  if (Array.isArray(v)) return v;
  const s = String(v).trim();
  if (!s) return [];
  return s.split(",").map((x) => x.trim()).filter(Boolean);
}

function allowedReturnOrigins() {
  const explicit = asOriginList(config.adminAppOrigin);
  if (explicit.length) return explicit;
  const cors = asOriginList(config.corsOrigin);
  if (cors.length) return cors;
  return [];
}

function pickReturnOrigin(stateStr) {
  const allowed = allowedReturnOrigins();
  const fallback =
    config.defaultReturnOrigin ||
    allowed.find((x) => x && x !== "*") ||
    "http://localhost:3000";
  if (!stateStr) return fallback;
  try {
    const parsed = JSON.parse(Buffer.from(stateStr, "base64url").toString("utf8"));
    const o = typeof parsed?.o === "string" ? parsed.o.replace(/\/$/, "") : null;
    if (o && (allowed.includes("*") || allowed.includes(o))) return o;
  } catch {
    /* ignore */
  }
  return fallback;
}

async function verifyCredentialAndSignIn(credential) {
  if (!googleClient || !config.googleClientId) {
    const e = new Error("GOOGLE_CLIENT_ID is not configured on the server");
    e.status = 500;
    throw e;
  }
  if (!config.jwtSecret) {
    const e = new Error("JWT_SECRET is not configured");
    e.status = 500;
    throw e;
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: config.googleClientId,
  });
  const payload = ticket.getPayload();
  if (!payload?.email || !payload.sub) {
    const e = new Error("Invalid Google token payload");
    e.status = 401;
    throw e;
  }

  if (!isAdminEmailAllowed(payload.email)) {
    const e = new Error(
      "This Google account is not in ALLOWED_ADMIN_EMAILS. Add the email to server/.env (comma-separated) or clear the variable to allow any verified Google user.",
    );
    e.status = 403;
    e.email = payload.email;
    e.reason = "notOnAllowList";
    throw e;
  }

  await User.findOneAndUpdate(
    { googleSub: payload.sub },
    {
      googleSub: payload.sub,
      email: payload.email,
      name: payload.name || "",
      picture: payload.picture || "",
      lastLoginAt: new Date(),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );

  const token = jwt.sign(
    { sub: payload.sub, email: payload.email },
    config.jwtSecret,
    { expiresIn: "7d" },
  );

  return {
    token,
    user: {
      email: payload.email,
      name: payload.name || payload.email,
      picture: payload.picture || "",
      sub: payload.sub,
    },
  };
}

export async function googleAuth(req, res) {
  try {
    const { credential } = req.body || {};
    if (!credential || typeof credential !== "string") {
      return res.status(400).json({ error: "Body must include { credential } (Google ID token)" });
    }
    const data = await verifyCredentialAndSignIn(credential);
    return res.json(data);
  } catch (err) {
    if (err?.status) {
      const body = { error: err.message };
      if (err.status === 403 && err.email) body.email = err.email;
      return res.status(err.status).json(body);
    }
    console.error("[auth] googleAuth", err.message);
    return res.status(401).json({ error: "Google sign-in verification failed" });
  }
}

export async function googleGsiCallback(req, res) {
  const returnOrigin = pickReturnOrigin(req.body?.state);

  const csrfCookie = req.cookies?.g_csrf_token;
  const csrfBody = req.body?.g_csrf_token;
  if (!csrfCookie || csrfCookie !== csrfBody) {
    console.warn("[auth] googleGsiCallback CSRF mismatch");
    return res.redirect(302, `${returnOrigin}/login?auth_err=csrf`);
  }

  const credential = req.body?.credential;
  if (!credential || typeof credential !== "string") {
    return res.redirect(302, `${returnOrigin}/login?auth_err=missing_credential`);
  }

  try {
    const data = await verifyCredentialAndSignIn(credential);
    const hash = `gp_token=${encodeURIComponent(data.token)}`;
    return res.redirect(302, `${returnOrigin}/login#${hash}`);
  } catch (err) {
    if (err?.status === 403) {
      const q = new URLSearchParams({
        reason: String(err.reason || "notOnAllowList"),
        email: err.email ? String(err.email) : "",
      });
      return res.redirect(302, `${returnOrigin}/access-denied?${q.toString()}`);
    }
    if (err?.status === 401) {
      return res.redirect(
        302,
        `${returnOrigin}/login?auth_err=${encodeURIComponent(err.message || "unauthorized")}`,
      );
    }
    if (err?.status === 500) {
      return res.redirect(
        302,
        `${returnOrigin}/login?auth_err=${encodeURIComponent(err.message || "server")}`,
      );
    }
    console.error("[auth] googleGsiCallback", err);
    return res.redirect(302, `${returnOrigin}/login?auth_err=verification_failed`);
  }
}

export async function me(req, res) {
  if (!req.authUser) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const user = await User.findOne({ googleSub: req.authUser.sub }).lean();
  return res.json({
    user: user
      ? { email: user.email, name: user.name, picture: user.picture, sub: user.googleSub }
      : { email: req.authUser.email, sub: req.authUser.sub },
  });
}

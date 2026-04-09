import jwt from "jsonwebtoken";
import { config } from "../config/index.js";

export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid Authorization header" });
  }
  if (!config.jwtSecret) {
    return res.status(500).json({ error: "Server JWT_SECRET is not configured" });
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.authUser = {
      sub: payload.sub,
      email: payload.email,
    };
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

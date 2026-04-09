import multer from "multer";
import { randomUUID } from "crypto";
import { GALLERY_CATEGORIES } from "../models/GalleryImage.js";

const storage = multer.memoryStorage();

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function slugPart(raw, maxLen) {
  const s = String(raw || "")
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
    .replace(/-+/g, "-")
    .slice(0, maxLen);
  return s || "image";
}

/**
 * Storage object base name without extension (.webp added later).
 * Custom label: `{slug}-{uuid}`  Otherwise: `{category}-{uuid}` (no original filename).
 */
export function resolveGalleryStorageStem(categorySlug = "", optionalLabel = "", clientUuid = "") {
  let id = String(clientUuid || "").trim();
  if (!UUID_RE.test(id)) id = randomUUID();

  const label = String(optionalLabel || "").trim();
  if (label) {
    return `${slugPart(label, 80)}-${id}`;
  }
  return `${slugPart(categorySlug, 60)}-${id}`;
}

export const galleryUpload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (_, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image uploads are allowed"));
      return;
    }
    cb(null, true);
  },
});

export function validateGalleryCategory(req, res, next) {
  const cat = String(req.params.category || "").toLowerCase();
  if (!GALLERY_CATEGORIES.includes(cat)) {
    return res.status(400).json({
      error: `Invalid category. Use one of: ${GALLERY_CATEGORIES.join(", ")}`,
    });
  }
  next();
}

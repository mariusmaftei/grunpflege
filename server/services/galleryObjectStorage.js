import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getFirebaseBucket, isFirebaseConfigured } from "../config/firebase.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function resolveGalleryStorageMode() {
  const raw = (process.env.GALLERY_STORAGE || "auto").trim().toLowerCase();
  if (raw === "firebase" || raw === "local") return raw;
  return "auto";
}

async function saveToFirebase({ storagePath, buffer, mimetype }) {
  const bucket = getFirebaseBucket();
  const f = bucket.file(storagePath);
  const contentType = String(mimetype || "").toLowerCase().includes("webp")
    ? "image/webp"
    : mimetype || "application/octet-stream";

  await f.save(buffer, {
    contentType,
    resumable: false,
    metadata: {
      cacheControl: "public, max-age=31536000, immutable",
    },
  });
  try {
    await f.makePublic();
  } catch (e) {
    console.warn("[gallery] makePublic:", e?.message || e);
  }
  const urlPath = f.publicUrl();
  return { urlPath, storageProvider: "firebase" };
}

function saveToLocalDisk({ category, fileName, buffer }) {
  const uploadsRoot = path.join(__dirname, "..", "uploads");
  const dir = path.join(uploadsRoot, "gallery", category);
  fs.mkdirSync(dir, { recursive: true });
  const diskPath = path.join(dir, fileName);
  fs.writeFileSync(diskPath, buffer);
  const urlPath = `/uploads/gallery/${category}/${fileName}`.replace(/\\/g, "/");
  return { urlPath, storageProvider: "local" };
}

export async function putGalleryImageObject({ category, fileName, storagePath, buffer, mimetype }) {
  const mode = resolveGalleryStorageMode();

  if (mode === "local") {
    const { urlPath, storageProvider } = saveToLocalDisk({ category, fileName, buffer });
    return { urlPath, storagePath, storageProvider };
  }

  if (mode === "firebase") {
    return { storagePath, ...(await saveToFirebase({ storagePath, buffer, mimetype })) };
  }

  if (isFirebaseConfigured()) {
    try {
      return { storagePath, ...(await saveToFirebase({ storagePath, buffer, mimetype })) };
    } catch (e) {
      console.warn("[gallery] Firebase upload failed, using local disk:", e?.message || e);
    }
  }

  const { urlPath, storageProvider } = saveToLocalDisk({ category, fileName, buffer });
  return { urlPath, storagePath, storageProvider };
}

function localFileAbsolute(storagePath) {
  const rel = String(storagePath || "")
    .replace(/\\/g, "/")
    .replace(/^\/+/, "");
  if (!rel || rel.includes("..")) return null;
  return path.join(__dirname, "..", "uploads", ...rel.split("/"));
}

function unlinkQuiet(p) {
  try {
    if (p && fs.existsSync(p)) fs.unlinkSync(p);
  } catch (e) {
    console.warn("[gallery] unlink:", e?.message || e);
  }
}

/**
 * Removes main + thumb objects for a GalleryImage document (Firebase or local disk).
 */
export async function deleteGalleryStoredFiles(doc) {
  const provider = doc.storageProvider || "local";
  const mainPath = doc.storagePath;
  const thumbPath = doc.thumbStoragePath;

  if (provider === "firebase") {
    if (!isFirebaseConfigured()) {
      console.warn("[gallery] delete: Firebase not configured, skipping remote delete");
      return;
    }
    try {
      const bucket = getFirebaseBucket();
      if (mainPath) await bucket.file(String(mainPath)).delete({ ignoreNotFound: true });
      if (thumbPath) await bucket.file(String(thumbPath)).delete({ ignoreNotFound: true });
    } catch (e) {
      console.warn("[gallery] Firebase delete:", e?.message || e);
    }
    return;
  }

  unlinkQuiet(localFileAbsolute(mainPath));
  unlinkQuiet(localFileAbsolute(thumbPath));
}

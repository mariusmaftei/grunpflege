import { GalleryImage, GALLERY_CATEGORIES } from "../models/GalleryImage.js";
import { resolveGalleryStorageStem } from "../middleware/uploadMiddleware.js";
import { putGalleryImageObject, deleteGalleryStoredFiles } from "../services/galleryObjectStorage.js";
import { encodeGalleryWebp, encodeGalleryThumbWebp } from "../services/galleryImageWebp.js";

function isValidObjectId(id) {
  const s = String(id || "");
  return s.length === 24 && /^[a-f0-9]{24}$/i.test(s);
}

function parseMultipartBoolean(raw, defaultValue = true) {
  if (raw === undefined || raw === null || raw === "") return defaultValue;
  const s = String(raw).toLowerCase().trim();
  if (["false", "0", "no", "off"].includes(s)) return false;
  if (["true", "1", "yes", "on"].includes(s)) return true;
  return defaultValue;
}

export async function uploadGalleryImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Missing file field \"image\" (multipart/form-data)" });
    }

    const category = String(req.params.category || "").toLowerCase();
    if (!GALLERY_CATEGORIES.includes(category)) {
      return res.status(400).json({
        error: `Invalid category. Use one of: ${GALLERY_CATEGORIES.join(", ")}`,
      });
    }

    const description = String(req.body?.description || "").trim();
    if (!description) {
      return res.status(400).json({ error: "Description is required" });
    }

    const title = String(req.body?.title || "").trim().slice(0, 200);
    const alt = String(req.body?.alt || "").trim().slice(0, 500);

    const fileBaseName = String(req.body?.fileBaseName || "").trim().slice(0, 120);
    const storageUuid = String(req.body?.storageUuid || "").trim();
    const stem = resolveGalleryStorageStem(category, fileBaseName, storageUuid);
    const fileName = `${stem}.webp`;
    const thumbFileName = `${stem}-thumb.webp`;
    const storagePath = `gallery/${category}/${fileName}`.replace(/\\/g, "/");
    const thumbStoragePath = `gallery/${category}/${thumbFileName}`.replace(/\\/g, "/");

    let webp;
    let thumbWebp;
    try {
      webp = await encodeGalleryWebp(req.file.buffer);
      thumbWebp = await encodeGalleryThumbWebp(req.file.buffer);
    } catch (e) {
      console.error("[upload] encode gallery WebP variants", e);
      return res.status(400).json({
        error: "Could not convert image to WebP. Use a normal PNG, JPG, or WebP file.",
      });
    }

    const [mainPut, thumbPut] = await Promise.all([
      putGalleryImageObject({
        category,
        fileName,
        storagePath,
        buffer: webp.buffer,
        mimetype: webp.mimeType,
      }),
      putGalleryImageObject({
        category,
        fileName: thumbFileName,
        storagePath: thumbStoragePath,
        buffer: thumbWebp.buffer,
        mimetype: thumbWebp.mimeType,
      }),
    ]);

    const { urlPath, storageProvider } = mainPut;

    const isPublished = parseMultipartBoolean(req.body?.isPublished, true);

    const doc = await GalleryImage.create({
      category,
      fileName,
      originalName: req.file.originalname || "",
      mimeType: webp.mimeType,
      size: webp.buffer.length,
      urlPath,
      storagePath,
      storageProvider,
      thumbUrlPath: thumbPut.urlPath,
      thumbStoragePath,
      thumbSize: thumbWebp.buffer.length,
      title,
      description,
      alt: alt || title || "",
      isPublished,
      uploadedBy: req.authUser?.email || "",
    });

    return res.status(201).json({
      image: {
        id: String(doc._id),
        category: doc.category,
        fileName: doc.fileName,
        urlPath: doc.urlPath,
        thumbUrlPath: doc.thumbUrlPath,
        thumbSize: doc.thumbSize,
        title: doc.title,
        description: doc.description,
        alt: doc.alt,
        originalName: doc.originalName,
        size: doc.size,
        storageProvider: doc.storageProvider,
        isPublished: doc.isPublished !== false,
        createdAt: doc.createdAt,
      },
    });
  } catch (err) {
    console.error("[upload] uploadGalleryImage", err);
    const message = err?.message || "Failed to save image metadata";
    return res.status(500).json({ error: message });
  }
}

export async function listPublicGalleryImages(req, res) {
  try {
    const category = req.query.category;
    const filter = { isPublished: true };
    if (category && GALLERY_CATEGORIES.includes(String(category).toLowerCase())) {
      filter.category = String(category).toLowerCase();
    }

    const sortNewest = String(req.query.sort || "").toLowerCase() === "newest";
    const rawLimit = req.query.limit;
    const rawOffset = req.query.offset;
    const limitParsed = parseInt(String(rawLimit ?? ""), 10);
    const offsetParsed = parseInt(String(rawOffset ?? ""), 10);
    const limit =
      Number.isFinite(limitParsed) && limitParsed > 0
        ? Math.min(500, limitParsed)
        : 200;
    const offset =
      Number.isFinite(offsetParsed) && offsetParsed >= 0 ? offsetParsed : 0;

    const sortSpec = sortNewest
      ? { createdAt: -1 }
      : { sortOrder: 1, createdAt: -1 };

    const items = await GalleryImage.find(filter)
      .sort(sortSpec)
      .skip(offset)
      .limit(limit)
      .lean();
    return res.json({
      images: items.map((d) => ({
        id: String(d._id),
        category: d.category,
        urlPath: d.urlPath,
        thumbUrlPath: d.thumbUrlPath || "",
        title: d.title || "",
        description: d.description || "",
        alt: d.alt || "",
        createdAt: d.createdAt,
      })),
    });
  } catch (err) {
    console.error("[upload] listPublicGalleryImages", err);
    return res.status(500).json({ error: "Failed to load gallery" });
  }
}

export async function listGalleryImages(req, res) {
  const category = req.query.category;
  const publishedOnly = String(req.query.publishedOnly || "") === "1" || String(req.query.publishedOnly || "").toLowerCase() === "true";
  const filter = {};
  if (category && GALLERY_CATEGORIES.includes(String(category).toLowerCase())) {
    filter.category = String(category).toLowerCase();
  }
  if (publishedOnly) {
    filter.isPublished = true;
  }
  const items = await GalleryImage.find(filter).sort({ sortOrder: 1, createdAt: -1 }).limit(200).lean();
  return res.json({
    images: items.map((d) => ({
      id: String(d._id),
      category: d.category,
      urlPath: d.urlPath,
      thumbUrlPath: d.thumbUrlPath || "",
      thumbSize: typeof d.thumbSize === "number" ? d.thumbSize : 0,
      storagePath: d.storagePath || "",
      storageProvider: d.storageProvider || "",
      title: d.title || "",
      description: d.description || "",
      alt: d.alt || "",
      isPublished: d.isPublished !== false,
      sortOrder: typeof d.sortOrder === "number" ? d.sortOrder : 0,
      originalName: d.originalName,
      size: d.size,
      uploadedBy: d.uploadedBy,
      createdAt: d.createdAt,
    })),
  });
}

export async function patchGalleryImage(req, res) {
  try {
    const id = String(req.params.id || "");
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid image id" });
    }

    const body = req.body || {};
    const updates = {};

    if (body.description !== undefined) {
      const d = String(body.description).trim();
      if (!d) {
        return res.status(400).json({ error: "Description is required" });
      }
      updates.description = d.slice(0, 4000);
    }
    if (body.title !== undefined) {
      updates.title = String(body.title).trim().slice(0, 200);
    }
    if (body.alt !== undefined) {
      updates.alt = String(body.alt).trim().slice(0, 500);
    }
    if (body.isPublished !== undefined) {
      updates.isPublished = Boolean(body.isPublished);
    }
    if (body.sortOrder !== undefined) {
      const n = Number(body.sortOrder);
      updates.sortOrder = Number.isFinite(n) ? n : 0;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: "No valid fields to update" });
    }

    const doc = await GalleryImage.findByIdAndUpdate(id, { $set: updates }, { new: true }).lean();
    if (!doc) {
      return res.status(404).json({ error: "Image not found" });
    }

    return res.json({
      image: {
        id: String(doc._id),
        category: doc.category,
        fileName: doc.fileName,
        urlPath: doc.urlPath,
        thumbUrlPath: doc.thumbUrlPath || "",
        title: doc.title || "",
        description: doc.description || "",
        alt: doc.alt || "",
        isPublished: doc.isPublished !== false,
        sortOrder: typeof doc.sortOrder === "number" ? doc.sortOrder : 0,
        storageProvider: doc.storageProvider || "",
        createdAt: doc.createdAt,
      },
    });
  } catch (err) {
    console.error("[upload] patchGalleryImage", err);
    return res.status(500).json({ error: err?.message || "Update failed" });
  }
}

export async function deleteGalleryImage(req, res) {
  try {
    const id = String(req.params.id || "");
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid image id" });
    }

    const doc = await GalleryImage.findById(id).lean();
    if (!doc) {
      return res.status(404).json({ error: "Image not found" });
    }

    await deleteGalleryStoredFiles(doc);
    await GalleryImage.findByIdAndDelete(id);

    return res.status(204).send();
  } catch (err) {
    console.error("[upload] deleteGalleryImage", err);
    return res.status(500).json({ error: err?.message || "Delete failed" });
  }
}

export async function replaceGalleryImage(req, res) {
  try {
    const id = String(req.params.id || "");
    if (!isValidObjectId(id)) {
      return res.status(400).json({ error: "Invalid image id" });
    }
    if (!req.file) {
      return res.status(400).json({ error: "Missing file field \"image\" (multipart/form-data)" });
    }

    const doc = await GalleryImage.findById(id);
    if (!doc) {
      return res.status(404).json({ error: "Image not found" });
    }

    const category = doc.category;
    const fileName = doc.fileName;
    const thumbFileName = fileName.replace(/\.webp$/i, "") + "-thumb.webp";

    let webp;
    let thumbWebp;
    try {
      webp = await encodeGalleryWebp(req.file.buffer);
      thumbWebp = await encodeGalleryThumbWebp(req.file.buffer);
    } catch (e) {
      console.error("[upload] replaceGalleryImage encode", e);
      return res.status(400).json({
        error: "Could not convert image to WebP. Use a normal PNG, JPG, or WebP file.",
      });
    }

    const [mainPut, thumbPut] = await Promise.all([
      putGalleryImageObject({
        category,
        fileName,
        storagePath: doc.storagePath,
        buffer: webp.buffer,
        mimetype: webp.mimeType,
      }),
      putGalleryImageObject({
        category,
        fileName: thumbFileName,
        storagePath: doc.thumbStoragePath,
        buffer: thumbWebp.buffer,
        mimetype: thumbWebp.mimeType,
      }),
    ]);

    doc.mimeType = webp.mimeType;
    doc.size = webp.buffer.length;
    doc.urlPath = mainPut.urlPath;
    doc.thumbUrlPath = thumbPut.urlPath;
    doc.thumbSize = thumbWebp.buffer.length;
    doc.originalName = req.file.originalname || doc.originalName;
    await doc.save();

    return res.json({
      image: {
        id: String(doc._id),
        category: doc.category,
        fileName: doc.fileName,
        urlPath: doc.urlPath,
        thumbUrlPath: doc.thumbUrlPath,
        thumbSize: doc.thumbSize,
        size: doc.size,
        storageProvider: doc.storageProvider,
      },
    });
  } catch (err) {
    console.error("[upload] replaceGalleryImage", err);
    return res.status(500).json({ error: err?.message || "Replace failed" });
  }
}

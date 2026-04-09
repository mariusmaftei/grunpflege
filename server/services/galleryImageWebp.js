import sharp from "sharp";

const DEFAULT_MAX_BYTES = 200 * 1024;
const DEFAULT_MAX_DIMENSION = 1920;
const DEFAULT_INITIAL_MAX_SIDE = 1280;

function envInt(name, fallback) {
  const n = Number(process.env[name]);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback;
}

async function encodeAt(inputBuffer, maxSidePx, quality) {
  let p = sharp(inputBuffer, { failOn: "none" }).rotate();
  if (maxSidePx && maxSidePx > 0) {
    p = p.resize(maxSidePx, maxSidePx, {
      fit: "inside",
      withoutEnlargement: true,
    });
  }
  return p
    .webp({
      quality,
      effort: 6,
      smartSubsample: true,
      lossless: false,
    })
    .toBuffer();
}

/**
 * Main gallery / preview WebP, enforced at or below maxBytes (default ~200 KiB).
 */
export async function encodeGalleryWebp(inputBuffer) {
  const maxBytes = envInt("GALLERY_WEBP_MAX_BYTES", DEFAULT_MAX_BYTES);
  const maxDim = envInt("GALLERY_MAX_DIMENSION", DEFAULT_MAX_DIMENSION);
  const initialMaxSide = envInt("GALLERY_WEBP_INITIAL_MAX_SIDE", DEFAULT_INITIAL_MAX_SIDE);

  const meta = await sharp(inputBuffer, { failOn: "none" }).metadata();
  const w = meta.width || 0;
  const h = meta.height || 0;
  const longest = w && h ? Math.max(w, h) : 0;

  let side = longest
    ? Math.min(longest, maxDim, initialMaxSide)
    : Math.min(maxDim, initialMaxSide);

  let quality = 76;
  let buf = await encodeAt(inputBuffer, side, quality);

  while (buf.length > maxBytes && quality > 22) {
    quality -= 4;
    buf = await encodeAt(inputBuffer, side, quality);
  }

  while (buf.length > maxBytes && side > 200) {
    side = Math.max(200, Math.round(side * 0.8));
    quality = Math.min(quality, 70);
    buf = await encodeAt(inputBuffer, side, quality);
    while (buf.length > maxBytes && quality > 20) {
      quality -= 3;
      buf = await encodeAt(inputBuffer, side, quality);
    }
  }

  if (buf.length > maxBytes) {
    buf = await encodeAt(inputBuffer, 180, 20);
  }
  if (buf.length > maxBytes) {
    buf = await encodeAt(inputBuffer, 160, 18);
  }

  if (buf.length > maxBytes) {
    throw new Error(
      `WebP is still ${Math.ceil(buf.length / 1024)}KB; maximum is ${Math.ceil(maxBytes / 1024)}KB`,
    );
  }

  const outMeta = await sharp(buf).metadata();
  const fmt = (outMeta.format || "").toLowerCase();
  if (fmt !== "webp") {
    throw new Error(`Expected WebP output, got: ${fmt || "unknown"}`);
  }

  return {
    buffer: buf,
    mimeType: "image/webp",
    widthOut: outMeta.width,
    heightOut: outMeta.height,
  };
}

async function encodeThumbAt(inputBuffer, maxSidePx, quality) {
  let p = sharp(inputBuffer, { failOn: "none" }).rotate();
  if (maxSidePx && maxSidePx > 0) {
    p = p.resize(maxSidePx, maxSidePx, {
      fit: "inside",
      withoutEnlargement: true,
    });
  }
  return p
    .webp({
      quality,
      effort: 6,
      smartSubsample: true,
      lossless: false,
    })
    .toBuffer();
}

/**
 * Small WebP for grid thumbnails / LCP-friendly listing (default cap ~30KB, ~10–30KB typical).
 */
export async function encodeGalleryThumbWebp(inputBuffer) {
  const maxBytes = envInt("GALLERY_THUMB_MAX_BYTES", 30 * 1024);
  const maxSide = envInt("GALLERY_THUMB_MAX_SIDE", 440);

  let side = maxSide;
  let quality = 78;
  let buf = await encodeThumbAt(inputBuffer, side, quality);

  while (buf.length > maxBytes && quality > 24) {
    quality -= 4;
    buf = await encodeThumbAt(inputBuffer, side, quality);
  }

  while (buf.length > maxBytes && side > 160) {
    side = Math.max(160, Math.round(side * 0.85));
    quality = Math.min(quality, 72);
    buf = await encodeThumbAt(inputBuffer, side, quality);
    while (buf.length > maxBytes && quality > 20) {
      quality -= 3;
      buf = await encodeThumbAt(inputBuffer, side, quality);
    }
  }

  if (buf.length > maxBytes) {
    buf = await encodeThumbAt(inputBuffer, 140, 20);
  }
  if (buf.length > maxBytes) {
    buf = await encodeThumbAt(inputBuffer, 120, 18);
  }

  if (buf.length > maxBytes) {
    throw new Error(
      `Thumbnail WebP is still ${Math.ceil(buf.length / 1024)}KB; maximum is ${Math.ceil(maxBytes / 1024)}KB`,
    );
  }

  const outMeta = await sharp(buf).metadata();
  const fmt = (outMeta.format || "").toLowerCase();
  if (fmt !== "webp") {
    throw new Error(`Expected WebP thumbnail, got: ${fmt || "unknown"}`);
  }

  return {
    buffer: buf,
    mimeType: "image/webp",
    widthOut: outMeta.width,
    heightOut: outMeta.height,
  };
}

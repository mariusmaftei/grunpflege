import { fetchJson, resolveMediaUrl } from "./api.js";

const FILTER_TO_API_CATEGORY = {
  gardens: "gardens",
  lawns: "lawn-care",
  trees: "tree-trimming-removal",
};

/**
 * @param {string} filterId - "all" | "gardens" | "lawns" | "trees"
 * @returns {string|undefined} API category slug or undefined for all
 */
export function galleryFilterToApiCategory(filterId) {
  if (filterId === "all") return undefined;
  return FILTER_TO_API_CATEGORY[filterId];
}

function normalizeItem(raw) {
  const fullSrc = resolveMediaUrl(raw.urlPath);
  return {
    id: String(raw.id),
    category: raw.category,
    src: fullSrc,
    fullSrc,
    alt: String(raw.alt || raw.title || "").trim() || "Gallery photo",
    description: String(raw.description || "").trim(),
  };
}

/**
 * Fetches published gallery images for the public site.
 * @param {string} filterId - dropdown value: all | gardens | lawns | trees
 */
export async function fetchPublicGalleryForFilter(filterId) {
  const apiCat = galleryFilterToApiCategory(filterId);
  const q = apiCat ? `?category=${encodeURIComponent(apiCat)}` : "";
  const data = await fetchJson(`/api/uploads/public/gallery${q}`);
  const list = Array.isArray(data.images) ? data.images : [];
  return list.map(normalizeItem);
}

const CAROUSEL_ROW_SIZE = 10;
const CAROUSEL_FETCH = 30;

function carouselVisualShape(id) {
  let h = 0;
  for (let i = 0; i < id.length; i += 1) {
    h = (h * 31 + id.charCodeAt(i)) >>> 0;
  }
  const formats = ["wide", "normal", "square"];
  const f = formats[h % 3];
  const widths = { wide: 450, normal: 350, square: 280 };
  return { format: f, width: widths[f] };
}

function mapApiToCarouselItem(raw) {
  const id = String(raw.id);
  const src = raw.thumbUrlPath
    ? resolveMediaUrl(raw.thumbUrlPath)
    : resolveMediaUrl(raw.urlPath);
  const { format, width } = carouselVisualShape(id);
  return {
    id,
    src,
    width,
    format,
    alt: String(raw.alt || raw.title || "").trim() || "Gallery photo",
    description: String(raw.description || "").trim(),
  };
}

/**
 * Home page: three rows × 10 images = 30 newest published uploads (by createdAt).
 */
export async function fetchHomeCarouselConfig() {
  const q = new URLSearchParams({
    sort: "newest",
    limit: String(CAROUSEL_FETCH),
    offset: "0",
  });
  const data = await fetchJson(`/api/uploads/public/gallery?${q}`);
  const list = Array.isArray(data.images) ? data.images : [];
  const items = list.map(mapApiToCarouselItem);
  return [
    {
      images: items.slice(0, CAROUSEL_ROW_SIZE),
      duration: 35,
      reverse: false,
      rowId: "home-carousel-newest",
    },
    {
      images: items.slice(CAROUSEL_ROW_SIZE, CAROUSEL_ROW_SIZE * 2),
      duration: 45,
      reverse: true,
      rowId: "home-carousel-mid",
    },
    {
      images: items.slice(CAROUSEL_ROW_SIZE * 2, CAROUSEL_FETCH),
      duration: 40,
      reverse: false,
      rowId: "home-carousel-older",
    },
  ];
}

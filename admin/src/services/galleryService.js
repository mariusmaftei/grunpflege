export const GALLERY_CATEGORIES = [
  { id: "gardens", label: "Gardens", hint: "Flower beds, planting, borders" },
  { id: "lawn-care", label: "Lawn Care", hint: "Mowing, turf, lawn maintenance" },
  { id: "tree-trimming-removal", label: "Tree Trimming / Removal", hint: "Pruning, canopy work, removals" },
  { id: "planting", label: "Planting", hint: "Beds, shrubs, seasonal planting" },
  { id: "irrigation", label: "Irrigation", hint: "Sprinklers, drip lines, watering systems" },
  { id: "landscaping", label: "Landscaping", hint: "Hardscape, design, outdoor improvements" },
  { id: "seasonal-cleaning", label: "Seasonal Cleaning", hint: "Spring/fall cleanup, debris removal" },
];

export function galleryStoragePath(categoryId, fileName) {
  const safe = String(fileName || "image")
    .replace(/^.*[/\\]/, "")
    .replace(/[^a-zA-Z0-9._-]/g, "_");
  return `gallery/${categoryId}/${Date.now()}_${safe}`;
}

function slugPart(s, max) {
  const out = String(s || "")
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
    .replace(/-+/g, "-")
    .slice(0, max);
  return out || "image";
}

/** Matches server: custom `{slug}-{uuid}.webp` or default `{category}-{uuid}.webp`. */
export function buildGalleryObjectPath(categoryId, originalFileName, optionalBaseName, storageUuid) {
  const uuid = String(storageUuid || "").trim() || "…";
  if (String(optionalBaseName || "").trim()) {
    return `gallery/${categoryId}/${slugPart(optionalBaseName, 80)}-${uuid}.webp`;
  }
  return `gallery/${categoryId}/${slugPart(categoryId, 60)}-${uuid}.webp`;
}

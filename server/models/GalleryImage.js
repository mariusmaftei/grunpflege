import mongoose from "mongoose";

const CATEGORIES = [
  "gardens",
  "lawn-care",
  "tree-trimming-removal",
  "planting",
  "irrigation",
  "landscaping",
  "seasonal-cleaning",
];

const galleryImageSchema = new mongoose.Schema(
  {
    category: { type: String, required: true, enum: CATEGORIES, index: true },
    fileName: { type: String, required: true },
    originalName: { type: String, default: "" },
    mimeType: { type: String, default: "" },
    size: { type: Number, default: 0 },

    urlPath: { type: String, required: true },
    storagePath: { type: String, default: "" },

    thumbUrlPath: { type: String, default: "" },
    thumbStoragePath: { type: String, default: "" },
    thumbSize: { type: Number, default: 0 },

    storageProvider: {
      type: String,
      default: "firebase",
      enum: ["firebase", "local"],
    },

    title: { type: String, default: "", trim: true, maxlength: 200 },
    description: { type: String, default: "", trim: true, maxlength: 4000 },
    alt: { type: String, default: "", trim: true, maxlength: 500 },

    isPublished: { type: Boolean, default: true, index: true },
    sortOrder: { type: Number, default: 0 },

    uploadedBy: { type: String, default: "" },
  },
  { timestamps: true },
);

export const GALLERY_CATEGORIES = CATEGORIES;
export const GalleryImage =
  mongoose.models.GalleryImage || mongoose.model("GalleryImage", galleryImageSchema);

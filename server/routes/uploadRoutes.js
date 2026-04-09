import { Router } from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { galleryUpload, validateGalleryCategory } from "../middleware/uploadMiddleware.js";
import * as uploadController from "../controllers/uploadController.js";

const router = Router();

router.get("/public/gallery", uploadController.listPublicGalleryImages);
router.get("/gallery", requireAuth, uploadController.listGalleryImages);
router.patch("/gallery/:id", requireAuth, uploadController.patchGalleryImage);
router.post("/gallery/:id/metadata", requireAuth, uploadController.patchGalleryImage);
router.delete("/gallery/:id", requireAuth, uploadController.deleteGalleryImage);
router.post(
  "/gallery/:id/replace",
  requireAuth,
  galleryUpload.single("image"),
  uploadController.replaceGalleryImage,
);
router.post(
  "/gallery/:category",
  requireAuth,
  validateGalleryCategory,
  galleryUpload.single("image"),
  uploadController.uploadGalleryImage,
);

export default router;

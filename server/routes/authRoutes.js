import { Router } from "express";
import * as authController from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/google", authController.googleAuth);
router.post("/google/gsi-callback", authController.googleGsiCallback);
router.get("/me", requireAuth, authController.me);

export default router;

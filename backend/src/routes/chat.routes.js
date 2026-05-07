import { Router } from "express";
import { analyzeImage, chat } from "../controllers/chat.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = Router();

router.post("/chat", authMiddleware, chat);
router.post("/analyze-image", authMiddleware, upload.single("image"), analyzeImage);

export default router;

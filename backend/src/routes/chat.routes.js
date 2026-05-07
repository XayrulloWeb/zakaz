import { Router } from "express";
import { analyzeImage, chat } from "../controllers/chat.controller.js";
import { upload } from "../middleware/upload.middleware.js";

const router = Router();

router.post("/chat", chat);
router.post("/analyze-image", upload.single("image"), analyzeImage);

export default router;

import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import multer from "multer";
import { prisma } from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import chatRoutes from "./routes/chat.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = (
  process.env.CLIENT_URLS ||
  process.env.CLIENT_URL ||
  "http://localhost:5173,http://localhost:5174"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    // Разрешаем запросы без origin (Postman/curl) и локальную разработку
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    if (/^http:\/\/localhost:\d+$/.test(origin)) return callback(null, true);
    return callback(new Error("CORS ruxsat etilmagan origin."));
  },
  credentials: true
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "ai-architecture-backend",
    date: new Date().toISOString()
  });
});

app.use("/api/auth", authRoutes);
app.use("/api", chatRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: "Route topilmadi." });
});

app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        message: "Fayl hajmi juda katta. Maksimal hajm: 5MB."
      });
    }
    return res.status(400).json({
      message: err.message || "Fayl yuklashda xatolik yuz berdi."
    });
  }

  if (err?.message?.includes("Faqat rasm")) {
    return res.status(400).json({
      message: err.message
    });
  }

  if (err?.message?.includes("CORS")) {
    return res.status(403).json({
      message: err.message
    });
  }

  return res.status(500).json({
    message: "Serverda kutilmagan xatolik yuz berdi."
  });
});

async function startServer() {
  try {
    await prisma.$connect();
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server ishga tushdi: http://localhost:${PORT}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Serverni ishga tushirishda xatolik:", error);
    process.exit(1);
  }
}

startServer();

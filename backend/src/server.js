import cors from "cors";
import dotenv from "dotenv";
import express from "express";
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

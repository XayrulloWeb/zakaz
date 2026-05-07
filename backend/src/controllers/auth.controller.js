import bcrypt from "bcryptjs";
import { prisma } from "../config/db.js";
import { generateToken } from "../utils/generateToken.js";

function sanitizeUser(user) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

export async function register(req, res) {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "Barcha maydonlarni to'ldiring." });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Parol kamida 6 belgidan iborat bo'lishi kerak." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (existingUser) {
      return res.status(409).json({ message: "Bu email allaqachon ro'yxatdan o'tgan." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        fullName: fullName.trim(),
        email: normalizedEmail,
        password: hashedPassword
      }
    });

    return res.status(201).json({
      message: "Ro'yxatdan o'tish muvaffaqiyatli.",
      user: sanitizeUser(user)
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("register error:", {
      message: error?.message,
      code: error?.code,
      meta: error?.meta
    });

    if (error?.code === "P2021") {
      return res.status(500).json({
        message: "Database jadvali topilmadi. Prisma migratsiya/db push talab qilinadi."
      });
    }

    if (error?.code === "P1001") {
      return res.status(500).json({
        message: "Database server bilan ulanishda muammo bor."
      });
    }

    return res.status(500).json({ message: "Ro'yxatdan o'tishda server xatosi." });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email va parol kiritilishi shart." });
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user) {
      return res.status(401).json({ message: "Email yoki parol noto'g'ri." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Email yoki parol noto'g'ri." });
    }

    const token = generateToken({ userId: user.id, email: user.email });

    return res.json({
      message: "Kirish muvaffaqiyatli.",
      token,
      user: sanitizeUser(user)
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("login error:", {
      message: error?.message,
      code: error?.code,
      meta: error?.meta
    });

    return res.status(500).json({ message: "Kirishda server xatosi." });
  }
}

export async function me(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    if (!user) {
      return res.status(404).json({ message: "Foydalanuvchi topilmadi." });
    }

    return res.json({ user: sanitizeUser(user) });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("me error:", {
      message: error?.message,
      code: error?.code,
      meta: error?.meta
    });

    return res.status(500).json({ message: "Foydalanuvchi ma'lumotini olishda xatolik." });
  }
}

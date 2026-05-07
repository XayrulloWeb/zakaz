const topicMap = {
  cpu: "CPU - kompyuterning asosiy hisoblash qurilmasi. U buyruqlarni bajaradi, ma'lumotlarni qayta ishlaydi va boshqa qismlarni boshqaradi.",
  ram: "RAM - vaqtinchalik xotira. Dastur ishlayotgan paytda ma'lumotlar shu yerda saqlanadi va tizim tezligini oshiradi.",
  gpu: "GPU - grafik va parallel hisoblashlar uchun mo'ljallangan qurilma. Video, grafika va AI hisoblashlarda juda foydali.",
  motherboard:
    "Motherboard - barcha qurilmalarni bog'laydigan asosiy plata. CPU, RAM, SSD va boshqa qismlar shu yerda birlashadi.",
  cache:
    "Cache - CPU'ga yaqin juda tezkor xotira. Tez-tez ishlatiladigan ma'lumotlarni saqlab, ishlash unumdorligini oshiradi.",
  bus: "Bus - komponentlar orasida ma'lumot almashish yo'li. U signal va ma'lumotlarning harakatlanishini ta'minlaydi.",
  ssd: "SSD - tezkor doimiy xotira. Operatsion tizim va dasturlar HDD'ga nisbatan ancha tez ochiladi.",
  hdd: "HDD - magnit disk asosidagi doimiy xotira. Hajmi katta, narxi arzon, lekin SSD'dan sekinroq."
};

function buildChatAnswer(question) {
  const text = String(question || "").toLowerCase();
  const topicKey = Object.keys(topicMap).find((key) => hasTopic(text, key));

  if (topicKey) {
    return topicMap[topicKey];
  }

  return "Savolingiz uchun rahmat. Iltimos, CPU, RAM, GPU, Motherboard, Cache, Bus, SSD yoki HDD bo'yicha aniq savol yuboring.";
}

function hasTopic(text, key) {
  const pattern = new RegExp(`(^|[^a-zA-Z0-9])${key}([^a-zA-Z0-9]|$)`, "i");
  return pattern.test(text);
}

function parseCsvEnv(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function uniq(values) {
  return [...new Set(values)];
}

function getGeminiConfig() {
  const keys = uniq([
    ...parseCsvEnv(process.env.GEMINI_API_KEYS),
    process.env.GEMINI_API_KEY || ""
  ]).filter(Boolean);

  const models = uniq([
    ...parseCsvEnv(process.env.GEMINI_MODELS),
    process.env.GEMINI_MODEL || "gemini-1.5-flash",
    "gemini-flash-latest",
    "gemini-2.5-flash"
  ]).filter(Boolean);

  return { keys, models };
}

function extractGeminiText(data) {
  const candidates = data?.candidates || [];
  for (const candidate of candidates) {
    const parts = candidate?.content?.parts || [];
    const text = parts
      .map((part) => (typeof part?.text === "string" ? part.text : ""))
      .join("")
      .trim();

    if (text) return text;
  }
  return "";
}

function canRetryWithNextVariant(statusCode) {
  if ([400, 401].includes(statusCode)) return false;
  if ([403, 404, 408, 409, 429].includes(statusCode)) return true;
  if (statusCode >= 500) return true;
  return true;
}

// Добавлен параметр systemText для четкого разделения роли ИИ и запроса пользователя
async function callGeminiWithVariant(parts, apiKey, model, systemText = "") {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const payload = {
    contents: [{ role: "user", parts }],
    generationConfig: {
      temperature: 0.6, // Увеличено с 0.25 до 0.6, чтобы ответы были более естественными и без цикличности
      maxOutputTokens: 2048 // Увеличено с 1200 до 2048, чтобы исключить обрыв длинного ответа
    }
  };

  // Используем нативную функцию System Instruction от Gemini API
  if (systemText) {
    payload.systemInstruction = {
      parts: [{ text: systemText }]
    };
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(
      data?.error?.message ||
        `Gemini API xatosi: ${response.status} ${response.statusText}`
    );
    error.statusCode = response.status;
    throw error;
  }

  const text = extractGeminiText(data);
  if (!text) {
    const error = new Error("Gemini javobi bo'sh qaytdi.");
    error.statusCode = 502;
    throw error;
  }

  return text;
}

async function callGemini(parts, systemText = "") {
  const { keys, models } = getGeminiConfig();
  if (keys.length === 0) {
    throw new Error("GEMINI_API_KEY yoki GEMINI_API_KEYS mavjud emas.");
  }

  const errors = [];

  for (let keyIndex = 0; keyIndex < keys.length; keyIndex += 1) {
    const apiKey = keys[keyIndex];

    for (let modelIndex = 0; modelIndex < models.length; modelIndex += 1) {
      const model = models[modelIndex];
      try {
        const text = await callGeminiWithVariant(parts, apiKey, model, systemText);
        return { text, model };
      } catch (error) {
        const statusCode = Number(error?.statusCode || 0);
        errors.push(
          `k${keyIndex + 1}/m:${model} -> ${statusCode || "?"} ${error.message || "xato"}`
        );

        if (!canRetryWithNextVariant(statusCode)) {
          throw error;
        }
      }
    }
  }

  throw new Error(
    `Gemini variantlari ishlamadi: ${errors.slice(0, 6).join(" | ")}`
  );
}

const CHAT_SYSTEM_PROMPT = "Siz Kompyuter arxitekturasi fanidan tajribali o'qituvchisiz. Javoblaringiz faqat O'zbek lotin alifbosida, grammatik jihatdan to'g'ri va tushunarli bo'lishi shart. Talabaga do'stona va ilmiy tilda javob bering.";

export async function chat(req, res) {
  try {
    const { question } = req.body;

    if (!question || typeof question !== "string") {
      return res
        .status(400)
        .json({ message: "question maydoni matn ko'rinishida yuborilishi kerak." });
    }

    const prompt = `Savol: ${question.trim()}`;

    try {
      const result = await callGemini([{ text: prompt }], CHAT_SYSTEM_PROMPT);
      return res.json({
        source: "gemini",
        answer: result.text
      });
    } catch (geminiError) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("Gemini chat fallback:", geminiError?.message || geminiError);
      }
      return res.json({
        source: "mock",
        answer: buildChatAnswer(question)
      });
    }
  } catch (_error) {
    return res.status(500).json({ message: "Chat javobini yaratishda server xatosi." });
  }
}

const IMAGE_SYSTEM_PROMPT = "Siz kompyuter arxitekturasi fanidan dars beradigan professional AI o'qituvchisiz. Maqsadingiz talabalarga kompyuter qismlarini rasm orqali to'g'ri va batafsil tushuntirishdir. Javoblaringiz doim faqat O'zbek lotin alifbosida bo'lishi shart.";

function isShortImageAnalysis(text) {
  const clean = String(text || "").trim();
  const words = clean.split(/\s+/).filter(Boolean);
  return (
    clean.length < 700 ||
    words.length < 100 ||
    !clean.includes("1)") ||
    !clean.includes("2)") ||
    !clean.includes("3)") ||
    !clean.includes("4)")
  );
}

function buildImageAnalysisPrompt(isRetry = false) {
  return [
    "Iltimos, ushbu rasmda ko'rsatilgan qurilmani batafsil tahlil qiling.",
    "Javobni aniq quyidagi bandlar bo'yicha yozing (hech qanday salomlashish va ortiqcha so'zlarsiz):",
    isRetry
      ? "Oldingi javob juda qisqa bo'ldi. Endi majburiy ravishda batafsil, keng va to'liq javob yozing."
      : "",
    "",
    "1) Aniqlangan komponent:",
    "Rasmda qanday kompyuter qismi yoki qurilma tasvirlanganini aniq ayting.",
    "",
    "2) Kompyuter arxitekturasidagi vazifasi:",
    "Bu qurilma kompyuter tizimida qanday asosiy vazifa bajarishini batafsil tushuntiring.",
    "",
    "3) Ishlash prinsipi:",
    "Uning qanday ishlashi, ma'lumotlarni qanday qayta ishlashi yoki saqlashini oddiy va ilmiy tilda izohlang.",
    "",
    "4) Talaba uchun izoh va Xulosa:",
    "Bu mavzu nima uchun muhimligi va qurilmaning tizimdagi ahamiyati haqida umumiy xulosa bering."
  ]
    .filter(Boolean)
    .join("\n");
}

function buildForcedEducationalImageAnswer(rawAnswer = "") {
  const cleanRaw = String(rawAnswer || "").trim();
  return [
    "1) Aniqlangan komponent:",
    cleanRaw
      ? `${cleanRaw} Tasvirga qaraganda bu kompyuter arxitekturasi bilan bog'liq apparat komponenti bo'lishi mumkin.`
      : "Rasmda kompyuter arxitekturasi bilan bog'liq apparat komponenti ko'rinmoqda.",
    "",
    "2) Kompyuter arxitekturasidagi vazifasi:",
    "Ushbu turdagi komponentlar kompyuterning hisoblash, ma'lumot almashish yoki saqlash zanjirida muhim rol bajaradi. Ular CPU, RAM, motherboard va bus tizimi bilan birga ishlaydi.",
    "",
    "3) Ishlash prinsipi:",
    "Komponentlar o'zaro shinalar orqali bog'lanib, buyruqlar va ma'lumotlarni uzatadi. CPU hisoblashni bajaradi, RAM vaqtinchalik ma'lumotni saqlaydi, qolgan apparat qismlar esa jarayonning barqaror va tez ishlashini ta'minlaydi.",
    "",
    "4) Talaba uchun izoh va Xulosa:",
    "Bunday rasmli tahlil talabalarga nazariyani amaliy ko'rinishda tushunishga yordam beradi. Xulosa qilib aytganda, apparat qismlarining o'zaro ishlashi kompyuter arxitekturasining asosiy mazmunini tashkil qiladi."
  ].join("\n");
}

export async function analyzeImage(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Rasm fayli yuborilmadi." });
    }
    if (!req.file.mimetype?.startsWith("image/")) {
      return res.status(400).json({ message: "Faqat rasm fayllari qabul qilinadi." });
    }

    const imagePart = {
      inlineData: {
        mimeType: req.file.mimetype,
        data: req.file.buffer.toString("base64")
      }
    };

    try {
      // Отправляем чистый запрос (без сломанной логики повторных попыток)
      let result = await callGemini(
        [{ text: buildImageAnalysisPrompt(false) }, imagePart],
        IMAGE_SYSTEM_PROMPT
      );

      let answer = String(result.text || "").trim();

      if (isShortImageAnalysis(answer)) {
        result = await callGemini(
          [{ text: buildImageAnalysisPrompt(true) }, imagePart],
          IMAGE_SYSTEM_PROMPT
        );
        answer = String(result.text || "").trim();
      }

      let normalized = false;
      if (isShortImageAnalysis(answer)) {
        answer = buildForcedEducationalImageAnswer(answer);
        normalized = true;
      }

      return res.json({
        fileName: req.file.originalname,
        mimeType: req.file.mimetype,
        answer,
        analysis: answer,
        source: "gemini",
        mode: "gemini",
        model: result.model,
        normalized
      });
    } catch (geminiError) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("Gemini image fallback:", geminiError?.message || geminiError);
      }

      const answer = [
        "1) Aniqlangan komponent:",
        "Rasmni Gemini orqali tahlil qilishda texnik muammo yuz berdi.",
        "",
        "2) Kompyuter arxitekturasidagi vazifasi:",
        "Bunday komponentlar kompyuterning hisoblash, saqlash yoki ma'lumot almashish jarayonlarida ishtirok etadi.",
        "",
        "3) Ishlash prinsipi:",
        "Kompyuter qurilmalari CPU, RAM, motherboard va bus tizimi orqali bog'lanadi.",
        "",
        "4) Talaba uchun izoh va Xulosa:",
        "Sun'iy intellekt xatosi tufayli aniq ma'lumot berilmadi."
      ].join("\n");

      return res.json({
        fileName: req.file.originalname,
        mimeType: req.file.mimetype,
        answer,
        analysis: answer,
        source: "mock",
        mode: "mock"
      });
    }
  } catch (_error) {
    return res.status(500).json({ message: "Rasmni tahlil qilishda server xatosi." });
  }
} 
  
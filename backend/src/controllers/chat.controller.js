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
  const topicKey = Object.keys(topicMap).find((key) => text.includes(key));

  if (topicKey) {
    return topicMap[topicKey];
  }

  return "Savolingiz uchun rahmat. Iltimos, CPU, RAM, GPU, Motherboard, Cache, Bus, SSD yoki HDD bo'yicha aniq savol yuboring.";
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
    process.env.GEMINI_MODEL || "gemini-flash-latest",
    "gemini-flash-latest",
    "gemini-2.5-flash",
    "gemini-2.0-flash-001"
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

async function callGeminiWithVariant(parts, apiKey, model) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts }],
      generationConfig: {
        temperature: 0.25,
        maxOutputTokens: 1200
      }
    })
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

async function callGemini(parts) {
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
        const text = await callGeminiWithVariant(parts, apiKey, model);
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

function isShortImageAnalysis(text) {
  const clean = String(text || "").trim();
  return (
    clean.length < 280 ||
    clean.split(/\s+/).length < 45 ||
    !clean.includes("1)") ||
    !clean.includes("2)") ||
    !clean.includes("3)") ||
    !clean.includes("4)") ||
    !clean.includes("5)")
  );
}

function buildImageAnalysisPrompt(isRetry = false) {
  return [
    "Siz kompyuter arxitekturasi fanidan dars beradigan professional AI o'qituvchisiz.",
    "Yuklangan rasmni kompyuter arxitekturasi mavzusi bo'yicha tahlil qiling.",
    "Javob FAQAT Uzbek lotinda bo'lsin.",
    "Hech qanday salomlashish yozmang.",
    "Javobni qisqa qilmang.",
    "Kamida 90-130 so'z yozing.",
    "Javob diplom loyihasi uchun sifatli, tushunarli va o'quv uslubida bo'lsin.",
    "",
    isRetry
      ? "Oldingi javob juda qisqa bo'ldi. Endi majburiy ravishda to'liq, uzun va strukturali javob yozing."
      : "",
    "",
    "Javobni aynan shu formatda yozing:",
    "",
    "1) Aniqlangan komponent:",
    "Rasmda ko'rinayotgan qurilma yoki kompyuter qismini aniqlang. Agar aniq bo'lmasa, ehtimoliy variantni yozing.",
    "",
    "2) Kompyuter arxitekturasidagi vazifasi:",
    "Bu komponent kompyuter tizimida qanday vazifa bajarishini tushuntiring.",
    "",
    "3) Ishlash prinsipi:",
    "U qanday ishlashini oddiy tilda izohlang.",
    "",
    "4) Talaba uchun izoh:",
    "Bu mavzu kompyuter arxitekturasi fanida nima uchun muhimligini tushuntiring.",
    "",
    "5) Xulosa:",
    "Qisqa yakuniy xulosa yozing.",
    "",
    "Agar rasmda CPU socket, protsessor, RAM, GPU, motherboard, SSD, HDD, chipset, port yoki elektron plata bo'lsa, uni kompyuter arxitekturasi bilan bog'lab tushuntiring."
  ]
    .filter(Boolean)
    .join("\n");
}

export async function chat(req, res) {
  try {
    const { question } = req.body;

    if (!question || typeof question !== "string") {
      return res
        .status(400)
        .json({ message: "question maydoni matn ko'rinishida yuborilishi kerak." });
    }

    const prompt = [
      "Siz Kompyuter arxitekturasi fanidan tajribali o'qituvchisiz.",
      "Javob faqat Uzbek lotinda bo'lsin.",
      "Savolga aniq, tushunarli, 3-6 gap bilan javob bering.",
      "Mavzular: CPU, RAM, GPU, Motherboard, Cache, Bus, SSD, HDD.",
      `Savol: ${question.trim()}`
    ].join("\n");

    try {
      const result = await callGemini([{ text: prompt }]);
      return res.json({
        source: "gemini",
        answer: result.text
      });
    } catch (geminiError) {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
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
      let result = await callGemini([
        { text: buildImageAnalysisPrompt(false) },
        imagePart
      ]);

      let answer = String(result.text || "").trim();

      if (isShortImageAnalysis(answer)) {
        result = await callGemini([
          { text: buildImageAnalysisPrompt(true) },
          imagePart
        ]);
        answer = String(result.text || "").trim();
      }

      // Qasddan bir xil statik matn qaytarmaymiz:
      // agar javob hali ham qisqa bo'lsa ham, Gemini'dan olingan real natijani beramiz.
      // Mock faqat API xatolik holatida ishlatiladi.

      return res.json({
        fileName: req.file.originalname,
        mimeType: req.file.mimetype,
        answer,
        analysis: answer,
        source: "gemini",
        mode: "gemini",
        model: result.model
      });
    } catch (geminiError) {
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.warn("Gemini image fallback:", geminiError?.message || geminiError);
      }

      const answer = [
        "1) Aniqlangan komponent:",
        "Rasmni Gemini orqali tahlil qilishda texnik muammo yuz berdi, lekin yuklangan rasm kompyuter arxitekturasi bilan bog'liq apparat qismiga o'xshaydi.",
        "",
        "2) Kompyuter arxitekturasidagi vazifasi:",
        "Bunday komponentlar kompyuterning hisoblash, saqlash yoki ma'lumot almashish jarayonlarida ishtirok etadi.",
        "",
        "3) Ishlash prinsipi:",
        "Kompyuter qurilmalari CPU, RAM, motherboard, storage va bus tizimi orqali bir-biri bilan bog'lanadi.",
        "",
        "4) Talaba uchun izoh:",
        "Rasm orqali o'rganish talabalarga nazariy mavzuni amaliy ko'rinishda tushunishga yordam beradi.",
        "",
        "5) Xulosa:",
        "Sun'iy intellekt yordamida rasmni tahlil qilish kompyuter arxitekturasini o'qitishda interaktiv yondashuv yaratadi."
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

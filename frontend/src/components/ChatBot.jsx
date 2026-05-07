import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, ImagePlus, Send, User, Trash2 } from "lucide-react";
import {
  analyzeImage,
  getRecentChatMessages,
  sendChatMessage,
  setRecentChatMessages
} from "../services/api";
import { useToast } from "../context/ToastContext";

const DEFAULT_MESSAGES = [
  {
    role: "assistant",
    text: "Salom! CPU, RAM, GPU, Motherboard, Cache, Bus, SSD yoki HDD haqida savol bering."
  }
];

function modeBadgeClass(mode) {
  if (mode === "gemini") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }
  if (mode === "mock") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }
  if (mode === "error") {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }
  return "border-slate-200 bg-slate-100 text-slate-600";
}

function normalizeAssistantPayload(data) {
  return {
    text: data?.answer || data?.analysis || data?.message || "AI javobi bo'sh qaytdi.",
    source: data?.source || data?.mode || "unknown",
    model: data?.model || null
  };
}

function ChatBot() {
  const { showToast } = useToast();
  const messageObjectUrlsRef = useRef([]);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState(() => {
    const saved = getRecentChatMessages();
    if (Array.isArray(saved) && saved.length > 0) {
      return saved.map((msg) => ({
        ...msg,
        source: msg.source || msg.mode || ""
      }));
    }
    return DEFAULT_MESSAGES;
  });
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const storageSafeMessages = messages.map((message) => {
      if (!message?.imageUrl) return message;
      const { imageUrl, ...rest } = message;
      return rest;
    });
    setRecentChatMessages(storageSafeMessages);
  }, [messages]);

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl("");
      return undefined;
    }
    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  useEffect(() => {
    return () => {
      messageObjectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      messageObjectUrlsRef.current = [];
    };
  }, []);

  const canSend = useMemo(() => {
    return question.trim().length > 0 && !chatLoading && !imageLoading;
  }, [question, chatLoading, imageLoading]);

  const isBusy = chatLoading || imageLoading;

  function pushMessage(role, text, meta = {}) {
    setMessages((prev) => [
      ...prev,
      {
        role,
        text,
        ...meta
      }
    ]);
  }

  function createMessageImageUrl(file) {
    const url = URL.createObjectURL(file);
    messageObjectUrlsRef.current.push(url);
    return url;
  }

  function revokeMessageImageUrls() {
    messageObjectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    messageObjectUrlsRef.current = [];
  }

  function clearChat() {
    revokeMessageImageUrls();
    setMessages(DEFAULT_MESSAGES);
    setRecentChatMessages(DEFAULT_MESSAGES);
    setError("");
    showToast("Chat tarixi tozalandi.", "success");
  }

  async function handleAsk(event) {
    event.preventDefault();
    const input = question.trim();
    if (!input || isBusy) return;

    setError("");
    pushMessage("user", input);
    setQuestion("");
    setChatLoading(true);

    try {
      const data = await sendChatMessage(input);
      const normalized = normalizeAssistantPayload(data);
      pushMessage("assistant", normalized.text, {
        source: normalized.source,
        model: normalized.model
      });
    } catch (err) {
      const message =
        err?.message || "Chat server bilan ulanishda xatolik yuz berdi.";
      setError(message);
      pushMessage("assistant", message, { source: "error" });
      showToast("Chat server bilan ulanishda xatolik.", "error");
    } finally {
      setChatLoading(false);
    }
  }

  async function handleImageAnalyze() {
    if (!imageFile) {
      showToast("Avval rasm tanlang.", "info");
      return;
    }
    if (isBusy) return;

    setError("");
    setImageLoading(true);
    const imageUrl = createMessageImageUrl(imageFile);
    pushMessage("user", `Rasm yuborildi: ${imageFile.name}`, {
      imageUrl,
      fileName: imageFile.name
    });

    try {
      const data = await analyzeImage(imageFile);
      const normalized = normalizeAssistantPayload(data);
      pushMessage("assistant", normalized.text, {
        source: normalized.source,
        model: normalized.model
      });
      showToast("Rasm tahlili tayyor.", "success");
      setImageFile(null);
      setPreviewUrl("");
    } catch (err) {
      const message =
        err?.message || "Rasmni tahlil qilishda xatolik yuz berdi.";
      setError(message);
      pushMessage("assistant", message, { source: "error" });
      showToast("Rasm tahlilida xatolik.", "error");
    } finally {
      setImageLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <section className="glass-card p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-slate-900">AI Chatbot</h2>
          </div>
          <button
            type="button"
            onClick={clearChat}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Tozalash
          </button>
        </div>

        <div className="h-[340px] space-y-3 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-3">
          {messages.length === 0 ? (
            <p className="text-sm text-slate-500">Hozircha xabarlar yo'q.</p>
          ) : (
            messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-2 text-sm leading-6 shadow ${
                    message.role === "user"
                      ? "bg-indigo-600 text-white"
                      : "border border-slate-200 bg-white text-slate-700"
                  }`}
                >
                  <div className="mb-1 flex items-center gap-1 text-xs opacity-80">
                    {message.role === "user" ? (
                      <>
                        <User className="h-3.5 w-3.5" />
                        <span>Siz</span>
                      </>
                    ) : (
                      <>
                        <Bot className="h-3.5 w-3.5" />
                        <span>AI</span>
                      </>
                    )}
                    {message.role === "assistant" && message.source ? (
                      <span
                        className={`ml-2 rounded-md border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${modeBadgeClass(
                          message.source
                        )}`}
                      >
                        {message.source}
                      </span>
                    ) : null}
                  </div>
                  {message.text ? <p>{message.text}</p> : null}
                  {message.imageUrl ? (
                    <img
                      src={message.imageUrl}
                      alt={message.fileName || "Rasm yuborildi"}
                      className="mt-2 max-h-44 w-full rounded-lg border border-white/20 object-cover"
                    />
                  ) : null}
                </div>
              </div>
            ))
          )}

          {isBusy ? (
            <div className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600">
              <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-600" />
              {imageLoading ? "Rasm tahlil qilinmoqda..." : "AI javob tayyorlamoqda..."}
            </div>
          ) : null}
        </div>

        <form onSubmit={handleAsk} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Masalan: CPU nima?"
            disabled={isBusy}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none ring-indigo-100 transition focus:border-indigo-500 focus:ring-4 disabled:cursor-not-allowed disabled:bg-slate-100"
          />
          <button
            type="submit"
            disabled={!canSend}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send className="h-4 w-4" />
            {chatLoading ? "Yuborilmoqda..." : "Yuborish"}
          </button>
        </form>

        {error ? (
          <p className="mt-3 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </p>
        ) : null}
      </section>

      <aside className="glass-card h-fit p-5 sm:p-6">
        <div className="mb-3 flex items-center gap-2">
          <ImagePlus className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-slate-900">Rasm yuklash</h3>
        </div>
        <p className="text-sm text-slate-600">
          Kompyuter komponenti rasmini yuboring va sun'iy intellekt orqali tahlil
          natijasini oling.
        </p>
        <input
          type="file"
          accept="image/*"
          disabled={isBusy}
          onChange={(event) => setImageFile(event.target.files?.[0] || null)}
          className="mt-4 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm disabled:cursor-not-allowed disabled:bg-slate-100"
        />
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Rasm preview"
            className="mt-4 h-40 w-full rounded-xl border border-slate-200 object-cover"
          />
        ) : (
          <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5 text-center text-sm text-slate-500">
            Rasm tanlanmagan
          </div>
        )}
        <button
          type="button"
          onClick={handleImageAnalyze}
          disabled={!imageFile || isBusy}
          className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {imageLoading ? "Tahlil qilinmoqda..." : "Rasmni tahlil qilish"}
        </button>
      </aside>
    </div>
  );
}

export default ChatBot;

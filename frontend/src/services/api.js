const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const TOKEN_KEY = "ai_arch_token";
const VISITED_KEY = "ai_arch_visited_sections";
const CHAT_HISTORY_KEY = "ai_arch_recent_messages";

function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function authHeaders() {
  const token = getStoredToken();
  if (!token) {
    return {};
  }
  return {
    Authorization: `Bearer ${token}`
  };
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, options);
  const isJson = response.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    throw new Error(data?.message || data?.error || "Server xatosi yuz berdi.");
  }

  return data;
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function registerUser(payload) {
  return request("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

export async function loginUser(payload) {
  return request("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
}

export async function getMe(token) {
  return request("/api/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

export async function sendChatMessage(question) {
  return request("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders()
    },
    body: JSON.stringify({ question })
  });
}

export async function analyzeImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  return request("/api/analyze-image", {
    method: "POST",
    headers: {
      ...authHeaders()
    },
    body: formData
  });
}

export function markSectionVisited(sectionName) {
  const current = safeJsonParse(localStorage.getItem(VISITED_KEY), []);
  if (!Array.isArray(current)) {
    localStorage.setItem(VISITED_KEY, JSON.stringify([sectionName]));
    return;
  }

  if (!current.includes(sectionName)) {
    current.push(sectionName);
    localStorage.setItem(VISITED_KEY, JSON.stringify(current));
  }
}

export function getVisitedSections() {
  const value = safeJsonParse(localStorage.getItem(VISITED_KEY), []);
  return Array.isArray(value) ? value : [];
}

export function setRecentChatMessages(messages) {
  const clipped = Array.isArray(messages) ? messages.slice(-6) : [];
  localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(clipped));
}

export function getRecentChatMessages() {
  const value = safeJsonParse(localStorage.getItem(CHAT_HISTORY_KEY), []);
  return Array.isArray(value) ? value : [];
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
const TOKEN_KEY = "ai_arch_token";
const VISITED_KEY = "ai_arch_visited_sections";
const CHAT_HISTORY_KEY = "ai_arch_recent_messages";

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
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function sendChatMessage(question) {
  return request("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question })
  });
}

export async function analyzeImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  return request("/api/analyze-image", {
    method: "POST",
    body: formData
  });
}

export function markSectionVisited(sectionName) {
  const current = JSON.parse(localStorage.getItem(VISITED_KEY) || "[]");
  if (!current.includes(sectionName)) {
    current.push(sectionName);
    localStorage.setItem(VISITED_KEY, JSON.stringify(current));
  }
}

export function getVisitedSections() {
  return JSON.parse(localStorage.getItem(VISITED_KEY) || "[]");
}

export function setRecentChatMessages(messages) {
  const clipped = messages.slice(-6);
  localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(clipped));
}

export function getRecentChatMessages() {
  return JSON.parse(localStorage.getItem(CHAT_HISTORY_KEY) || "[]");
}


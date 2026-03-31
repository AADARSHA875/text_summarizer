const BASE = "";
const API_KEY_STORAGE = "apiKey";
export const DEFAULT_API_KEY = "summary";

export function getStoredApiKey() {
  if (typeof window === "undefined") return DEFAULT_API_KEY;
  return localStorage.getItem(API_KEY_STORAGE) || DEFAULT_API_KEY;
}

function classifyApiKeyError(status, detail) {
  const message = typeof detail === "string" ? detail.toLowerCase() : "";
  if (status === 401 || status === 403) {
    if (message.includes("expired")) return "API_KEY_EXPIRED";
    if (message.includes("api key") || message.includes("x-api-key")) return "API_KEY_MISSING";
  }
  return null;
}

async function req(path, options = {}, token = null, apiKey = null) {
  const headers = { ...options.headers };
  const resolvedApiKey = options.skipApiKey ? null : (apiKey ?? getStoredApiKey());
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (resolvedApiKey) headers["X-API-Key"] = resolvedApiKey;
  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const err = await res.json().catch(() => null);
    // Always include status code so callers can detect 503/502/504
    const detail = err?.detail ?? null;
    const message = typeof detail === "string"
      ? detail
      : detail != null
        ? JSON.stringify(detail)
        : `${res.status}`; // ← fallback is "503" not "Request failed"
    const error = new Error(message);
    error.status = res.status;
    error.code = classifyApiKeyError(res.status, detail);
    throw error;
  }

  if (res.status === 204) return null;
  return res.json();
}

// Decode JWT payload without verifying signature (client-side only)
function decodeJwt(token) {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    return decoded;
  } catch {
    return null;
  }
}

export const api = {
  register: (email, username, full_name, password) =>
    req("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, username, full_name, password }),
    }),

  login: (username, password) =>
    req("/api/v1/auth/login", {
      method: "POST",
      body: new URLSearchParams({ username, password }).toString(),
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    }),

  // No /me endpoint exists — decode user info from JWT token directly
  getMe: (token) => {
    const payload = decodeJwt(token);
    if (!payload) return Promise.reject(new Error("Invalid token"));
    return Promise.resolve({ uuid: payload.sub, _fromToken: true });
  },

  summarizeText: (text, token) =>
    req("/api/v3/summarize/text", { method: "POST", body: JSON.stringify({ text }) }, token),

  summarizePdf: (file, token, extractedText = "") => {
    const form = new FormData();
    form.append("file", file);
    if (extractedText) form.append("extracted_text", extractedText);
    return req("/api/v3/summarize/pdf", { method: "POST", body: form }, token);
  },

  getHistory: (token) => req("/api/v3/summarize/history", {}, token),
  deleteHistory: (id, token) => req(`/api/v3/summarize/history/${id}`, { method: "DELETE" }, token),
};

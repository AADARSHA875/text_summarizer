const BASE = "";

async function req(path, options = {}, token = null) {
  const headers = { ...options.headers };
  if (token) headers["Authorization"] = `Bearer ${token}`;
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
    throw new Error(message);
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

  summarizePdf: (file, token) => {
    const form = new FormData();
    form.append("file", file);
    return req("/api/v3/summarize/pdf", { method: "POST", body: form }, token);
  },

  getHistory: (token) => req("/api/v3/summarize/history", {}, token),
  deleteHistory: (id, token) => req(`/api/v3/summarize/history/${id}`, { method: "DELETE" }, token),
};
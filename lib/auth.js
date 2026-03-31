"use client";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { api, DEFAULT_API_KEY, getStoredApiKey } from "./api";

const Ctx = createContext(null);
const API_KEY_STORAGE = "apiKey";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [apiKey, setApiKey] = useState(DEFAULT_API_KEY);
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("user");
    const storedApiKey = getStoredApiKey();

    if (t && u) {
      try {
        setToken(t);
        setUser(JSON.parse(u));
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }

    localStorage.setItem(API_KEY_STORAGE, storedApiKey || DEFAULT_API_KEY);
    setApiKey(storedApiKey || DEFAULT_API_KEY);
    setReady(true);
  }, []);

  const persistApiKey = (value) => {
    const normalized = value?.trim() || DEFAULT_API_KEY;
    localStorage.setItem(API_KEY_STORAGE, normalized);
    setApiKey(normalized);
  };

  const login = async (username, password) => {
    const data = await api.login(username, password);

    const payload = data.access_token.split(".")[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    const me = { username, uuid: decoded.sub };

    localStorage.setItem("token", data.access_token);
    localStorage.setItem("user", JSON.stringify(me));
    localStorage.setItem(API_KEY_STORAGE, DEFAULT_API_KEY);
    setToken(data.access_token);
    setUser(me);
    setApiKey(DEFAULT_API_KEY);
    router.push("/dashboard");
  };

  const register = async (email, username, fullName, password) => {
    await api.register(email, username, fullName, password);
    await login(username, password);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.setItem(API_KEY_STORAGE, DEFAULT_API_KEY);
    setToken(null);
    setUser(null);
    setApiKey(DEFAULT_API_KEY);
    router.push("/auth/login");
  };

  return (
    <Ctx.Provider value={{ user, token, apiKey, hasApiKey: true, ready, login, register, logout, saveApiKey: persistApiKey, clearApiKey: () => persistApiKey(DEFAULT_API_KEY) }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth outside AuthProvider");
  return ctx;
};

"use client";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { api, getStoredApiKey } from "./api";

const Ctx = createContext(null);
const API_KEY_STORAGE = "apiKey";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [apiKey, setApiKey] = useState(null);
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
    if (storedApiKey) setApiKey(storedApiKey);
    setReady(true);
  }, []);

  const persistApiKey = (value) => {
    const normalized = value?.trim() || "";
    if (!normalized) {
      localStorage.removeItem(API_KEY_STORAGE);
      setApiKey(null);
      return;
    }
    localStorage.setItem(API_KEY_STORAGE, normalized);
    setApiKey(normalized);
  };

  const login = async (username, password) => {
    // Let fetch errors (TypeError) bubble up naturally to the caller
    const data = await api.login(username, password);

    const payload = data.access_token.split(".")[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    const me = { username, uuid: decoded.sub };

    localStorage.setItem("token", data.access_token);
    localStorage.setItem("user", JSON.stringify(me));
    setToken(data.access_token);
    setUser(me);
    router.push(getStoredApiKey() ? "/dashboard" : "/setup-api-key");
  };

  const register = async (email, username, fullName, password) => {
    await api.register(email, username, fullName, password);
    await login(username, password);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    persistApiKey("");
    router.push("/auth/login");
  };

  return (
    <Ctx.Provider value={{ user, token, apiKey, hasApiKey: !!apiKey, ready, login, register, logout, saveApiKey: persistApiKey, clearApiKey: () => persistApiKey("") }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth outside AuthProvider");
  return ctx;
};

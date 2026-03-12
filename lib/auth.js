"use client";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "./api";

const Ctx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const t = localStorage.getItem("token");
    const u = localStorage.getItem("user");
    if (t && u) {
      try {
        setToken(t);
        setUser(JSON.parse(u));
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setReady(true);
  }, []);

  const login = async (username, password) => {
    const data = await api.login(username, password);
    const userObj = { username, uuid: api.getMe(data.access_token) };
    // Decode uuid from token
    const payload = data.access_token.split(".")[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
    const me = { username, uuid: decoded.sub };

    localStorage.setItem("token", data.access_token);
    localStorage.setItem("user", JSON.stringify(me));
    setToken(data.access_token);
    setUser(me);
    router.push("/dashboard");
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
    router.push("/auth/login");
  };

  return (
    <Ctx.Provider value={{ user, token, ready, login, register, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth outside AuthProvider");
  return ctx;
};
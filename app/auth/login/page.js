"use client";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import { useState } from "react";

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [isApiDown, setIsApiDown] = useState(false);

  const isNetworkError = (err) => {
    // TypeError is thrown by fetch() when the server is unreachable
    if (err instanceof TypeError) return true;
    const msg = err.message?.toLowerCase() ?? "";
    return (
      msg.includes("failed to fetch") ||   // Chrome
      msg.includes("load failed") ||        // Safari
      msg.includes("network request failed") ||
      msg.includes("networkerror") ||
      msg.includes("503") ||
      msg.includes("502") ||
      msg.includes("504") ||
      msg.includes("service unavailable")
    );
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setIsApiDown(false);
    setBusy(true);
    try {
      await login(form.username, form.password);
    } catch (err) {
      if (isNetworkError(err)) {
        setIsApiDown(true);
      } else {
        setError(err.message);
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 400 }} className="fade-up">
        <Link href="/" style={{ display: "block", marginBottom: 40, textDecoration: "none" }}>
          <span style={{ fontFamily: "var(--serif)", fontSize: 22, color: "var(--text)" }}>
            Summ<em style={{ color: "var(--amber)" }}>ai</em>ize
          </span>
        </Link>

        <div className="card" style={{ padding: 32 }}>
          <h2 style={{ fontFamily: "var(--serif)", fontSize: 24, marginBottom: 6 }}>Sign in</h2>
          <p style={{ color: "var(--muted)", fontSize: 12, marginBottom: 28 }}>Enter your credentials to continue</p>

          {isApiDown && (
            <div style={{
              background: "rgba(201,150,0,0.1)",
              border: "1px solid rgba(201,150,0,0.3)",
              borderRadius: 4,
              padding: "10px 14px",
              color: "var(--amber)",
              fontSize: 13,
              marginBottom: 20
            }}>
              ⚠ This service is temporarily stopped for maintenance. Please check back later.
            </div>
          )}

          {error && (
            <div style={{
              background: "rgba(201,79,79,0.1)",
              border: "1px solid rgba(201,79,79,0.3)",
              borderRadius: 4,
              padding: "10px 14px",
              color: "var(--red)",
              fontSize: 13,
              marginBottom: 20
            }}>
              {error}
            </div>
          )}

          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 11, color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
                Username or email
              </label>
              <input
                className="field"
                type="text"
                placeholder="your_username"
                value={form.username}
                onChange={e => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 11, color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
                Password
              </label>
              <input
                className="field"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <button
              className="btn btn-amber"
              type="submit"
              disabled={busy || isApiDown}
              style={{ marginTop: 8, width: "100%", justifyContent: "center", padding: "11px" }}
            >
              {busy
                ? <span className="spin" style={{ display: "inline-block", width: 14, height: 14, border: "2px solid #0e0e0e", borderTopColor: "transparent", borderRadius: "50%" }} />
                : "Sign in →"
              }
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "var(--muted)" }}>
          No account?{" "}
          <Link href="/auth/register" style={{ color: "var(--amber)", textDecoration: "none" }}>Create one</Link>
        </p>
      </div>
    </div>
  );
}
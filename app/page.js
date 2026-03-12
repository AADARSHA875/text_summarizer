"use client";
import { useAuth } from "@/lib/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, ready } = useAuth();
  const router = useRouter();
  useEffect(() => { if (ready && user) router.push("/dashboard"); }, [ready, user]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: 24, position: "relative", overflow: "hidden" }}>
      {/* background grid */}
      <div style={{ position: "fixed", inset: 0, backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)", backgroundSize: "48px 48px", opacity: 0.3, pointerEvents: "none" }} />

      <div style={{ position: "relative", maxWidth: 560, textAlign: "center" }} className="fade-up">
        {/* logo mark */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 48, padding: "6px 16px", border: "1px solid var(--border)", borderRadius: 3 }}>
          <span style={{ width: 8, height: 8, background: "var(--amber)", borderRadius: "50%", animation: "pulse-amber 2s infinite" }} />
          <span style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)", letterSpacing: "0.15em", textTransform: "" }}>SummAIize </span>
        </div>

        <h1 style={{ fontFamily: "var(--serif)", fontSize: "clamp(38px, 7vw, 68px)", lineHeight: 1.08, letterSpacing: "-1px", marginBottom: 24, color: "var(--text)" }}>
          Summarize smarter, <br />
          <em style={{ color: "var(--amber)" }}>not longer</em>
        </h1>

        <p style={{ color: "var(--muted)", fontSize: 15, lineHeight: 1.8, marginBottom: 48, maxWidth: 420, margin: "0 auto 48px" }}>
          Hybrid extractive–abstractive summarization.<br />
          Paste text or drop a PDF. Get the essence.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/auth/register" className="btn btn-amber" style={{ fontSize: 14, padding: "11px 28px" }}>
            Get started →
          </Link>
          <Link href="/auth/login" className="btn btn-ghost" style={{ fontSize: 14, padding: "11px 28px" }}>
            Sign in
          </Link>
        </div>

        <div style={{ marginTop: 64, display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap" }}>
          {[["3 modes", "Short · Medium · Hierarchical"], ["PDF support", "Upload & extract automatically"]].map(([title, sub]) => (
            <div key={title} style={{ textAlign: "left" }}>
              <div style={{ color: "var(--amber)", fontSize: 12, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 4 }}>{title}</div>
              <div style={{ color: "var(--muted)", fontSize: 12 }}>{sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

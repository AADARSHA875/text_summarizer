"use client";
import { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import Link from "next/link";

export default function Dashboard() {
  const { user, token } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) api.getHistory(token).then(setHistory).catch(() => {}).finally(() => setLoading(false));
  }, [token]);

  const totalWords    = history.reduce((s, h) => s + (h.word_count_input || 0), 0);
  const savedWords    = history.reduce((s, h) => s + ((h.word_count_input || 0) - (h.word_count_output || 0)), 0);
  const modes         = { short: 0, medium: 0, hierarchical: 0 };
  history.forEach(h => { if (modes[h.mode] !== undefined) modes[h.mode]++; });

  const STATS = [
    { label: "Summaries", value: history.length, sub: "total generated" },
    { label: "Words processed", value: totalWords.toLocaleString(), sub: "across all documents" },
    { label: "Words saved", value: savedWords.toLocaleString(), sub: "through compression" },
    { label: "PDFs processed", value: history.filter(h => h.source_type === "pdf").length, sub: "documents uploaded" },
  ];

  return (
    <AppShell>
      <div style={{ padding: "40px 48px", maxWidth: 900 }}>
        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </div>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: 36, lineHeight: 1.1, marginBottom: 8 }}>
            Welcome back,<br />
            <em style={{ color: "var(--amber)" }}>{user?.full_name?.split(" ")[0] || user?.username}</em>
          </h1>
          <p style={{ color: "var(--muted)", fontSize: 13 }}>Your summarization workspace</p>
        </div>

        {/* Quick action */}
        <Link href="/summarize" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", background: "rgba(212,168,67,0.06)", border: "1px solid rgba(212,168,67,0.2)", borderRadius: 6, textDecoration: "none", marginBottom: 32, transition: "all 0.15s" }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(212,168,67,0.1)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(212,168,67,0.06)"}
        >
          <div>
            <div style={{ color: "var(--amber)", fontWeight: 500, marginBottom: 4 }}>◎ New Summary</div>
            <div style={{ color: "var(--muted)", fontSize: 12 }}>Paste text or upload a PDF to summarize</div>
          </div>
          <span style={{ color: "var(--amber)", fontSize: 20 }}>→</span>
        </Link>

        {/* Stats grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 36 }}>
          {STATS.map(s => (
            <div key={s.label} className="card" style={{ padding: "20px 20px" }}>
              <div style={{ fontSize: 26, fontFamily: "var(--serif)", color: "var(--text)", marginBottom: 4 }}>{loading ? "—" : s.value}</div>
              <div style={{ fontSize: 12, color: "var(--amber)", fontWeight: 500, marginBottom: 2 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: "var(--muted)" }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Mode breakdown */}
        {history.length > 0 && (
          <div className="card" style={{ padding: 24, marginBottom: 32 }}>
            <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>Pipeline mode breakdown</div>
            <div style={{ display: "flex", gap: 24 }}>
              {[["short", modes.short], ["medium", modes.medium], ["hierarchical", modes.hierarchical]].map(([m, count]) => (
                <div key={m}>
                  <span className={`tag tag-${m}`}>{m}</span>
                  <span style={{ marginLeft: 8, fontFamily: "var(--serif)", fontSize: 18 }}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent history */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Recent summaries</div>
            <Link href="/history" style={{ fontSize: 12, color: "var(--amber)", textDecoration: "none" }}>View all →</Link>
          </div>
          {loading ? (
            <div style={{ color: "var(--muted)", fontSize: 13 }}>Loading…</div>
          ) : history.length === 0 ? (
            <div className="card" style={{ padding: 32, textAlign: "center" }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>◎</div>
              <div style={{ color: "var(--muted)", fontSize: 13 }}>No summaries yet. <Link href="/summarize" style={{ color: "var(--amber)", textDecoration: "none" }}>Create your first →</Link></div>
            </div>
          ) : history.slice(0, 4).map(h => (
            <div key={h.id} className="card" style={{ padding: "16px 20px", marginBottom: 10 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start", justifyContent: "space-between" }}>
                <p style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.6, flex: 1 }}>
                  {h.summary.slice(0, 140)}{h.summary.length > 140 ? "…" : ""}
                </p>
                <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                  <span className={`tag tag-${h.mode}`}>{h.mode}</span>
                  <span className={`tag tag-${h.source_type}`}>{h.source_type}</span>
                </div>
              </div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 8 }}>
                {h.word_count_input}→{h.word_count_output} words · {new Date(h.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}

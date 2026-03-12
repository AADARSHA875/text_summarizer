"use client";
import { useState, useEffect } from "react";
import AppShell from "@/components/AppShell";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";

export default function History() {
  const { token } = useAuth();
  const [history, setHistory]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const load = () => {
    if (!token) return;
    setLoading(true);
    api.getHistory(token).then(setHistory).finally(() => setLoading(false));
  };

  useEffect(load, [token]);

  const deleteItem = async (id) => {
    setDeleting(id);
    try {
      await api.deleteHistory(id, token);
      setHistory(h => h.filter(x => x.id !== id));
      if (expanded === id) setExpanded(null);
    } catch {}
    setDeleting(null);
  };

  return (
    <AppShell>
      <div style={{ padding: "40px 48px", maxWidth: 860 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
          <div>
            <h1 style={{ fontFamily: "var(--serif)", fontSize: 32, marginBottom: 6 }}>History</h1>
            <p style={{ color: "var(--muted)", fontSize: 13 }}>{history.length} summaries</p>
          </div>
          <button className="btn btn-ghost" onClick={load} style={{ fontSize: 12 }}>↺ Refresh</button>
        </div>

        {loading ? (
          <div style={{ color: "var(--muted)", fontSize: 13 }}>Loading…</div>
        ) : history.length === 0 ? (
          <div className="card" style={{ padding: 48, textAlign: "center" }}>
            <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.3 }}>◷</div>
            <div style={{ color: "var(--muted)", fontSize: 13 }}>No summaries yet.</div>
          </div>
        ) : history.map(item => {
          const isOpen = expanded === item.id;
          const reduction = item.word_count_input > 0
            ? ((1 - item.word_count_output / item.word_count_input) * 100).toFixed(0)
            : 0;
          return (
            <div key={item.id} className="card" style={{ marginBottom: 12, transition: "border-color 0.15s", borderColor: isOpen ? "var(--border2)" : "var(--border)" }}>
              {/* Row */}
              <div style={{ padding: "16px 20px", display: "flex", gap: 12, alignItems: "flex-start", cursor: "pointer" }}
                onClick={() => setExpanded(isOpen ? null : item.id)}>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 13, color: "var(--text)", lineHeight: 1.65, marginBottom: 8 }}>
                    {item.summary.slice(0, isOpen ? undefined : 180)}{!isOpen && item.summary.length > 180 ? "…" : ""}
                  </p>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                    <span className={`tag tag-${item.mode}`}>{item.mode}</span>
                    <span className={`tag tag-${item.source_type}`}>{item.source_type}</span>
                    <span style={{ fontSize: 11, color: "var(--muted)" }}>
                      {item.word_count_input}→{item.word_count_output} words ({reduction}% reduction)
                    </span>
                    <span style={{ fontSize: 11, color: "var(--muted)" }}>
                      {new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0, alignItems: "center" }}>
                  <button
                    className="btn btn-danger"
                    style={{ fontSize: 11, padding: "4px 10px" }}
                    onClick={e => { e.stopPropagation(); deleteItem(item.id); }}
                    disabled={deleting === item.id}
                  >
                    {deleting === item.id ? "…" : "Delete"}
                  </button>
                  <span style={{ color: "var(--muted)", fontSize: 12, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}

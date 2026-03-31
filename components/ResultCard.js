"use client";
import { useState } from "react";

export default function ResultCard({ result }) {
  const [copied, setCopied] = useState(false);
  const [showKeys, setShowKeys] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(result.summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const reduction = ((1 - result.compression_ratio) * 100).toFixed(0);

  return (
    <div className="card fade-up" style={{ marginTop: 32 }}>
      {/* Header */}
      <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 8, height: 8, background: "var(--green)", borderRadius: "50%", display: "inline-block" }} />
          <span style={{ fontFamily: "var(--serif)", fontSize: 16 }}>Summary</span>
          <span className={`tag tag-${result.mode}`}>{result.mode}</span>
        </div>
        <button className="btn btn-ghost" style={{ fontSize: 12, padding: "5px 12px" }} onClick={copy}>
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>

      {/* Summary text */}
      <div style={{ padding: "24px 20px", fontSize: 14, lineHeight: 1.85, color: "var(--text)", fontFamily: "'Georgia', serif", borderBottom: "1px solid var(--border)" }}>
        {result.summary}
      </div>

      {/* Stats bar */}
      <div style={{ padding: "12px 20px", background: "rgba(255,255,255,0.02)", display: "flex", gap: 28, flexWrap: "wrap", borderBottom: "1px solid var(--border)" }}>
        {[
          ["Original", `${result.word_count_input} words`],
          ["Summary", `${result.word_count_output} words`],
          ["Reduction", `${reduction}%`],
          ["Time", `${result.processing_time_seconds}s`],
          ["Mode", result.mode],
        ].map(([k, v]) => (
          <div key={k}>
            <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 2 }}>{k}</div>
            <div style={{ fontSize: 14, fontFamily: "var(--mono)", color: k === "Reduction" ? "var(--green)" : "var(--text)" }}>{v}</div>
          </div>
        ))}
      </div>

      {/* Key sentences toggle */}
      {result.key_sentences?.length > 0 && (
        <div>

          {showKeys && (
            <div style={{ padding: "0 20px 20px" }}>
              {result.key_sentences.map((s, i) => (
                <div key={i} style={{ padding: "10px 14px", marginBottom: 8, borderRadius: 4, background: "rgba(212,168,67,0.04)", borderLeft: "2px solid var(--amber)", fontSize: 13, lineHeight: 1.65, color: "var(--text)" }}>
                  <span style={{ fontSize: 10, color: "var(--muted)", marginRight: 8, fontFamily: "var(--mono)" }}>#{String(i + 1).padStart(2, "0")}</span>
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

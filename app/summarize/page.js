"use client";
import { useState, useRef } from "react";
import AppShell from "@/components/AppShell";
import ResultCard from "@/components/ResultCard";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";
import Link from "next/link";

export default function Summarize() {
  const { token, hasApiKey } = useAuth();
  const [tab, setTab]       = useState("text");
  const [text, setText]     = useState("");
  const [pdf, setPdf]       = useState(null);
  const [result, setResult] = useState(null);
  const [busy, setBusy]     = useState(false);
  const [error, setError]   = useState("");
  const [drag, setDrag]     = useState(false);
  const fileRef = useRef(null);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const handleSubmit = async () => {
    setError(""); setBusy(true); setResult(null);
    try {
      if (!hasApiKey) throw new Error("API access is required to summarize text. Please enter your API key.");
      let res;
      if (tab === "text") {
        if (wordCount < 20) throw new Error("Please enter at least 20 words.");
        res = await api.summarizeText(text, token);
      } else {
        if (!pdf) throw new Error("Please select a PDF file.");
        res = await api.summarizePdf(pdf, token);
      }
      setResult(res);
    } catch (err) {
      setError(err.code === "API_KEY_EXPIRED"
        ? "Your API key has expired. Please contact admin for a new key."
        : err.code === "API_KEY_MISSING"
          ? "API access is required to summarize text. Please enter your API key."
          : err.message);
    } finally {
      setBusy(false);
    }
  };

  const onDrop = (e) => {
    e.preventDefault(); setDrag(false);
    const file = e.dataTransfer.files[0];
    if (file?.type === "application/pdf") { setPdf(file); setError(""); }
    else setError("Only PDF files are supported.");
  };

  return (
    <AppShell>
      <div style={{ padding: "40px 48px", maxWidth: 820 }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: 32, marginBottom: 6 }}>Summarize</h1>
          <p style={{ color: "var(--muted)", fontSize: 13 }}>Paste text or upload a PDF. Your hybrid BART pipeline does the rest.</p>
        </div>

        {/* Tab switcher */}
        <div style={{ display: "flex", borderBottom: "1px solid var(--border)", marginBottom: 24 }}>
          {[["text", "✏  Text input"], ["pdf", "⬆  PDF upload"]].map(([t, label]) => (
            <button key={t} onClick={() => { setTab(t); setError(""); setResult(null); }} style={{
              padding: "10px 20px", background: "none", border: "none",
              borderBottom: tab === t ? "2px solid var(--amber)" : "2px solid transparent",
              color: tab === t ? "var(--amber)" : "var(--muted)",
              fontFamily: "var(--mono)", fontSize: 13, cursor: "pointer",
              marginBottom: "-1px", transition: "all 0.15s",
              letterSpacing: "0.04em",
            }}>
              {label}
            </button>
          ))}
        </div>

        {/* Text input */}
        {tab === "text" && (
          <div className="glow-focus" style={{ borderRadius: 4 }}>
            <textarea
              className="field"
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Paste your article, essay, research paper, or any long-form text here…&#10;&#10;The model will extract key sentences and rewrite them into a fluent summary."
              style={{ minHeight: 280, borderRadius: 4 }}
            />
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 6, display: "flex", justifyContent: "space-between" }}>
              <span>{wordCount} words · {text.length} chars</span>
              <span style={{ color: wordCount > 350 ? "var(--amber)" : "transparent" }}>
                {wordCount > 350 ? "→ hierarchical mode" : wordCount > 250 ? "→ medium mode" : "→ short mode"}
              </span>
            </div>
          </div>
        )}

        {/* PDF input */}
        {tab === "pdf" && (
          <div
            onDragOver={e => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
            style={{
              border: `2px dashed ${drag ? "var(--amber)" : "var(--border)"}`,
              borderRadius: 6, padding: "52px 32px", textAlign: "center",
              cursor: "pointer", transition: "all 0.15s",
              background: drag ? "rgba(212,168,67,0.04)" : "transparent",
              minHeight: 240, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 8,
            }}
          >
            <input ref={fileRef} type="file" accept=".pdf" style={{ display: "none" }}
              onChange={e => { setPdf(e.target.files[0]); setError(""); }} />

            {pdf ? (
              <>
                <div style={{ fontSize: 32 }}>📄</div>
                <div style={{ color: "var(--amber)", fontWeight: 500, fontSize: 14 }}>{pdf.name}</div>
                <div style={{ color: "var(--muted)", fontSize: 12 }}>{(pdf.size / 1024).toFixed(0)} KB · Click to change</div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 36, opacity: 0.3 }}>⬆</div>
                <div style={{ color: "var(--text)", fontSize: 14 }}>Drop PDF here or click to browse</div>
                <div style={{ color: "var(--muted)", fontSize: 12 }}>Text will be extracted and summarized automatically</div>
              </>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ marginTop: 16, background: "rgba(201,79,79,0.1)", border: "1px solid rgba(201,79,79,0.3)", borderRadius: 4, padding: "10px 14px", color: "var(--red)", fontSize: 13 }}>
            {error}
            {(error.includes("API key")) && (
              <>
                {" "}
                <Link href="/setup-api-key" style={{ color: "var(--amber)", textDecoration: "none" }}>Set it up here</Link>
              </>
            )}
          </div>
        )}

        {!hasApiKey && (
          <div style={{ marginTop: 16, background: "rgba(212,168,67,0.08)", border: "1px solid rgba(212,168,67,0.25)", borderRadius: 4, padding: "10px 14px", color: "var(--amber)", fontSize: 13 }}>
            API access is required to summarize text. Please enter your API key.{" "}
            <Link href="/setup-api-key" style={{ color: "var(--amber2)", textDecoration: "none" }}>Open setup</Link>
          </div>
        )}

        {/* Submit */}
        <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 16 }}>
          <button className="btn btn-amber" onClick={handleSubmit} disabled={busy || !hasApiKey} style={{ fontSize: 14, padding: "11px 28px", minWidth: 160 }}>
            {busy ? (
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="spin" style={{ display: "inline-block", width: 14, height: 14, border: "2px solid #0e0e0e", borderTopColor: "transparent", borderRadius: "50%" }} />
                Summarizing…
              </span>
            ) : "Summarize →"}
          </button>

          {tab === "text" && text && (
            <button className="btn btn-ghost" onClick={() => { setText(""); setResult(null); setError(""); }} style={{ fontSize: 13 }}>
              Clear
            </button>
          )}
        </div>

        {/* Progress */}
        {busy && hasApiKey && (
          <div style={{ marginTop: 16, height: 2, background: "var(--border)", borderRadius: 1, overflow: "hidden" }}>
            <div className="progress-bar" style={{ height: "100%", background: "var(--amber)", borderRadius: 1 }} />
          </div>
        )}

        {/* Busy hint */}
        {busy && hasApiKey && (
          <div style={{ marginTop: 12, fontSize: 12, color: "var(--muted)" }}>
            Loading models on first request takes ~30–60 seconds. Subsequent requests are faster.
          </div>
        )}

        {/* Result */}
        {result && !busy && <ResultCard result={result} />}
      </div>
    </AppShell>
  );
}

"use client";
import { useEffect, useState } from "react";

function normalizeKey(value) {
  return value.trim();
}

function isSingleKey(value) {
  const normalized = normalizeKey(value);
  return !!normalized && !/\s/.test(normalized);
}

export default function APIKeyInput({
  initialValue = "",
  onSave,
  busy = false,
  error = "",
  success = "",
  helperText = "Enter the API key provided by the owner/admin.",
}) {
  const [value, setValue] = useState(initialValue);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const submit = async (e) => {
    e.preventDefault();
    const normalized = normalizeKey(value);

    if (!isSingleKey(normalized)) {
      setLocalError("Enter exactly one API key.");
      return;
    }

    setLocalError("");
    await onSave(normalized);
  };

  const message = localError || error;

  return (
    <form onSubmit={submit} className="card fade-up" style={{ padding: 32, width: "100%", maxWidth: 520 }}>
      <h2 style={{ fontFamily: "var(--serif)", fontSize: 28, marginBottom: 8 }}>Set up API access</h2>
      <p style={{ color: "var(--muted)", fontSize: 13, marginBottom: 24 }}>{helperText}</p>

      {message && (
        <div style={{ background: "rgba(201,79,79,0.1)", border: "1px solid rgba(201,79,79,0.3)", borderRadius: 4, padding: "10px 14px", color: "var(--red)", fontSize: 13, marginBottom: 16 }}>
          {message}
        </div>
      )}

      {success && (
        <div style={{ background: "rgba(79,170,126,0.1)", border: "1px solid rgba(79,170,126,0.3)", borderRadius: 4, padding: "10px 14px", color: "var(--green)", fontSize: 13, marginBottom: 16 }}>
          {success}
        </div>
      )}

      <div style={{ marginBottom: 18 }}>
        <label style={{ display: "block", fontSize: 11, color: "var(--muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
          API key
        </label>
        <input
          className="field"
          type="password"
          autoComplete="off"
          spellCheck="false"
          placeholder="Paste your API key"
          value={value}
          onChange={e => setValue(e.target.value)}
          disabled={busy}
        />
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div style={{ color: "var(--muted)", fontSize: 12 }}>{helperText}</div>
        <button className="btn btn-amber" type="submit" disabled={busy} style={{ minWidth: 168, justifyContent: "center" }}>
          {busy ? "Saving..." : "Save API Key"}
        </button>
      </div>
    </form>
  );
}

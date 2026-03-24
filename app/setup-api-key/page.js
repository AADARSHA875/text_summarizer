"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import APIKeyInput from "@/components/APIKeyInput";
import { useAuth } from "@/lib/auth";

export default function SetupApiKeyPage() {
  const { user, ready, apiKey, saveApiKey } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (ready && !user) router.push("/auth/login");
  }, [ready, user, router]);

  const handleSave = async (value) => {
    setBusy(true);
    setError("");
    setSuccess("");

    try {
      saveApiKey(value);
      setSuccess(apiKey ? "API key updated successfully." : "API key saved successfully.");
      setTimeout(() => router.push("/dashboard"), 700);
    } catch {
      setError("Unable to save your API key right now. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppShell>
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <APIKeyInput
          initialValue={apiKey || ""}
          busy={busy}
          error={error}
          success={success}
          onSave={handleSave}
          helperText={apiKey ? "Update the API key if the owner/admin has provided a replacement." : "API access is required before you can summarize text or PDFs."}
        />
      </div>
    </AppShell>
  );
}

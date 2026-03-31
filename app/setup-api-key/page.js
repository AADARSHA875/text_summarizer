"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function SetupApiKeyPage() {
  const { user, ready } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    router.push(user ? "/dashboard" : "/auth/login");
  }, [ready, user, router]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span className="spin" style={{ display: "inline-block", width: 20, height: 20, border: "2px solid var(--border)", borderTopColor: "var(--amber)", borderRadius: "50%" }} />
    </div>
  );
}

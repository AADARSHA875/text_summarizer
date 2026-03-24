"use client";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Sidebar from "./Sidebar";

export default function AppShell({ children }) {
  const { user, ready, hasApiKey } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (ready && !user) router.push("/auth/login");
  }, [ready, user, router]);

  useEffect(() => {
    if (!ready || !user) return;
    if (!hasApiKey && pathname !== "/setup-api-key") router.push("/setup-api-key");
  }, [ready, user, hasApiKey, pathname, router]);

  if (!ready || !user) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span className="spin" style={{ display: "inline-block", width: 20, height: 20, border: "2px solid var(--border)", borderTopColor: "var(--amber)", borderRadius: "50%" }} />
    </div>
  );

  if (!hasApiKey && pathname !== "/setup-api-key") return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <span className="spin" style={{ display: "inline-block", width: 20, height: 20, border: "2px solid var(--border)", borderTopColor: "var(--amber)", borderRadius: "50%" }} />
    </div>
  );

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar />
      <main style={{ flex: 1, overflow: "auto" }}>{children}</main>
    </div>
  );
}

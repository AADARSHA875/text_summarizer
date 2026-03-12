"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";

const NAV = [
  { href: "/dashboard", label: "Dashboard",  icon: "◈" },
  { href: "/summarize", label: "Summarize",  icon: "◎" },
  { href: "/history",   label: "History",    icon: "◷" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const path = usePathname();

  return (
    <aside style={{
      width: 220, minHeight: "100vh", background: "var(--surface)",
      borderRight: "1px solid var(--border)", display: "flex",
      flexDirection: "column", padding: "24px 0", flexShrink: 0,
      position: "sticky", top: 0, height: "100vh",
    }}>
      {/* Logo */}
      <div style={{ padding: "0 20px 28px", borderBottom: "1px solid var(--border)" }}>
        <Link href="/dashboard" style={{ textDecoration: "none" }}>
          <span style={{ fontFamily: "var(--serif)", fontSize: 20, color: "var(--text)" }}>
            Summ<em style={{ color: "var(--amber)" }}>ai</em>ize
          </span>
        </Link>
        <div style={{ fontSize: 10, color: "var(--muted)", letterSpacing: "0.1em", textTransform: "uppercase", marginTop: 4 }}>v3 · text summarizer</div>
      </div>

      {/* Nav */}
      <nav style={{ padding: "20px 12px", flex: 1 }}>
        {NAV.map(({ href, label, icon }) => {
          const active = path === href;
          return (
            <Link key={href} href={href} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "9px 12px", borderRadius: 4, marginBottom: 2,
              textDecoration: "none", fontSize: 13, fontWeight: 500,
              background: active ? "rgba(212,168,67,0.1)" : "transparent",
              color: active ? "var(--amber)" : "var(--muted)",
              borderLeft: active ? "2px solid var(--amber)" : "2px solid transparent",
              transition: "all 0.15s",
            }}>
              <span style={{ fontSize: 16 }}>{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div style={{ padding: "20px", borderTop: "1px solid var(--border)" }}>
        <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {user?.full_name || user?.username}
        </div>
        <div style={{ fontSize: 11, color: "var(--border2)", marginBottom: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {user?.email}
        </div>
        <button className="btn btn-ghost" onClick={logout} style={{ width: "100%", justifyContent: "center", fontSize: 12, padding: "7px" }}>
          Sign out
        </button>
      </div>
    </aside>
  );
}

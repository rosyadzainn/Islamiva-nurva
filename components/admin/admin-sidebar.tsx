"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { LayoutDashboard, BookOpen, Heart, Settings, Users, BarChart3, LogOut, ExternalLink } from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/articles", label: "Artikel", icon: BookOpen },
  { href: "/admin/content", label: "Konten", icon: Heart },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Pengaturan", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { signOut } = useClerk();

  return (
    <aside
      style={{
        width: 240,
        backgroundColor: "var(--islametra-bg)",
        borderRight: "1px solid var(--islametra-line)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid var(--islametra-line)" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <div
            style={{
              width: 32, height: 32, borderRadius: 9,
              background: "linear-gradient(180deg, oklch(0.68 0.13 155) 0%, oklch(0.53 0.12 155) 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, color: "#08110b", fontWeight: 700, fontFamily: "'Amiri', serif", flexShrink: 0,
            }}
          >
            ن
          </div>
          <div>
            <p style={{ fontFamily: "'Geist', sans-serif", fontWeight: 600, fontSize: 14, letterSpacing: "-0.01em", color: "var(--islametra-fg)" }}>
              Islametra
            </p>
            <p style={{ fontSize: 10, color: "var(--islametra-fg-dim)", fontFamily: "'Geist Mono', monospace", letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Admin Panel
            </p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "8px 12px", borderRadius: 9, textDecoration: "none",
                fontSize: 13, fontFamily: "'Geist', sans-serif",
                background: active ? "rgba(255,255,255,0.06)" : "transparent",
                color: active ? "var(--islametra-fg-soft)" : "var(--islametra-fg-mute)",
                transition: "background 0.15s, color 0.15s",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                  (e.currentTarget as HTMLElement).style.color = "var(--islametra-fg-soft)";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "var(--islametra-fg-mute)";
                }
              }}
            >
              <Icon size={15} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: "12px 10px", borderTop: "1px solid var(--islametra-line)", display: "flex", flexDirection: "column", gap: 2 }}>
        <Link
          href="/"
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "8px 12px", borderRadius: 9, textDecoration: "none",
            fontSize: 13, color: "var(--islametra-fg-dim)", fontFamily: "'Geist', sans-serif",
          }}
        >
          <ExternalLink size={15} />
          Ke Website
        </Link>
        <button
          onClick={() => signOut(() => router.push("/"))}
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "8px 12px", borderRadius: 9, border: "none",
            background: "transparent", cursor: "pointer", width: "100%",
            fontSize: 13, color: "oklch(0.65 0.15 25)", fontFamily: "'Geist', sans-serif",
            textAlign: "left",
          }}
        >
          <LogOut size={15} />
          Logout
        </button>
      </div>
    </aside>
  );
}

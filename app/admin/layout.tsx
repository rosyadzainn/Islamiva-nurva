import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { LayoutDashboard, BookOpen, Heart, Settings, Users, BarChart3, LogOut } from "lucide-react";

const adminNav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/articles", label: "Artikel", icon: BookOpen },
  { href: "/admin/content", label: "Konten", icon: Heart },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Pengaturan", icon: Settings },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "var(--islamiva-bg-1)",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: 240,
          backgroundColor: "var(--islamiva-bg)",
          borderRight: "1px solid var(--islamiva-line)",
          display: "flex",
          flexDirection: "column",
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: "20px 20px 16px",
            borderBottom: "1px solid var(--islamiva-line)",
          }}
        >
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 9,
                background:
                  "linear-gradient(180deg, oklch(0.68 0.13 155) 0%, oklch(0.53 0.12 155) 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                color: "#08110b",
                fontWeight: 700,
                fontFamily: "'Amiri', serif",
                flexShrink: 0,
              }}
            >
              ن
            </div>
            <div>
              <p
                style={{
                  fontFamily: "'Geist', sans-serif",
                  fontWeight: 600,
                  fontSize: 14,
                  letterSpacing: "-0.01em",
                  color: "var(--islamiva-fg)",
                }}
              >
                Islamiva
              </p>
              <p
                style={{
                  fontSize: 10,
                  color: "var(--islamiva-fg-dim)",
                  fontFamily: "'Geist Mono', monospace",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}
              >
                Admin Panel
              </p>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
          {adminNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 12px",
                  borderRadius: 9,
                  textDecoration: "none",
                  fontSize: 13,
                  color: "var(--islamiva-fg-mute)",
                  fontFamily: "'Geist', sans-serif",
                  transition: "background 0.15s, color 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                  (e.currentTarget as HTMLElement).style.color = "var(--islamiva-fg-soft)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "var(--islamiva-fg-mute)";
                }}
              >
                <Icon size={15} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ padding: "12px 10px", borderTop: "1px solid var(--islamiva-line)" }}>
          <Link
            href="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 12px",
              borderRadius: 9,
              textDecoration: "none",
              fontSize: 13,
              color: "var(--islamiva-fg-dim)",
              fontFamily: "'Geist', sans-serif",
            }}
          >
            <LogOut size={15} />
            Ke Website
          </Link>
        </div>
      </aside>

      <main style={{ flex: 1, overflowY: "auto" }}>{children}</main>
    </div>
  );
}

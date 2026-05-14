import { auth } from "@clerk/nextjs/server";
import { Users, BookOpen, MessageCircle, TrendingUp } from "lucide-react";

const stats = [
  { label: "Total Users", value: "1,234", change: "+12%", icon: Users },
  { label: "Artikel", value: "56", change: "+3", icon: BookOpen },
  { label: "Chat Sessions", value: "8,901", change: "+23%", icon: MessageCircle },
  { label: "Pengunjung Hari Ini", value: "2,456", change: "+8%", icon: TrendingUp },
];

const quickActions = [
  { label: "Tambah Artikel Baru", href: "/admin/articles/new" },
  { label: "Tambah Doa", href: "/admin/content/doa/new" },
  { label: "Kelola Konten AI", href: "/admin/settings/ai" },
];

const recentActivity = [
  { text: "User baru terdaftar", time: "2 menit lalu" },
  { text: "Artikel baru dipublikasi", time: "1 jam lalu" },
  { text: "1.2K chat session hari ini", time: "Hari ini" },
];

export default async function AdminDashboard() {
  await auth();

  return (
    <div style={{ padding: 32 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1
          style={{
            fontFamily: "'Geist', sans-serif",
            fontWeight: 600,
            fontSize: 24,
            letterSpacing: "-0.02em",
            color: "var(--islamiva-fg)",
            marginBottom: 6,
          }}
        >
          Dashboard{" "}
          <em
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: "italic",
              fontWeight: 400,
              color: "var(--islamiva-emerald-soft)",
            }}
          >
            Admin
          </em>
        </h1>
        <p
          style={{
            fontSize: 13,
            color: "var(--islamiva-fg-dim)",
            fontFamily: "'Geist', sans-serif",
          }}
        >
          Selamat datang di panel admin Islamiva
        </p>
      </div>

      {/* Stats grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              style={{
                padding: "20px 22px",
                borderRadius: 14,
                backgroundColor: "var(--islamiva-bg)",
                border: "1px solid var(--islamiva-line)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 14,
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 9,
                    background: "oklch(0.62 0.13 155 / 0.1)",
                    border: "1px solid oklch(0.62 0.13 155 / 0.18)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={16} style={{ color: "oklch(0.78 0.13 155)" }} />
                </div>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    color: "oklch(0.78 0.13 155)",
                    fontFamily: "'Geist Mono', monospace",
                    padding: "3px 8px",
                    borderRadius: 999,
                    background: "oklch(0.62 0.13 155 / 0.1)",
                  }}
                >
                  {stat.change}
                </span>
              </div>
              <p
                style={{
                  fontFamily: "'Geist', sans-serif",
                  fontWeight: 700,
                  fontSize: 26,
                  letterSpacing: "-0.03em",
                  color: "var(--islamiva-fg)",
                  marginBottom: 4,
                }}
              >
                {stat.value}
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--islamiva-fg-dim)",
                  fontFamily: "'Geist', sans-serif",
                }}
              >
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Panels grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Quick actions */}
        <div
          style={{
            padding: "22px 24px",
            borderRadius: 14,
            backgroundColor: "var(--islamiva-bg)",
            border: "1px solid var(--islamiva-line)",
          }}
        >
          <h2
            style={{
              fontFamily: "'Geist', sans-serif",
              fontWeight: 500,
              fontSize: 14,
              color: "var(--islamiva-fg-soft)",
              marginBottom: 16,
            }}
          >
            Aksi Cepat
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {quickActions.map((action) => (
              <a
                key={action.href}
                href={action.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 12px",
                  borderRadius: 9,
                  textDecoration: "none",
                  fontSize: 13,
                  color: "var(--islamiva-fg-mute)",
                  fontFamily: "'Geist', sans-serif",
                  border: "1px solid var(--islamiva-line)",
                  background: "rgba(255,255,255,0.015)",
                  transition: "border-color 0.15s, color 0.15s",
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "oklch(0.78 0.13 155)",
                    flexShrink: 0,
                  }}
                />
                {action.label}
              </a>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div
          style={{
            padding: "22px 24px",
            borderRadius: 14,
            backgroundColor: "var(--islamiva-bg)",
            border: "1px solid var(--islamiva-line)",
          }}
        >
          <h2
            style={{
              fontFamily: "'Geist', sans-serif",
              fontWeight: 500,
              fontSize: 14,
              color: "var(--islamiva-fg-soft)",
              marginBottom: 16,
            }}
          >
            Aktivitas Terbaru
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {recentActivity.map((activity, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    color: "var(--islamiva-fg-mute)",
                    fontFamily: "'Geist', sans-serif",
                  }}
                >
                  {activity.text}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: "var(--islamiva-fg-dim)",
                    fontFamily: "'Geist Mono', monospace",
                    whiteSpace: "nowrap",
                    marginLeft: 16,
                  }}
                >
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

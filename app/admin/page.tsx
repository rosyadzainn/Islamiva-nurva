import { requireAdmin } from "@/lib/admin-guard";
import { Users, BookOpen, MessageCircle, Heart, FileText, History } from "lucide-react";

export const dynamic = "force-dynamic";

async function getStats() {
  try {
    const { default: prisma } = await import("@/lib/prisma");
    const [userCount, bookmarkCount, chatSessionCount, chatMessageCount, articleCount] =
      await Promise.all([
        prisma.user.count(),
        prisma.bookmark.count(),
        prisma.chatSession.count(),
        prisma.chatMessage.count(),
        prisma.article.count(),
      ]);
    return { userCount, bookmarkCount, chatSessionCount, chatMessageCount, articleCount };
  } catch {
    return { userCount: 0, bookmarkCount: 0, chatSessionCount: 0, chatMessageCount: 0, articleCount: 0 };
  }
}

async function getRecentUsers() {
  try {
    const { default: prisma } = await import("@/lib/prisma");
    return await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, name: true, email: true, createdAt: true, role: true },
    });
  } catch {
    return [];
  }
}

export default async function AdminDashboard() {
  await requireAdmin();

  const [stats, recentUsers] = await Promise.all([getStats(), getRecentUsers()]);

  const statCards = [
    { label: "Total Users", value: stats.userCount.toLocaleString(), icon: Users, color: "oklch(0.78 0.13 155)" },
    { label: "Bookmarks", value: stats.bookmarkCount.toLocaleString(), icon: Heart, color: "oklch(0.75 0.15 30)" },
    { label: "Chat Sessions", value: stats.chatSessionCount.toLocaleString(), icon: MessageCircle, color: "oklch(0.72 0.12 260)" },
    { label: "Pesan AI", value: stats.chatMessageCount.toLocaleString(), icon: History, color: "oklch(0.78 0.10 80)" },
    { label: "Artikel DB", value: stats.articleCount.toLocaleString(), icon: FileText, color: "oklch(0.72 0.12 300)" },
    { label: "Halaman Live", value: "190", icon: BookOpen, color: "oklch(0.78 0.13 155)" },
  ];

  const quickActions = [
    { label: "Tambah Artikel Baru", href: "/admin/articles/new" },
    { label: "Kelola Konten", href: "/admin/content" },
    { label: "Lihat Users", href: "/admin/users" },
  ];

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
            color: "var(--islametra-fg)",
            marginBottom: 6,
          }}
        >
          Dashboard{" "}
          <em
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: "italic",
              fontWeight: 400,
              color: "oklch(0.78 0.13 155)",
            }}
          >
            Admin
          </em>
        </h1>
        <p style={{ fontSize: 13, color: "var(--islametra-fg-dim)", fontFamily: "'Geist', sans-serif" }}>
          Data real-time dari database Islametra
        </p>
      </div>

      {/* Stats grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              style={{
                padding: "20px 22px",
                borderRadius: 14,
                backgroundColor: "var(--islametra-bg)",
                border: "1px solid var(--islametra-line)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 9,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--islametra-line)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={16} style={{ color: stat.color }} />
                </div>
                <p style={{ fontSize: 12, color: "var(--islametra-fg-dim)", fontFamily: "'Geist', sans-serif" }}>
                  {stat.label}
                </p>
              </div>
              <p
                style={{
                  fontFamily: "'Geist', sans-serif",
                  fontWeight: 700,
                  fontSize: 30,
                  letterSpacing: "-0.03em",
                  color: "var(--islametra-fg)",
                }}
              >
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Bottom panels */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Recent users */}
        <div
          style={{
            padding: "22px 24px",
            borderRadius: 14,
            backgroundColor: "var(--islametra-bg)",
            border: "1px solid var(--islametra-line)",
          }}
        >
          <h2
            style={{
              fontFamily: "'Geist', sans-serif",
              fontWeight: 500,
              fontSize: 14,
              color: "var(--islametra-fg-soft)",
              marginBottom: 16,
            }}
          >
            User Terbaru
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {recentUsers.length === 0 ? (
              <p style={{ fontSize: 13, color: "var(--islametra-fg-dim)", fontFamily: "'Geist', sans-serif" }}>
                Belum ada user terdaftar.
              </p>
            ) : (
              recentUsers.map((user) => (
                <div
                  key={user.id}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
                >
                  <div>
                    <p style={{ fontSize: 13, color: "var(--islametra-fg-soft)", fontFamily: "'Geist', sans-serif", fontWeight: 500 }}>
                      {user.name ?? user.email.split("@")[0]}
                    </p>
                    <p style={{ fontSize: 11, color: "var(--islametra-fg-dim)", fontFamily: "'Geist Mono', monospace" }}>
                      {user.email}
                    </p>
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      fontFamily: "'Geist Mono', monospace",
                      padding: "2px 8px",
                      borderRadius: 999,
                      background: user.role === "ADMIN" ? "oklch(0.62 0.13 155 / 0.15)" : "rgba(255,255,255,0.04)",
                      color: user.role === "ADMIN" ? "oklch(0.78 0.13 155)" : "var(--islametra-fg-dim)",
                      border: `1px solid ${user.role === "ADMIN" ? "oklch(0.62 0.13 155 / 0.25)" : "var(--islametra-line)"}`,
                      textTransform: "uppercase" as const,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {user.role}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div
          style={{
            padding: "22px 24px",
            borderRadius: 14,
            backgroundColor: "var(--islametra-bg)",
            border: "1px solid var(--islametra-line)",
          }}
        >
          <h2
            style={{
              fontFamily: "'Geist', sans-serif",
              fontWeight: 500,
              fontSize: 14,
              color: "var(--islametra-fg-soft)",
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
                  color: "var(--islametra-fg-mute)",
                  fontFamily: "'Geist', sans-serif",
                  border: "1px solid var(--islametra-line)",
                  background: "rgba(255,255,255,0.015)",
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
          <div
            style={{
              marginTop: 20,
              padding: "12px 14px",
              borderRadius: 10,
              background: "oklch(0.62 0.13 155 / 0.06)",
              border: "1px solid oklch(0.62 0.13 155 / 0.15)",
            }}
          >
            <p style={{ fontSize: 12, color: "oklch(0.78 0.13 155)", fontFamily: "'Geist', sans-serif", lineHeight: 1.6 }}>
              Data diambil langsung dari database PostgreSQL secara real-time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

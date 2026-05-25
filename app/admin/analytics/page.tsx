import { requireAdmin } from "@/lib/admin-guard";
import { BarChart3, ExternalLink, Users, Bookmark, MessageCircle, FileText, BookOpen, Activity, Hash } from "lucide-react";

export const dynamic = "force-dynamic";

async function getStats() {
  try {
    const { default: prisma } = await import("@/lib/prisma");
    const ONLINE_CUTOFF = new Date(Date.now() - 2 * 60 * 1000);
    const WEEK_CUTOFF = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      activeUsers7d,
      totalBookmarks,
      totalArticles,
      publishedArticles,
      totalChatSessions,
      totalChatMessages,
      totalReadingHistory,
      onlineNow,
      recentUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { createdAt: { gte: WEEK_CUTOFF } } }),
      prisma.bookmark.count(),
      prisma.article.count(),
      prisma.article.count({ where: { published: true } }),
      prisma.chatSession.count(),
      prisma.chatMessage.count(),
      prisma.readingHistory.count(),
      prisma.presence.count({ where: { updatedAt: { gte: ONLINE_CUTOFF } } }),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: { name: true, email: true, createdAt: true, role: true },
      }),
    ]);

    return {
      totalUsers, activeUsers7d, totalBookmarks, totalArticles,
      publishedArticles, totalChatSessions, totalChatMessages,
      totalReadingHistory, onlineNow, recentUsers,
    };
  } catch {
    return null;
  }
}

export default async function AdminAnalyticsPage() {
  await requireAdmin();
  const stats = await getStats();

  const primaryCards = stats ? [
    { label: "Total Pengguna", value: stats.totalUsers, sub: `+${stats.activeUsers7d} minggu ini`, icon: Users, color: "oklch(0.75 0.12 250)" },
    { label: "Online Sekarang", value: stats.onlineNow, sub: "aktif 2 menit terakhir", icon: Activity, color: "oklch(0.78 0.13 155)" },
    { label: "Artikel Terbit", value: `${stats.publishedArticles} / ${stats.totalArticles}`, sub: "draft + terbit", icon: FileText, color: "oklch(0.75 0.15 30)" },
    { label: "Sesi AI Chat", value: stats.totalChatSessions, sub: `${stats.totalChatMessages} pesan`, icon: MessageCircle, color: "oklch(0.78 0.10 80)" },
  ] : [];

  const secondaryCards = stats ? [
    { label: "Total Bookmark", value: stats.totalBookmarks, icon: Bookmark, color: "oklch(0.75 0.12 250)" },
    { label: "Riwayat Baca", value: stats.totalReadingHistory, icon: BookOpen, color: "oklch(0.78 0.13 155)" },
    { label: "Pesan AI", value: stats.totalChatMessages, icon: Hash, color: "oklch(0.75 0.15 30)" },
  ] : [];

  return (
    <div style={{ padding: 32, maxWidth: 960 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Geist', sans-serif", fontWeight: 600, fontSize: 22, letterSpacing: "-0.02em", color: "var(--islametra-fg)", marginBottom: 4 }}>
          <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400, color: "oklch(0.78 0.13 155)" }}>Analytics</em>
        </h1>
        <p style={{ fontSize: 13, color: "var(--islametra-fg-dim)", fontFamily: "'Geist', sans-serif" }}>
          Data platform Islametra secara real-time
        </p>
      </div>

      {/* Primary stat cards */}
      {stats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14, marginBottom: 14 }}>
          {primaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                style={{
                  padding: "22px 24px",
                  borderRadius: 14,
                  backgroundColor: "var(--islametra-bg)",
                  border: "1px solid var(--islametra-line)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                  <span style={{ fontSize: 12, color: "var(--islametra-fg-dim)", fontFamily: "'Geist', sans-serif" }}>
                    {card.label}
                  </span>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--islametra-line)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Icon size={15} style={{ color: card.color }} />
                  </div>
                </div>
                <p style={{ fontSize: 28, fontWeight: 700, fontFamily: "'Geist', sans-serif", color: "var(--islametra-fg)", letterSpacing: "-0.03em", marginBottom: 4 }}>
                  {card.value}
                </p>
                <p style={{ fontSize: 11, color: "var(--islametra-fg-dim)", fontFamily: "'Geist', sans-serif" }}>
                  {card.sub}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Secondary cards */}
      {stats && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 28 }}>
          {secondaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                style={{
                  padding: "18px 20px",
                  borderRadius: 14,
                  backgroundColor: "var(--islametra-bg)",
                  border: "1px solid var(--islametra-line)",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}
              >
                <div>
                  <p style={{ fontSize: 11, color: "var(--islametra-fg-dim)", fontFamily: "'Geist', sans-serif", marginBottom: 6 }}>
                    {card.label}
                  </p>
                  <p style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Geist', sans-serif", color: "var(--islametra-fg)", letterSpacing: "-0.03em" }}>
                    {card.value}
                  </p>
                </div>
                <Icon size={18} style={{ color: card.color, opacity: 0.6 }} />
              </div>
            );
          })}
        </div>
      )}

      {/* Recent users */}
      {stats && stats.recentUsers.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 13, fontWeight: 600, fontFamily: "'Geist', sans-serif", color: "var(--islametra-fg-soft)", letterSpacing: "-0.01em", marginBottom: 12 }}>
            Pengguna Terbaru
          </h2>
          <div style={{ borderRadius: 14, backgroundColor: "var(--islametra-bg)", border: "1px solid var(--islametra-line)", overflow: "hidden" }}>
            {stats.recentUsers.map((user, i) => (
              <div
                key={user.email}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "13px 20px",
                  borderBottom: i < stats.recentUsers.length - 1 ? "1px solid var(--islametra-line)" : "none",
                }}
              >
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "var(--islametra-fg-soft)", fontFamily: "'Geist', sans-serif" }}>
                    {user.name ?? "—"}
                    {user.role === "ADMIN" && (
                      <span style={{ marginLeft: 8, fontSize: 10, fontFamily: "'Geist Mono', monospace", padding: "2px 6px", borderRadius: 999, background: "oklch(0.62 0.13 155 / 0.1)", color: "oklch(0.78 0.13 155)", border: "1px solid oklch(0.62 0.13 155 / 0.2)" }}>
                        ADMIN
                      </span>
                    )}
                  </p>
                  <p style={{ fontSize: 11, color: "var(--islametra-fg-dim)", fontFamily: "'Geist Mono', monospace", marginTop: 2 }}>
                    {user.email}
                  </p>
                </div>
                <span style={{ fontSize: 11, color: "var(--islametra-fg-dim)", fontFamily: "'Geist Mono', monospace" }}>
                  {new Date(user.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* GA4 link */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <h2 style={{ fontSize: 13, fontWeight: 600, fontFamily: "'Geist', sans-serif", color: "var(--islametra-fg-soft)", letterSpacing: "-0.01em" }}>
          Analitik Pengunjung
        </h2>
        <a
          href="https://analytics.google.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: "18px 22px", borderRadius: 14,
            backgroundColor: "var(--islametra-bg)", border: "1px solid var(--islametra-line)",
            textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: "rgba(255,255,255,0.04)", border: "1px solid var(--islametra-line)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <BarChart3 size={16} style={{ color: "oklch(0.75 0.15 30)" }} />
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--islametra-fg-soft)", fontFamily: "'Geist', sans-serif", marginBottom: 2 }}>
                Google Analytics (GA4)
              </p>
              <p style={{ fontSize: 11, color: "var(--islametra-fg-dim)", fontFamily: "'Geist Mono', monospace" }}>
                G-SFFW5Q3DHF · islametra.com
              </p>
            </div>
          </div>
          <ExternalLink size={14} style={{ color: "var(--islametra-fg-dim)" }} />
        </a>
      </div>
    </div>
  );
}

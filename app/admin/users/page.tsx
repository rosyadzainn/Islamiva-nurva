import { requireAdmin } from "@/lib/admin-guard";
import { Users, ShieldCheck, User } from "lucide-react";

export const dynamic = "force-dynamic";

async function getUsers() {
  try {
    const { default: prisma } = await import("@/lib/prisma");
    return await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true, name: true, email: true, imageUrl: true,
        role: true, createdAt: true,
        _count: { select: { bookmarks: true, chatSessions: true } },
      },
    });
  } catch {
    return [];
  }
}

export default async function AdminUsersPage() {
  await requireAdmin();

  const users = await getUsers();

  return (
    <div style={{ padding: 32 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Geist', sans-serif", fontWeight: 600, fontSize: 22, letterSpacing: "-0.02em", color: "var(--islametra-fg)", marginBottom: 4 }}>
          Manajemen <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400, color: "oklch(0.78 0.13 155)" }}>Users</em>
        </h1>
        <p style={{ fontSize: 13, color: "var(--islametra-fg-dim)", fontFamily: "'Geist', sans-serif" }}>
          {users.length} user terdaftar
        </p>
      </div>

      <div style={{ borderRadius: 14, backgroundColor: "var(--islametra-bg)", border: "1px solid var(--islametra-line)", overflow: "hidden" }}>
        {/* Table header */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 200px 100px 120px 100px", padding: "12px 20px", borderBottom: "1px solid var(--islametra-line)", background: "rgba(255,255,255,0.02)" }}>
          {["User", "Email", "Role", "Aktivitas", "Bergabung"].map((h) => (
            <span key={h} style={{ fontSize: 11, fontFamily: "'Geist Mono', monospace", color: "var(--islametra-fg-dim)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</span>
          ))}
        </div>

        {users.length === 0 ? (
          <div style={{ padding: "48px 20px", textAlign: "center" }}>
            <Users size={32} style={{ color: "var(--islametra-fg-dim)", margin: "0 auto 12px" }} />
            <p style={{ fontSize: 14, color: "var(--islametra-fg-dim)", fontFamily: "'Geist', sans-serif" }}>Belum ada user terdaftar.</p>
          </div>
        ) : (
          users.map((user, i) => (
            <div
              key={user.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 200px 100px 120px 100px",
                padding: "14px 20px",
                borderBottom: i < users.length - 1 ? "1px solid var(--islametra-line)" : "none",
                alignItems: "center",
              }}
            >
              {/* Name */}
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "oklch(0.62 0.13 155 / 0.12)", border: "1px solid oklch(0.62 0.13 155 / 0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {user.imageUrl
                    ? <img src={user.imageUrl} alt="" style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }} />
                    : <User size={14} style={{ color: "oklch(0.78 0.13 155)" }} />
                  }
                </div>
                <span style={{ fontSize: 13, fontFamily: "'Geist', sans-serif", color: "var(--islametra-fg-soft)", fontWeight: 500 }}>
                  {user.name ?? "—"}
                </span>
              </div>

              {/* Email */}
              <span style={{ fontSize: 12, fontFamily: "'Geist Mono', monospace", color: "var(--islametra-fg-dim)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user.email}
              </span>

              {/* Role */}
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                fontSize: 10, fontFamily: "'Geist Mono', monospace", letterSpacing: "0.05em",
                padding: "3px 8px", borderRadius: 999, textTransform: "uppercase",
                background: user.role === "ADMIN" ? "oklch(0.62 0.13 155 / 0.12)" : "rgba(255,255,255,0.04)",
                color: user.role === "ADMIN" ? "oklch(0.78 0.13 155)" : "var(--islametra-fg-dim)",
                border: `1px solid ${user.role === "ADMIN" ? "oklch(0.62 0.13 155 / 0.25)" : "var(--islametra-line)"}`,
                width: "fit-content",
              }}>
                {user.role === "ADMIN" ? <ShieldCheck size={10} /> : <User size={10} />}
                {user.role}
              </span>

              {/* Activity */}
              <div style={{ fontSize: 11, fontFamily: "'Geist Mono', monospace", color: "var(--islametra-fg-dim)" }}>
                <div>{user._count.bookmarks} bookmark</div>
                <div>{user._count.chatSessions} chat</div>
              </div>

              {/* Date */}
              <span style={{ fontSize: 11, fontFamily: "'Geist Mono', monospace", color: "var(--islametra-fg-dim)" }}>
                {new Date(user.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "2-digit" })}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

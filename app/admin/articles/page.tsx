import { requireAdmin } from "@/lib/admin-guard";
import Link from "next/link";
import { FileText, Plus, Eye, EyeOff } from "lucide-react";

export const dynamic = "force-dynamic";

async function getArticles() {
  try {
    const { default: prisma } = await import("@/lib/prisma");
    return await prisma.article.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, slug: true, category: true, published: true, createdAt: true },
    });
  } catch {
    return [];
  }
}

export default async function AdminArticlesPage() {
  await requireAdmin();

  const articles = await getArticles();

  return (
    <div style={{ padding: 32 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: "'Geist', sans-serif", fontWeight: 600, fontSize: 22, letterSpacing: "-0.02em", color: "var(--islametra-fg)", marginBottom: 4 }}>
            Manajemen <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400, color: "oklch(0.78 0.13 155)" }}>Artikel</em>
          </h1>
          <p style={{ fontSize: 13, color: "var(--islametra-fg-dim)", fontFamily: "'Geist', sans-serif" }}>
            {articles.length} artikel di database
          </p>
        </div>
        <Link
          href="/admin/articles/new"
          style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "9px 16px", borderRadius: 10,
            background: "linear-gradient(180deg, oklch(0.7 0.13 155) 0%, oklch(0.55 0.12 155) 100%)",
            color: "#08110b", fontSize: 13, fontWeight: 600,
            fontFamily: "'Geist', sans-serif", textDecoration: "none",
          }}
        >
          <Plus size={14} />
          Artikel Baru
        </Link>
      </div>

      <div style={{ borderRadius: 14, backgroundColor: "var(--islametra-bg)", border: "1px solid var(--islametra-line)", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 150px 100px 120px", padding: "12px 20px", borderBottom: "1px solid var(--islametra-line)", background: "rgba(255,255,255,0.02)" }}>
          {["Judul", "Kategori", "Status", "Dibuat"].map((h) => (
            <span key={h} style={{ fontSize: 11, fontFamily: "'Geist Mono', monospace", color: "var(--islametra-fg-dim)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</span>
          ))}
        </div>

        {articles.length === 0 ? (
          <div style={{ padding: "48px 20px", textAlign: "center" }}>
            <FileText size={32} style={{ color: "var(--islametra-fg-dim)", margin: "0 auto 12px" }} />
            <p style={{ fontSize: 14, color: "var(--islametra-fg-dim)", fontFamily: "'Geist', sans-serif", marginBottom: 16 }}>
              Belum ada artikel. Buat artikel pertama kamu.
            </p>
            <Link
              href="/admin/articles/new"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "8px 16px", borderRadius: 9,
                background: "oklch(0.62 0.13 155 / 0.12)",
                border: "1px solid oklch(0.62 0.13 155 / 0.25)",
                color: "oklch(0.78 0.13 155)", fontSize: 13,
                fontFamily: "'Geist', sans-serif", textDecoration: "none",
              }}
            >
              <Plus size={13} /> Buat Artikel
            </Link>
          </div>
        ) : (
          articles.map((article, i) => (
            <div
              key={article.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 150px 100px 120px",
                padding: "14px 20px",
                borderBottom: i < articles.length - 1 ? "1px solid var(--islametra-line)" : "none",
                alignItems: "center",
              }}
            >
              <div>
                <p style={{ fontSize: 13, fontFamily: "'Geist', sans-serif", color: "var(--islametra-fg-soft)", fontWeight: 500, marginBottom: 2 }}>
                  {article.title}
                </p>
                <p style={{ fontSize: 11, fontFamily: "'Geist Mono', monospace", color: "var(--islametra-fg-dim)" }}>
                  /{article.slug}
                </p>
              </div>
              <span style={{ fontSize: 12, fontFamily: "'Geist', sans-serif", color: "var(--islametra-fg-dim)" }}>
                {article.category}
              </span>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 4,
                fontSize: 10, fontFamily: "'Geist Mono', monospace", letterSpacing: "0.05em",
                padding: "3px 8px", borderRadius: 999, textTransform: "uppercase",
                background: article.published ? "oklch(0.62 0.13 155 / 0.12)" : "rgba(255,255,255,0.04)",
                color: article.published ? "oklch(0.78 0.13 155)" : "var(--islametra-fg-dim)",
                border: `1px solid ${article.published ? "oklch(0.62 0.13 155 / 0.25)" : "var(--islametra-line)"}`,
                width: "fit-content",
              }}>
                {article.published ? <Eye size={10} /> : <EyeOff size={10} />}
                {article.published ? "Publik" : "Draft"}
              </span>
              <span style={{ fontSize: 11, fontFamily: "'Geist Mono', monospace", color: "var(--islametra-fg-dim)" }}>
                {new Date(article.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "2-digit" })}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

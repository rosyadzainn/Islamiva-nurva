import Link from "next/link";
import { BookOpen } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Artikel Islam",
  description: "Kumpulan artikel sejarah dan pengetahuan Islam.",
};

async function getArticles() {
  try {
    const { default: prisma } = await import("@/lib/prisma");
    return await prisma.article.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, slug: true, excerpt: true, category: true, createdAt: true },
    });
  } catch {
    return [];
  }
}

export default async function ArtikelPage() {
  const articles = await getArticles();

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 16px" }}>
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontFamily: "'Geist', sans-serif", fontWeight: 700, fontSize: 28, letterSpacing: "-0.03em", color: "var(--islametra-fg)", marginBottom: 8 }}>
          Artikel{" "}
          <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400, color: "oklch(0.78 0.13 155)" }}>
            Islam
          </em>
        </h1>
        <p style={{ fontSize: 14, color: "var(--islametra-fg-dim)", fontFamily: "'Geist', sans-serif" }}>
          Kumpulan artikel sejarah dan pengetahuan Islam
        </p>
      </div>

      {articles.length === 0 ? (
        <div style={{ textAlign: "center", padding: "64px 0" }}>
          <BookOpen size={40} style={{ color: "var(--islametra-fg-dim)", margin: "0 auto 16px" }} />
          <p style={{ fontSize: 15, color: "var(--islametra-fg-dim)", fontFamily: "'Geist', sans-serif" }}>
            Belum ada artikel yang dipublikasikan.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/artikel/${article.slug}`}
              style={{
                display: "block", padding: "22px 24px", borderRadius: 14, textDecoration: "none",
                backgroundColor: "var(--islametra-bg)", border: "1px solid var(--islametra-line)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{
                  fontSize: 11, fontFamily: "'Geist Mono', monospace", letterSpacing: "0.05em",
                  padding: "3px 8px", borderRadius: 999, textTransform: "uppercase",
                  background: "oklch(0.62 0.13 155 / 0.1)", color: "oklch(0.78 0.13 155)",
                  border: "1px solid oklch(0.62 0.13 155 / 0.2)",
                }}>
                  {article.category}
                </span>
                <span style={{ fontSize: 11, color: "var(--islametra-fg-dim)", fontFamily: "'Geist Mono', monospace" }}>
                  {new Date(article.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>
              <h2 style={{ fontSize: 17, fontWeight: 600, color: "var(--islametra-fg-soft)", fontFamily: "'Geist', sans-serif", letterSpacing: "-0.01em", marginBottom: 8 }}>
                {article.title}
              </h2>
              {article.excerpt && (
                <p style={{ fontSize: 13, color: "var(--islametra-fg-dim)", fontFamily: "'Geist', sans-serif", lineHeight: 1.6 }}>
                  {article.excerpt}
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

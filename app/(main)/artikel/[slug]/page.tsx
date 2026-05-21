import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ChevronLeft } from "lucide-react";

export const dynamic = "force-dynamic";

async function getArticle(slug: string) {
  try {
    const { default: prisma } = await import("@/lib/prisma");
    return await prisma.article.findUnique({
      where: { slug, published: true },
    });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) return { title: "Artikel tidak ditemukan" };
  return {
    title: article.seoTitle ?? article.title,
    description: article.seoDesc ?? article.excerpt ?? undefined,
  };
}

export default async function ArtikelDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 16px" }}>
      {/* Back */}
      <Link
        href="/artikel"
        style={{
          display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 28,
          fontSize: 13, color: "var(--islametra-fg-dim)", fontFamily: "'Geist', sans-serif", textDecoration: "none",
        }}
      >
        <ChevronLeft size={14} />
        Semua Artikel
      </Link>

      {/* Category + date */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <span style={{
          fontSize: 11, fontFamily: "'Geist Mono', monospace", letterSpacing: "0.05em",
          padding: "3px 10px", borderRadius: 999, textTransform: "uppercase",
          background: "oklch(0.62 0.13 155 / 0.1)", color: "oklch(0.78 0.13 155)",
          border: "1px solid oklch(0.62 0.13 155 / 0.2)",
        }}>
          {article.category}
        </span>
        <span style={{ fontSize: 12, color: "var(--islametra-fg-dim)", fontFamily: "'Geist Mono', monospace" }}>
          {new Date(article.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
        </span>
      </div>

      {/* Title */}
      <h1 style={{
        fontFamily: "'Geist', sans-serif", fontWeight: 700, fontSize: "clamp(22px, 4vw, 32px)",
        letterSpacing: "-0.03em", color: "var(--islametra-fg)", marginBottom: 12, lineHeight: 1.2,
      }}>
        {article.title}
      </h1>

      {/* Excerpt */}
      {article.excerpt && (
        <p style={{
          fontSize: 16, color: "var(--islametra-fg-mute)", fontFamily: "'Geist', sans-serif",
          lineHeight: 1.7, marginBottom: 32, borderLeft: "3px solid oklch(0.62 0.13 155 / 0.4)",
          paddingLeft: 16,
        }}>
          {article.excerpt}
        </p>
      )}

      {/* Cover image */}
      {article.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={article.imageUrl}
          alt={article.title}
          style={{ width: "100%", height: "auto", maxHeight: 360, objectFit: "cover", borderRadius: 14, marginBottom: 32, border: "1px solid var(--islametra-line)" }}
        />
      )}

      <hr style={{ border: "none", borderTop: "1px solid var(--islametra-line)", marginBottom: 32 }} />

      {/* Content — render HTML from TipTap, fallback to plain paragraphs */}
      {article.content.startsWith("<") ? (
        <>
          <style>{`
            .article-content p { font-size: 15px; color: var(--islametra-fg-soft); font-family: 'Geist', sans-serif; line-height: 1.8; margin: 0 0 14px; }
            .article-content h2 { font-size: 20px; font-weight: 700; color: var(--islametra-fg); font-family: 'Geist', sans-serif; letter-spacing: -0.02em; margin: 28px 0 10px; }
            .article-content h3 { font-size: 16px; font-weight: 600; color: var(--islametra-fg-soft); font-family: 'Geist', sans-serif; margin: 22px 0 8px; }
            .article-content ul { padding-left: 22px; list-style: disc; margin: 0 0 14px; }
            .article-content ol { padding-left: 22px; list-style: decimal; margin: 0 0 14px; }
            .article-content li { font-size: 15px; color: var(--islametra-fg-soft); font-family: 'Geist', sans-serif; line-height: 1.7; margin: 4px 0; }
            .article-content hr { border: none; border-top: 1px solid var(--islametra-line); margin: 24px 0; }
            .article-content a { color: oklch(0.78 0.13 155); text-decoration: underline; }
            .article-content strong { font-weight: 700; }
            .article-content em { font-style: italic; }
          `}</style>
          <div className="article-content" dangerouslySetInnerHTML={{ __html: article.content }} />
        </>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {article.content.split("\n").filter(Boolean).map((para, i) => (
            <p key={i} style={{ fontSize: 15, color: "var(--islametra-fg-soft)", fontFamily: "'Geist', sans-serif", lineHeight: 1.8 }}>
              {para}
            </p>
          ))}
        </div>
      )}

      {/* Tags */}
      {article.tags.length > 0 && (
        <div style={{ marginTop: 40, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {article.tags.map((tag) => (
            <span key={tag} style={{
              fontSize: 11, fontFamily: "'Geist Mono', monospace", padding: "3px 10px",
              borderRadius: 999, background: "rgba(255,255,255,0.04)", color: "var(--islametra-fg-dim)",
              border: "1px solid var(--islametra-line)",
            }}>
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

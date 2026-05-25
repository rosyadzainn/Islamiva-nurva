import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ArrowRight, BookOpen } from "lucide-react";
import { DAILY_DUAS, DOA_CATEGORIES } from "@/data/doa-data";
import { DoaCopyButton } from "@/components/doa/doa-copy-button";
import { ContentViewTracker } from "@/components/shared/content-view-tracker";
import { T } from "@/components/shared/t";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return DAILY_DUAS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doa = DAILY_DUAS.find((d) => d.slug === slug);
  return {
    title: doa ? `${doa.title} — Doa Islam | Islametra` : "Doa Islam | Islametra",
    description: doa
      ? `${doa.title}: ${doa.translation.slice(0, 140)}`
      : "Koleksi doa-doa islami dengan teks Arab, transliterasi Latin, dan terjemahan bahasa Indonesia.",
    keywords: doa
      ? [doa.title.toLowerCase(), "doa islam", "doa sehari-hari", "doa arab latin terjemahan"]
      : ["doa islam", "doa sehari-hari"],
    alternates: doa ? { canonical: `/doa/${doa.slug}` } : undefined,
    openGraph: doa
      ? {
          title: `${doa.title} — Doa Islam`,
          description: doa.translation.slice(0, 160),
          url: `https://www.islametra.com/doa/${doa.slug}`,
          type: "article",
        }
      : undefined,
  };
}

export default async function DoaDetailPage({ params }: Props) {
  const { slug } = await params;
  const doa = DAILY_DUAS.find((d) => d.slug === slug);

  if (!doa) {
    return (
      <div style={{ backgroundColor: "var(--islametra-bg)", minHeight: "100vh" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "clamp(32px, 5vw, 64px) 28px" }}>
          <Link
            href="/doa"
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              fontSize: 13, color: "var(--islametra-fg-dim)",
              fontFamily: "'Geist', sans-serif", marginBottom: 36, textDecoration: "none",
            }}
          >
            <ChevronLeft size={15} />
            <T id="Kembali ke Doa" en="Back to Prayers" />
          </Link>
          <div style={{ textAlign: "center", padding: "80px 32px", borderRadius: 24, background: "var(--islametra-card-overlay-sm)", border: "1px solid var(--islametra-line)" }}>
            <p style={{ color: "var(--islametra-fg-mute)", fontSize: 15 }}><T id="Doa tidak ditemukan." en="Prayer not found." /></p>
          </div>
        </div>
      </div>
    );
  }

  const category = DOA_CATEGORIES.find((c) => c.id === doa.category);
  const sameCategoryDuas = DAILY_DUAS.filter((d) => d.category === doa.category);
  const currentIndex = sameCategoryDuas.findIndex((d) => d.slug === slug);
  const prevDoa = currentIndex > 0 ? sameCategoryDuas[currentIndex - 1] : null;
  const nextDoa = currentIndex < sameCategoryDuas.length - 1 ? sameCategoryDuas[currentIndex + 1] : null;
  const related = sameCategoryDuas.filter((d) => d.slug !== slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Islametra", item: "https://www.islametra.com" },
      { "@type": "ListItem", position: 2, name: "Doa", item: "https://www.islametra.com/doa" },
      { "@type": "ListItem", position: 3, name: doa.title, item: `https://www.islametra.com/doa/${doa.slug}` },
    ],
  };

  return (
    <div style={{ backgroundColor: "var(--islametra-bg)", minHeight: "100vh" }}>
      <ContentViewTracker event="doa_open" params={{ doa_slug: doa.slug }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "clamp(32px, 5vw, 64px) 28px" }}>

        {/* Back */}
        <Link
          href="/doa"
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 13, color: "var(--islametra-fg-dim)",
            fontFamily: "'Geist', sans-serif", marginBottom: 36, textDecoration: "none",
          }}
        >
          <ChevronLeft size={15} />
          Kembali ke Doa
        </Link>

        {/* Hero card */}
        <div
          style={{
            position: "relative",
            padding: "40px 32px",
            borderRadius: 24,
            background: "var(--islametra-hero-card-bg)",
            border: "1px solid var(--islametra-line-strong)",
            textAlign: "center",
            marginBottom: 32,
            overflow: "hidden",
          }}
        >
          {/* Emerald glow */}
          <div
            style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400, height: 200,
              background: "radial-gradient(ellipse, oklch(0.62 0.13 155 / 0.1), transparent 70%)",
              filter: "blur(30px)", pointerEvents: "none",
            }}
          />
          {/* Shimmer */}
          <div
            style={{
              position: "absolute", inset: 0, borderRadius: 24, padding: 1,
              background: "var(--islametra-shimmer-top)",
              WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor", maskComposite: "exclude", pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative" }}>
            {/* Category badge */}
            {category && (
              <div
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "4px 12px", borderRadius: 999,
                  background: "oklch(0.62 0.13 155 / 0.1)",
                  border: "1px solid oklch(0.62 0.13 155 / 0.2)",
                  marginBottom: 20,
                }}
              >
                <span style={{ fontSize: 13 }}>{category.icon}</span>
                <span
                  style={{
                    fontSize: 10, fontFamily: "'Geist Mono', monospace",
                    letterSpacing: "0.06em", color: "oklch(0.85 0.1 155)",
                    textTransform: "uppercase",
                  }}
                >
                  {category.nameId}
                </span>
              </div>
            )}

            <h1
              style={{
                fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 600,
                fontFamily: "'Geist', sans-serif", color: "var(--islametra-fg)",
                letterSpacing: "-0.02em", marginBottom: 24,
              }}
            >
              {doa.title}
            </h1>

            {/* Arabic */}
            <p
              className="font-arabic"
              lang="ar"
              dir="rtl"
              style={{
                fontSize: "clamp(24px, 4vw, 36px)",
                color: "var(--islametra-gold-soft)",
                lineHeight: 2,
                opacity: 0.9,
              }}
            >
              {doa.arabic}
            </p>
          </div>
        </div>

        {/* Latin + Translation card */}
        <div
          style={{
            borderRadius: 20,
            background: "var(--islametra-content-card-bg)",
            border: "1px solid var(--islametra-line)",
            overflow: "hidden",
            marginBottom: 24,
          }}
        >
          {/* Latin */}
          <div style={{ padding: "20px 24px 18px", borderBottom: "1px dashed var(--islametra-line)" }}>
            <p
              style={{
                fontSize: 11, fontFamily: "'Geist Mono', monospace",
                letterSpacing: "0.07em", textTransform: "uppercase",
                color: "var(--islametra-fg-dim)", marginBottom: 10,
              }}
            >
              <T id="Transliterasi Latin" en="Latin Transliteration" />
            </p>
            <p
              style={{
                fontSize: 15, fontStyle: "italic", lineHeight: 1.8,
                color: "var(--islametra-fg-soft)", fontFamily: "'Geist', sans-serif",
                letterSpacing: "0.01em",
              }}
            >
              {doa.latin}
            </p>
          </div>

          {/* Translation */}
          <div style={{ padding: "20px 24px 22px", borderBottom: "1px dashed var(--islametra-line)" }}>
            <p
              style={{
                fontSize: 11, fontFamily: "'Geist Mono', monospace",
                letterSpacing: "0.07em", textTransform: "uppercase",
                color: "var(--islametra-fg-dim)", marginBottom: 10,
              }}
            >
              <T id="Terjemahan" en="Translation" />
            </p>
            <p
              style={{
                fontSize: 15, lineHeight: 1.8,
                color: "var(--islametra-fg-mute)", fontFamily: "'Geist', sans-serif",
              }}
            >
              {doa.translation}
            </p>
          </div>

          {/* Source */}
          {doa.source && (
            <div
              style={{
                padding: "14px 24px",
                display: "flex", alignItems: "center", gap: 8,
              }}
            >
              <BookOpen size={13} style={{ color: "var(--islametra-fg-dim)", flexShrink: 0 }} />
              <p
                style={{
                  fontSize: 12, fontFamily: "'Geist Mono', monospace",
                  color: "var(--islametra-fg-dim)", letterSpacing: "0.02em",
                }}
              >
                {doa.source}
              </p>
            </div>
          )}
        </div>

        {/* Copy button */}
        <DoaCopyButton arabic={doa.arabic} latin={doa.latin} translation={doa.translation} source={doa.source} />

        {/* Navigation */}
        {(prevDoa || nextDoa) && (
          <div
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              marginTop: 40, paddingTop: 24, borderTop: "1px solid var(--islametra-line)",
              gap: 12,
            }}
          >
            {prevDoa ? (
              <Link href={`/doa/${prevDoa.slug}`} style={{ textDecoration: "none", flex: 1 }}>
                <div
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "12px 16px", borderRadius: 12,
                    background: "var(--islametra-card-overlay)",
                    border: "1px solid var(--islametra-line)",
                  }}
                >
                  <ChevronLeft size={15} style={{ color: "var(--islametra-fg-dim)", flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: 10, color: "var(--islametra-fg-dim)", fontFamily: "'Geist Mono', monospace", letterSpacing: "0.04em", marginBottom: 2 }}>
                      <T id="Sebelumnya" en="Previous" />
                    </p>
                    <p style={{ fontSize: 12, fontWeight: 500, color: "var(--islametra-fg-soft)", fontFamily: "'Geist', sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {prevDoa.title}
                    </p>
                  </div>
                </div>
              </Link>
            ) : <div style={{ flex: 1 }} />}

            {nextDoa ? (
              <Link href={`/doa/${nextDoa.slug}`} style={{ textDecoration: "none", flex: 1 }}>
                <div
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 10,
                    padding: "12px 16px", borderRadius: 12,
                    background: "var(--islametra-card-overlay)",
                    border: "1px solid var(--islametra-line)",
                  }}
                >
                  <div style={{ minWidth: 0, textAlign: "right" }}>
                    <p style={{ fontSize: 10, color: "var(--islametra-fg-dim)", fontFamily: "'Geist Mono', monospace", letterSpacing: "0.04em", marginBottom: 2 }}>
                      <T id="Berikutnya" en="Next" />
                    </p>
                    <p style={{ fontSize: 12, fontWeight: 500, color: "var(--islametra-fg-soft)", fontFamily: "'Geist', sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {nextDoa.title}
                    </p>
                  </div>
                  <ArrowRight size={15} style={{ color: "var(--islametra-fg-dim)", flexShrink: 0 }} />
                </div>
              </Link>
            ) : <div style={{ flex: 1 }} />}
          </div>
        )}

        {/* Related */}
        {related.length > 0 && (
          <div style={{ marginTop: 40, paddingTop: 32, borderTop: "1px solid var(--islametra-line)" }}>
            <p
              style={{
                fontSize: 11, fontFamily: "'Geist Mono', monospace",
                letterSpacing: "0.08em", textTransform: "uppercase",
                color: "var(--islametra-fg-dim)", marginBottom: 16,
              }}
            >
              <T id="Doa Lainnya dalam Kategori Ini" en="Other Prayers in This Category" />
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {related.map((d) => (
                <Link key={d.slug} href={`/doa/${d.slug}`} style={{ textDecoration: "none" }}>
                  <div
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "12px 16px", borderRadius: 12,
                      background: "var(--islametra-card-overlay-sm)",
                      border: "1px solid var(--islametra-line)",
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 500, color: "var(--islametra-fg-soft)", fontFamily: "'Geist', sans-serif", marginBottom: 2 }}>
                        {d.title}
                      </p>
                      <p style={{ fontSize: 11, color: "var(--islametra-fg-dim)", fontFamily: "'Geist', sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {d.latin}
                      </p>
                    </div>
                    <ArrowRight size={14} style={{ color: "var(--islametra-fg-dim)", flexShrink: 0, marginLeft: 12 }} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


import { requireAdmin } from "@/lib/admin-guard";
import Link from "next/link";
import { BookOpen, FileText, Scroll, Globe } from "lucide-react";

export const dynamic = "force-dynamic";

const CONTENT_SECTIONS = [
  {
    title: "Artikel",
    desc: "Kelola artikel sejarah, ulama, dan konten Islam",
    href: "/admin/articles",
    icon: FileText,
    color: "oklch(0.78 0.13 155)",
  },
  {
    title: "Al-Quran",
    desc: "114 surah tersedia dari data statis",
    href: "/quran",
    icon: BookOpen,
    color: "oklch(0.75 0.12 250)",
  },
  {
    title: "Doa Harian",
    desc: "26 doa tersedia dari data statis",
    href: "/doa",
    icon: Scroll,
    color: "oklch(0.75 0.15 30)",
  },
  {
    title: "Sejarah Islam",
    desc: "16 artikel sejarah dari data statis",
    href: "/sejarah",
    icon: Globe,
    color: "oklch(0.78 0.10 80)",
  },
];

export default async function AdminContentPage() {
  await requireAdmin();

  return (
    <div style={{ padding: 32, maxWidth: 800 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Geist', sans-serif", fontWeight: 600, fontSize: 22, letterSpacing: "-0.02em", color: "var(--islametra-fg)", marginBottom: 4 }}>
          Kelola <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400, color: "oklch(0.78 0.13 155)" }}>Konten</em>
        </h1>
        <p style={{ fontSize: 13, color: "var(--islametra-fg-dim)", fontFamily: "'Geist', sans-serif" }}>
          Semua konten platform Islametra
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {CONTENT_SECTIONS.map((section) => {
          const Icon = section.icon;
          return (
            <Link
              key={section.href}
              href={section.href}
              style={{
                padding: "22px 24px",
                borderRadius: 14,
                backgroundColor: "var(--islametra-bg)",
                border: "1px solid var(--islametra-line)",
                textDecoration: "none",
                display: "block",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: 9,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid var(--islametra-line)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon size={16} style={{ color: section.color }} />
                </div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--islametra-fg-soft)", fontFamily: "'Geist', sans-serif" }}>
                  {section.title}
                </p>
              </div>
              <p style={{ fontSize: 12, color: "var(--islametra-fg-dim)", fontFamily: "'Geist', sans-serif", lineHeight: 1.5 }}>
                {section.desc}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";

const cols = [
  {
    title: "Produk",
    links: [
      { label: "Al-Quran", href: "/quran" },
      { label: "Doa Harian", href: "/doa" },
      { label: "Hadits", href: "/hadith" },
      { label: "Kisah Nabi", href: "/kisah-nabi" },
      { label: "Sejarah Islam", href: "/sejarah" },
      { label: "Islamiva AI", href: "/ai-chat" },
    ],
  },
  {
    title: "Sumber",
    links: [
      { label: "Tafsir", href: "#" },
      { label: "Sanad Hadits", href: "#" },
      { label: "Atlas Sejarah", href: "#" },
      { label: "Daftar Ulama", href: "#" },
      { label: "Glosarium", href: "#" },
    ],
  },
  {
    title: "Komunitas",
    links: [
      { label: "Tentang Kami", href: "/about" },
      { label: "Blog", href: "#" },
      { label: "Donasi", href: "#" },
      { label: "Kontak", href: "/contact" },
    ],
  },
  {
    title: "Bantuan",
    links: [
      { label: "Pusat Bantuan", href: "#" },
      { label: "Panduan", href: "#" },
      { label: "Kebijakan Privasi", href: "/privacy" },
      { label: "Syarat Layanan", href: "/terms" },
    ],
  },
];

export function Footer() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const isLight = mounted && theme === "light";

  useEffect(() => { setMounted(true); }, []);

  return (
    <footer
      className="relative overflow-hidden"
      style={{
        backgroundColor: "var(--islamiva-bg)",
        borderTop: "1px solid var(--islamiva-line)",
        padding: "100px 0 40px",
      }}
    >
      {/* Bottom radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 80% at 50% 100%, oklch(0.62 0.13 155 / 0.10), transparent 60%)",
        }}
      />

      <div
        className="relative"
        style={{ maxWidth: 1240, margin: "0 auto", padding: "0 28px" }}
      >
        {/* Grid */}
        <div className="islamiva-footer-grid mb-20">
          {/* Brand col */}
          <div className="islamiva-footer-brand" style={{ maxWidth: 320 }}>
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div
                style={{
                  width: 32, height: 32, borderRadius: 9,
                  display: "grid", placeItems: "center",
                  background:
                    "radial-gradient(circle at 30% 30%, oklch(0.78 0.12 155) 0%, oklch(0.45 0.11 155) 70%)",
                  color: "#08110b",
                  fontSize: 18,
                  fontFamily: "'Amiri', serif",
                  fontWeight: 700,
                }}
              >
                ن
              </div>
              <span
                style={{
                  fontFamily: "'Geist', sans-serif",
                  fontWeight: 600,
                  fontSize: 19,
                  letterSpacing: "-0.02em",
                  color: "var(--islamiva-fg)",
                }}
              >
                Islamiva
              </span>
            </Link>

            <p
              style={{
                fontSize: 14, lineHeight: 1.65,
                color: "var(--islamiva-fg-mute)",
                marginBottom: 24,
              }}
            >
              Platform Islam modern berbasis AI — menemani perjalanan
              spiritual Anda dengan rujukan otentik dan pengalaman yang tenang.
            </p>

            {/* Newsletter */}
            <div
              className="flex gap-1.5"
              style={{
                padding: "5px 5px 5px 14px",
                borderRadius: 12,
                background: isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.03)",
                border: "1px solid var(--islamiva-line)",
                maxWidth: 320,
              }}
            >
              <input
                type="email"
                placeholder="Email Anda"
                style={{
                  flex: 1, background: "transparent",
                  border: 0, outline: 0,
                  color: "var(--islamiva-fg)",
                  fontFamily: "inherit",
                  fontSize: 13,
                  padding: "8px 0",
                }}
              />
              <button
                style={{
                  height: 32, padding: "0 12px",
                  borderRadius: 8,
                  fontSize: 12.5, fontWeight: 500,
                  background:
                    "linear-gradient(180deg, oklch(0.7 0.13 155), oklch(0.5 0.12 155))",
                  color: "#08110b",
                  flexShrink: 0,
                }}
              >
                Berlangganan
              </button>
            </div>
          </div>

          {/* Link cols */}
          {cols.map((col) => (
            <div key={col.title}>
              <h4
                style={{
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--islamiva-fg-dim)",
                  margin: "0 0 18px",
                  fontWeight: 500,
                }}
              >
                {col.title}
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      style={{
                        fontSize: 14,
                        color: "var(--islamiva-fg-mute)",
                        transition: "color 0.18s ease",
                      }}
                      className="islamiva-footer-link"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex items-center justify-between flex-wrap gap-4"
          style={{
            paddingTop: 32,
            borderTop: "1px solid var(--islamiva-line)",
          }}
        >
          <div
            className="flex items-center gap-4 flex-wrap"
            style={{ fontSize: 12.5, color: "var(--islamiva-fg-dim)" }}
          >
            <span>© {new Date().getFullYear()} Islamiva</span>
            <span>·</span>
            <span
              className="font-arabic"
              lang="ar" dir="rtl"
              style={{ fontStyle: "italic", color: "var(--islamiva-gold)", opacity: 0.7 }}
            >
              صنع بحب
            </span>
            <span>·</span>
            <span>Made with care for the ummah</span>
          </div>
          <div className="flex gap-1.5">
            {["Globe", "Compass", "Play"].map((name) => (
              <a
                key={name}
                href="#"
                style={{
                  width: 34, height: 34, borderRadius: 9,
                  display: "grid", placeItems: "center",
                  color: "var(--islamiva-fg-mute)",
                  border: "1px solid var(--islamiva-line)",
                  background: isLight ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.02)",
                  fontSize: 13,
                }}
              >
                {name === "Globe" ? "🌐" : name === "Compass" ? "🧭" : "▶"}
              </a>
            ))}
          </div>
        </div>

        {/* Giant watermark */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: "50%", bottom: -100,
            transform: "translateX(-50%)",
            fontFamily: "'Instrument Serif', serif",
            fontStyle: "italic",
            fontSize: "clamp(160px, 22vw, 320px)",
            lineHeight: 1,
            color: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.025)",
            letterSpacing: "-0.04em",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            userSelect: "none",
          }}
        >
          Islamiva
        </div>
      </div>
    </footer>
  );
}

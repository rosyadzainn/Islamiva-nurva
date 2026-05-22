"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useLang } from "@/contexts/language-context";
import { translations } from "@/lib/translations";

export function Footer() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const { lang } = useLang();
  const tf = translations[lang].footer;
  const isLight = mounted && theme === "light";

  useEffect(() => { setMounted(true); }, []);

  return (
    <footer
      className="relative overflow-hidden"
      style={{
        backgroundColor: "var(--islametra-bg)",
        borderTop: "1px solid var(--islametra-line)",
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
        <div className="islametra-footer-grid mb-20">
          {/* Brand col */}
          <div className="islametra-footer-brand" style={{ maxWidth: 320 }}>
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div
                style={{
                  width: 32, height: 32, borderRadius: 9,
                  overflow: "hidden",
                  boxShadow: "0 3px 14px -4px oklch(0.62 0.13 155 / 0.5)",
                  flexShrink: 0,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/icon.svg" alt="Islametra" width={32} height={32} style={{ display: "block" }} />
              </div>
              <span
                style={{
                  fontFamily: "'Geist', sans-serif",
                  fontWeight: 600,
                  fontSize: 19,
                  letterSpacing: "-0.02em",
                  color: "var(--islametra-fg)",
                }}
              >
                Islametra
              </span>
            </Link>

            <p
              style={{
                fontSize: 14, lineHeight: 1.65,
                color: "var(--islametra-fg-mute)",
                marginBottom: 24,
              }}
            >
              {tf.tagline}
            </p>

          </div>

          {/* Link cols */}
          {tf.cols.map((col) => (
            <div key={col.title}>
              <h4
                style={{
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--islametra-fg-dim)",
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
                        color: "var(--islametra-fg-mute)",
                        transition: "color 0.18s ease",
                      }}
                      className="islametra-footer-link"
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
            borderTop: "1px solid var(--islametra-line)",
          }}
        >
          <div
            className="flex items-center gap-4 flex-wrap"
            style={{ fontSize: 12.5, color: "var(--islametra-fg-dim)" }}
          >
            <span>© {new Date().getFullYear()} Islametra</span>
            <span>·</span>
            <span
              className="font-arabic"
              lang="ar" dir="rtl"
              style={{ fontStyle: "italic", color: "var(--islametra-gold)", opacity: 0.7 }}
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
                  color: "var(--islametra-fg-mute)",
                  border: "1px solid var(--islametra-line)",
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
          Islametra
        </div>
      </div>
    </footer>
  );
}

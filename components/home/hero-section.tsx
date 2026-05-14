"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";

const GEOMETRIC_PATTERN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160' fill='none' stroke='%23ffffff' stroke-width='0.6' stroke-opacity='0.07'><g transform='translate(80 80)'><polygon points='-30,0 -21,-21 0,-30 21,-21 30,0 21,21 0,30 -21,21'/><polygon points='-30,0 -21,-21 0,-30 21,-21 30,0 21,21 0,30 -21,21' transform='rotate(22.5)'/><circle r='30'/><circle r='15'/></g></svg>")`;

const stats = [
  { num: "114", label: "Surah" },
  { num: "6,236", label: "Ayat" },
  { num: "40,000", label: "Hadits", plus: true },
  { num: "25", label: "Kisah Nabi" },
  { num: "120k", label: "Pengguna", plus: true },
];

const chips = [
  "Hafalkan Surah Al-Mulk",
  "Doa sebelum tidur",
  "Hadits tentang ilmu",
  "Kisah Nabi Yusuf",
];

const fadeUp = { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 } };
const ease = [0.2, 0.8, 0.2, 1] as const;

export function HeroSection() {
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { theme } = useTheme();
  const isLight = mounted && theme === "light";

  useEffect(() => { setMounted(true); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/quran?search=${encodeURIComponent(query)}`);
  };

  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundColor: "var(--islamiva-bg)",
        padding: "clamp(70px, 10vw, 130px) 0 clamp(80px, 11vw, 140px)",
      }}
    >
      {/* Grid lines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: isLight
            ? "linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)"
            : "linear-gradient(to right, rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.022) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 30%, #000 30%, transparent 80%)",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 30%, #000 30%, transparent 80%)",
        }}
      />

      {/* Islamic 8-fold geometric */}
      <div
        className="absolute inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage: GEOMETRIC_PATTERN,
          backgroundSize: "160px 160px",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 50% at 50% 40%, #000, transparent 70%)",
          maskImage:
            "radial-gradient(ellipse 60% 50% at 50% 40%, #000, transparent 70%)",
        }}
      />

      {/* Emerald radial glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 1200, height: 900,
          left: "50%", top: -200,
          transform: "translateX(-50%)",
          background:
            "radial-gradient(ellipse 50% 50% at 50% 50%, oklch(0.62 0.13 155 / 0.28) 0%, transparent 60%)",
          filter: "blur(40px)",
        }}
      />
      {/* Gold accent glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 600, height: 600,
          left: "65%", top: 280,
          background:
            "radial-gradient(circle, oklch(0.82 0.08 80 / 0.12) 0%, transparent 60%)",
          filter: "blur(60px)",
        }}
      />

      {/* Content */}
      <div
        className="relative z-10"
        style={{ maxWidth: 1240, margin: "0 auto", padding: "0 28px", textAlign: "center" }}
      >
        {/* Eyebrow */}
        <motion.div {...fadeUp} transition={{ duration: 0.9, ease }} style={{ marginBottom: 28 }}>
          <span
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "6px 14px", borderRadius: 9999,
              fontSize: 11, fontWeight: 500,
              fontFamily: "'Geist Mono', monospace",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              background: isLight ? "rgba(0,0,0,0.03)" : "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
              border: "1px solid var(--islamiva-line)",
              color: "var(--islamiva-fg-soft)",
            }}
          >
            <span
              style={{
                width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                background: "var(--islamiva-emerald)",
                boxShadow: "0 0 10px var(--islamiva-emerald)",
              }}
            />
            v2.0 — Sekarang dengan Islamiva AI
          </span>
        </motion.div>

        {/* Bismillah */}
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.9, delay: 0.1, ease }}
          className="font-arabic"
          lang="ar"
          dir="rtl"
          style={{
            fontSize: "clamp(20px, 2vw, 26px)",
            color: "var(--islamiva-gold-soft)",
            opacity: 0.85,
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </motion.p>

        {/* Heading */}
        <motion.h1
          {...fadeUp}
          transition={{ duration: 0.9, delay: 0.2, ease }}
          style={{
            fontFamily: "'Geist', sans-serif",
            fontWeight: 500,
            fontSize: "clamp(44px, 6.4vw, 88px)",
            lineHeight: 0.96,
            letterSpacing: "-0.035em",
            color: "var(--islamiva-fg)",
            margin: "0 auto 24px",
            maxWidth: 900,
            textAlign: "center",
          }}
        >
          Pelajari Islam dengan{" "}
          <em
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: "italic",
              fontWeight: 400,
              background:
                "linear-gradient(180deg, #f9f7eb 0%, oklch(0.82 0.08 80) 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.01em",
            }}
          >
            kecerdasan
          </em>
          <br />
          yang penuh ketenangan.
        </motion.h1>

        {/* Lede */}
        <motion.p
          {...fadeUp}
          transition={{ duration: 0.9, delay: 0.3, ease }}
          style={{
            fontSize: "clamp(16px, 1.35vw, 18px)",
            color: "var(--islamiva-fg-mute)",
            maxWidth: "56ch",
            margin: "0 auto 38px",
            lineHeight: 1.55,
            textAlign: "center",
          }}
        >
          Islamiva menyatukan Al-Quran, hadits, doa, dan kisah para Nabi dalam satu platform
          AI modern — dirancang untuk membantu Anda memahami, merenung, dan terhubung lebih dalam.
        </motion.p>

        {/* CTAs */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.9, delay: 0.35, ease }}
          className="flex items-center justify-center flex-wrap"
          style={{ gap: 12, marginBottom: 64 }}
        >
          <Link href="/sign-up">
            <button
              className="inline-flex items-center gap-2 transition-transform hover:-translate-y-px active:scale-95"
              style={{
                height: 50, padding: "0 22px",
                borderRadius: 12,
                fontSize: 15, fontWeight: 500,
                background:
                  "linear-gradient(180deg, oklch(0.7 0.13 155) 0%, oklch(0.55 0.12 155) 100%)",
                color: "#08110b",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.25), 0 1px 0 rgba(0,0,0,0.4), 0 12px 28px -12px oklch(0.62 0.13 155 / 0.55)",
              }}
            >
              Mulai Sekarang
              <ArrowRight size={16} />
            </button>
          </Link>
          <Link href="#features">
            <button
              className="inline-flex items-center gap-2 transition-colors"
              style={{
                height: 50, padding: "0 22px",
                borderRadius: 12,
                fontSize: 15, fontWeight: 500,
                background: isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.03)",
                border: "1px solid var(--islamiva-line)",
                color: "var(--islamiva-fg)",
              }}
            >
              Lihat Cara Kerja
            </button>
          </Link>
        </motion.div>

        {/* Prompt area with floating glass cards */}
        <motion.div
          {...fadeUp}
          transition={{ duration: 0.9, delay: 0.5, ease }}
          className="relative"
          style={{ maxWidth: 720, margin: "0 auto" }}
        >
          {/* Floating card — left */}
          <div
            className="absolute hidden xl:block"
            style={{
              top: -120, left: -260, width: 220,
              background: isLight ? "rgba(255,255,255,0.75)" : "rgba(13, 16, 14, 0.6)",
              border: "1px solid var(--islamiva-line-strong)",
              borderRadius: 14,
              backdropFilter: "blur(14px)",
              padding: "12px 14px",
              fontSize: 12.5,
              color: "var(--islamiva-fg-mute)",
              boxShadow: "0 18px 40px -18px rgba(0,0,0,0.7)",
              animation: "islamiva-float 8s ease-in-out infinite",
              animationDelay: "-2s",
            }}
          >
            <div
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: 10, textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--islamiva-fg-dim)", marginBottom: 6,
              }}
            >
              Surah · 36:1–2
            </div>
            <div
              className="font-arabic"
              lang="ar" dir="rtl"
              style={{ fontSize: 18, color: "var(--islamiva-gold-soft)", marginBottom: 4 }}
            >
              يٰسٓ ۚ وَالْقُرْاٰنِ الْحَكِيْمِ
            </div>
            <div className="flex items-center justify-between">
              <span style={{ fontSize: 11, color: "var(--islamiva-fg-mute)" }}>Yasin</span>
              <span
                style={{
                  padding: "2px 7px", borderRadius: 6,
                  background: "oklch(0.62 0.13 155 / 0.18)",
                  color: "oklch(0.78 0.13 155)",
                  fontFamily: "'Geist Mono', monospace", fontSize: 10,
                }}
              >
                83 ayat
              </span>
            </div>
          </div>

          {/* Floating card — right */}
          <div
            className="absolute hidden xl:block"
            style={{
              top: -180, right: -260, width: 230,
              background: isLight ? "rgba(255,255,255,0.75)" : "rgba(13, 16, 14, 0.6)",
              border: "1px solid var(--islamiva-line-strong)",
              borderRadius: 14,
              backdropFilter: "blur(14px)",
              padding: "12px 14px",
              fontSize: 12.5,
              color: "var(--islamiva-fg-mute)",
              boxShadow: "0 18px 40px -18px rgba(0,0,0,0.7)",
              animation: "islamiva-float 8s ease-in-out infinite",
              animationDelay: "-4s",
            }}
          >
            <div
              style={{
                fontFamily: "'Geist Mono', monospace",
                fontSize: 10, textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--islamiva-fg-dim)", marginBottom: 6,
              }}
            >
              Doa · Pagi Hari
            </div>
            <div style={{ color: "var(--islamiva-fg)", fontWeight: 500, marginBottom: 4 }}>
              Pelindungan & Keberkahan
            </div>
            <div style={{ fontSize: 11.5, lineHeight: 1.5, color: "var(--islamiva-fg-mute)" }}>
              Aku berlindung kepada Allah dari godaan setan yang terkutuk…
            </div>
          </div>

          {/* Search / Prompt bar */}
          <form
            onSubmit={handleSearch}
            style={{
              background: isLight
                ? "rgba(255,255,255,0.82)"
                : "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01)), rgba(13, 16, 14, 0.7)",
              border: "1px solid var(--islamiva-line-strong)",
              borderRadius: 20,
              padding: "8px 8px 8px 18px",
              display: "flex", alignItems: "center", gap: 10,
              backdropFilter: "blur(20px)",
              boxShadow: isLight
                ? "0 8px 30px -10px rgba(0,0,0,0.12), 0 0 0 6px oklch(0.48 0.14 155 / 0.06)"
                : "0 1px 0 rgba(255,255,255,0.04) inset, 0 30px 80px -30px rgba(0,0,0,0.7), 0 0 0 6px oklch(0.62 0.13 155 / 0.04)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ color: "var(--islamiva-emerald-soft)", flexShrink: 0 }}>
              <path d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5L12 2Z" fill="currentColor" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder='Tanyakan apa saja — "Apa makna sabar dalam Surah Al-Baqarah?"'
              style={{
                flex: 1, background: "transparent",
                border: 0, outline: 0,
                color: "var(--islamiva-fg)",
                fontFamily: "inherit", fontSize: 15,
                padding: "12px 0",
              }}
            />
            <button
              type="submit"
              style={{
                width: 40, height: 40, flexShrink: 0,
                borderRadius: 12,
                display: "grid", placeItems: "center",
                background:
                  "linear-gradient(180deg, oklch(0.7 0.13 155), oklch(0.5 0.12 155))",
                color: "#08110b",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.25), 0 8px 22px -10px oklch(0.62 0.13 155 / 0.7)",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m22 2-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </form>

          {/* Suggestion chips */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginTop: 24 }}>
            {chips.map((chip) => (
              <button
                key={chip}
                className="transition-colors"
                style={{
                  padding: "8px 14px", borderRadius: 999,
                  fontSize: 13, color: "var(--islamiva-fg-soft)",
                  background: isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.03)",
                  border: "1px solid var(--islamiva-line)",
                  cursor: "pointer",
                }}
              >
                {chip}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stats strip */}
        <div
          style={{
            display: "flex", flexWrap: "wrap",
            alignItems: "center", justifyContent: "center",
            gap: 40, marginTop: 80,
            color: "var(--islamiva-fg-dim)",
          }}
        >
          {stats.map((s) => (
            <div key={s.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <span
                style={{
                  fontFamily: "'Geist', sans-serif",
                  fontSize: 22, fontWeight: 500,
                  letterSpacing: "-0.02em",
                  color: "var(--islamiva-fg-soft)",
                }}
              >
                {s.num}
                {s.plus && (
                  <em
                    style={{
                      fontFamily: "'Instrument Serif', serif",
                      fontStyle: "italic",
                      color: "var(--islamiva-gold)",
                    }}
                  >
                    +
                  </em>
                )}
              </span>
              <span
                style={{
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: 11, letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: "var(--islamiva-fg-dim)",
                }}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

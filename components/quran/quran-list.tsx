"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, BookOpen } from "lucide-react";
import { useTheme } from "next-themes";
import { SURAH_LIST } from "@/data/quran-data";
import { useQuranProgress } from "@/hooks/use-quran-progress";

type Filter = "all" | "Meccan" | "Medinan";

export function QuranList() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const isLight = mounted && theme === "light";
  const { getProgress, lastRead } = useQuranProgress();
  useEffect(() => { setMounted(true); }, []);

  const filtered = useMemo(() => {
    return SURAH_LIST.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.nameTranslation.toLowerCase().includes(search.toLowerCase()) ||
        s.number.toString().includes(search);
      const matchFilter = filter === "all" || s.revelationType === filter;
      return matchSearch && matchFilter;
    });
  }, [search, filter]);

  return (
    <div style={{ backgroundColor: "var(--islamiva-bg)", minHeight: "100vh" }}>
      {/* Hero */}
      <section
        style={{
          position: "relative",
          padding: "clamp(80px, 12vw, 140px) 28px clamp(60px, 8vw, 100px)",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            height: 300,
            background: "radial-gradient(ellipse, oklch(0.62 0.13 155 / 0.12), transparent 70%)",
            filter: "blur(40px)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", maxWidth: 700, margin: "0 auto" }}>
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              borderRadius: 9999,
              background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.03)",
              border: "1px solid var(--islamiva-line)",
              color: "var(--islamiva-fg-soft)",
              fontSize: 11,
              fontWeight: 500,
              fontFamily: "'Geist Mono', monospace",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            <span
              style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--islamiva-emerald)", flexShrink: 0 }}
            />
            114 Surah · 6.236 Ayat
          </motion.span>

          {/* Large Arabic heading */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.03 }}
            className="font-arabic"
            lang="ar"
            dir="rtl"
            style={{
              fontSize: "clamp(32px, 5vw, 52px)",
              color: "var(--islamiva-gold-soft)",
              lineHeight: 1.6,
              marginBottom: 12,
              opacity: 0.85,
            }}
          >
            القرآن الكريم
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.07 }}
            style={{
              fontFamily: "'Geist', sans-serif",
              fontWeight: 500,
              fontSize: "clamp(32px, 4.5vw, 58px)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "var(--islamiva-fg)",
              marginBottom: 20,
            }}
          >
            Al-Quran{" "}
            <em
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                fontWeight: 400,
                color: "var(--islamiva-emerald-soft)",
              }}
            >
              Al-Karim
            </em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            style={{
              fontSize: "clamp(15px, 1.8vw, 18px)",
              color: "var(--islamiva-fg-mute)",
              lineHeight: 1.65,
              maxWidth: 480,
              margin: "0 auto",
            }}
          >
            Baca Al-Quran dengan terjemahan bahasa Indonesia dan audio murottal Mishary al-Afasy.
          </motion.p>
        </div>
      </section>

      <div
        style={{
          height: 1,
          background: "linear-gradient(90deg, transparent, var(--islamiva-line-strong), transparent)",
        }}
      />

      {/* Content */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "clamp(48px, 7vw, 80px) 28px" }}>
        {/* Search & Filters */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            marginBottom: 32,
          }}
        >
          {/* Search */}
          <div style={{ position: "relative" }}>
            <Search
              size={15}
              style={{
                position: "absolute",
                left: 14,
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--islamiva-fg-dim)",
                pointerEvents: "none",
              }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama surah atau terjemahan..."
              style={{
                width: "100%",
                padding: "12px 14px 12px 40px",
                borderRadius: 12,
                background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.03)",
                border: "1px solid var(--islamiva-line)",
                color: "var(--islamiva-fg)",
                fontSize: 14,
                fontFamily: "'Geist', sans-serif",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "oklch(0.62 0.13 155 / 0.5)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--islamiva-line)";
              }}
            />
          </div>

          {/* Filter buttons */}
          <div style={{ display: "flex", gap: 8 }}>
            {(["all", "Meccan", "Medinan"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: "7px 16px",
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: 500,
                  fontFamily: "'Geist', sans-serif",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  ...(filter === f
                    ? {
                        background:
                          "linear-gradient(180deg, oklch(0.7 0.13 155) 0%, oklch(0.55 0.12 155) 100%)",
                        color: "#08110b",
                        border: "1px solid transparent",
                        boxShadow:
                          "inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 12px -4px oklch(0.62 0.13 155 / 0.4)",
                      }
                    : {
                        background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.03)",
                        border: "1px solid var(--islamiva-line)",
                        color: "var(--islamiva-fg-mute)",
                      }),
                }}
              >
                {f === "all" ? "Semua" : f === "Meccan" ? "Makkiyah" : "Madaniyah"}
              </button>
            ))}
            {search || filter !== "all" ? (
              <span
                style={{
                  padding: "7px 12px",
                  fontSize: 11,
                  color: "var(--islamiva-fg-dim)",
                  fontFamily: "'Geist Mono', monospace",
                  alignSelf: "center",
                }}
              >
                {filtered.length} surah
              </span>
            ) : null}
          </div>
        </div>

        {/* Last read banner */}
        {lastRead && (
          <Link
            href={`/quran/${lastRead.surahNumber}`}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 18px",
              borderRadius: 12,
              background: "oklch(0.82 0.08 80 / 0.08)",
              border: "1px solid oklch(0.82 0.08 80 / 0.2)",
              marginBottom: 20,
              textDecoration: "none",
            }}
          >
            <div>
              <p style={{ fontSize: 11, color: "var(--islamiva-gold)", fontFamily: "'Geist Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 2 }}>
                Lanjutkan membaca
              </p>
              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--islamiva-fg-soft)", fontFamily: "'Geist', sans-serif" }}>
                {lastRead.surahName} · Ayat {lastRead.lastAyah}
              </p>
            </div>
            <span style={{ fontSize: 18 }}>📖</span>
          </Link>
        )}

        {/* Surah list */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: 10,
          }}
        >
          {filtered.map((surah, i) => (
            <motion.div
              key={surah.number}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.012, 0.3) }}
            >
              <Link href={`/quran/${surah.number}`} className="block group">
                <div
                  className="transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 16px",
                    borderRadius: 14,
                    background:
                      isLight ? "var(--islamiva-bg-1)" : "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.005)), var(--islamiva-bg-1)",
                    border: "1px solid var(--islamiva-line)",
                  }}
                >
                  {/* Number */}
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: "oklch(0.62 0.13 155 / 0.12)",
                      border: "1px solid oklch(0.62 0.13 155 / 0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      transition: "background 0.2s",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        fontFamily: "'Geist Mono', monospace",
                        color: "oklch(0.85 0.1 155)",
                      }}
                    >
                      {surah.number}
                    </span>
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                      <h3
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "var(--islamiva-fg-soft)",
                          fontFamily: "'Geist', sans-serif",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {surah.name}
                      </h3>
                      <span
                        style={{
                          fontSize: 10,
                          padding: "2px 7px",
                          borderRadius: 999,
                          fontFamily: "'Geist Mono', monospace",
                          letterSpacing: "0.03em",
                          ...(surah.revelationType === "Meccan"
                            ? {
                                background: "oklch(0.62 0.13 155 / 0.1)",
                                border: "1px solid oklch(0.62 0.13 155 / 0.2)",
                                color: "oklch(0.85 0.1 155)",
                              }
                            : {
                                background: "oklch(0.82 0.08 80 / 0.1)",
                                border: "1px solid oklch(0.82 0.08 80 / 0.2)",
                                color: "var(--islamiva-gold-soft)",
                              }),
                        }}
                      >
                        {surah.revelationType === "Meccan" ? "Makkiyah" : "Madaniyah"}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: 11,
                        color: "var(--islamiva-fg-dim)",
                        fontFamily: "'Geist Mono', monospace",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {surah.nameTranslation} · {surah.numberOfAyahs} ayat
                    </p>
                  </div>

                  {/* Progress bar */}
                  {(() => {
                    const p = getProgress(surah.number);
                    if (!p) return null;
                    const pct = Math.round((p.lastAyah / p.totalAyahs) * 100);
                    return (
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ height: 2, borderRadius: 999, background: "var(--islamiva-line)", overflow: "hidden", marginTop: 6 }}>
                          <div style={{ height: "100%", width: `${pct}%`, borderRadius: 999, background: "oklch(0.62 0.13 155 / 0.6)", transition: "width 0.3s" }} />
                        </div>
                      </div>
                    );
                  })()}

                  {/* Arabic name */}
                  <p
                    className="font-arabic"
                    lang="ar"
                    dir="rtl"
                    style={{
                      fontSize: 20,
                      color: "var(--islamiva-emerald-soft)",
                      lineHeight: 1.5,
                      flexShrink: 0,
                      opacity: 0.85,
                    }}
                  >
                    {surah.nameArabic}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <BookOpen
              size={40}
              style={{ color: "var(--islamiva-fg-dim)", margin: "0 auto 12px", opacity: 0.4 }}
            />
            <p style={{ color: "var(--islamiva-fg-mute)", fontSize: 14 }}>
              Surah tidak ditemukan
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

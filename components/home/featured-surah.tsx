"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, ArrowRight } from "lucide-react";
import { FEATURED_SURAHS } from "@/data/quran-data";
import { useLang } from "@/contexts/language-context";
import { translations } from "@/lib/translations";

export function FeaturedSurah() {
  const { lang } = useLang();
  const ts = translations[lang].featuredSurah;
  return (
    <section
      className="relative"
      style={{
        backgroundColor: "var(--islametra-bg-1)",
        padding: "clamp(80px, 12vw, 160px) 0",
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--islametra-line-strong), transparent)",
        }}
      />

      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 28px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 48 }}>
          <div>
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              style={{
                fontFamily: "'Geist Mono', monospace",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                background: "rgba(255,255,255,0.03)",
                border: "1px solid var(--islametra-line)",
                color: "var(--islametra-fg-soft)",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 12px",
                borderRadius: 9999,
                fontSize: 11,
                fontWeight: 500,
                marginBottom: 16,
              }}
            >
              <span
                style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--islametra-emerald)", flexShrink: 0 }}
              />
              {ts.badge}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              style={{
                fontFamily: "'Geist', sans-serif",
                fontWeight: 500,
                fontSize: "clamp(28px, 3.6vw, 46px)",
                lineHeight: 1.05,
                letterSpacing: "-0.03em",
                color: "var(--islametra-fg)",
              }}
            >
              {ts.title}
            </motion.h2>
          </div>
          <Link
            href="/quran"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium transition-colors group"
            style={{ color: "var(--islametra-fg-mute)", fontFamily: "'Geist', sans-serif" }}
          >
            {ts.allLink}
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {FEATURED_SURAHS.map((surah, i) => (
            <motion.div
              key={surah.number}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.05, duration: 0.35 }}
            >
              <Link href={`/quran/${surah.number}`} className="block group">
                <div
                  className="relative transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    padding: 16,
                    borderRadius: 16,
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005)), var(--islametra-bg-2)",
                    border: "1px solid var(--islametra-line)",
                  }}
                >
                  {/* Number + type */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 30,
                        height: 30,
                        borderRadius: 8,
                        background: "oklch(0.62 0.13 155 / 0.15)",
                        border: "1px solid oklch(0.62 0.13 155 / 0.25)",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11, fontWeight: 700,
                          fontFamily: "'Geist Mono', monospace",
                          color: "oklch(0.85 0.1 155)",
                        }}
                      >
                        {surah.number}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: 10,
                        padding: "2px 7px", borderRadius: 999,
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid var(--islametra-line)",
                        color: "var(--islametra-fg-dim)",
                        fontFamily: "'Geist Mono', monospace",
                        letterSpacing: "0.03em",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {surah.revelationType === "Meccan" ? ts.meccan : ts.medinan}
                    </span>
                  </div>

                  {/* Arabic */}
                  <p
                    className="font-arabic"
                    style={{
                      marginBottom: 4,
                      textAlign: "right",
                      fontSize: 20, lineHeight: 1.8,
                      color: "var(--islametra-emerald-soft)",
                    }}
                  >
                    {surah.nameArabic}
                  </p>

                  {/* Latin */}
                  <h3
                    style={{
                      fontSize: 13, fontWeight: 500,
                      color: "var(--islametra-fg-soft)",
                      letterSpacing: "-0.01em",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {surah.name}
                  </h3>
                  <p
                    style={{
                      fontSize: 11,
                      color: "var(--islametra-fg-dim)",
                      marginTop: 2,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {surah.nameTranslation}
                  </p>

                  {/* Verse count */}
                  <div
                    className="flex items-center gap-1.5 mt-3 pt-2.5"
                    style={{ borderTop: "1px solid var(--islametra-line)" }}
                  >
                    <BookOpen size={11} style={{ color: "var(--islametra-fg-dim)" }} />
                    <span
                      style={{
                        fontSize: 11,
                        color: "var(--islametra-fg-dim)",
                        fontFamily: "'Geist Mono', monospace",
                      }}
                    >
                      {surah.numberOfAyahs} {ts.verses}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

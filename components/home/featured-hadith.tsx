"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { FEATURED_HADITHS } from "@/data/hadith-data";
import { useLang } from "@/contexts/language-context";
import { translations } from "@/lib/translations";

export function FeaturedHadith() {
  const { lang } = useLang();
  const th = translations[lang].featuredHadith;
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
                style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--islametra-gold)", flexShrink: 0 }}
              />
              {th.badge}
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
              {th.title}{" "}
              <em
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                  color: "var(--islametra-gold)",
                }}
              >
                {th.titleEm}
              </em>
            </motion.h2>
          </div>
          <Link
            href="/hadith"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium transition-colors group"
            style={{ color: "var(--islametra-fg-mute)", fontFamily: "'Geist', sans-serif" }}
          >
            {th.allLink}
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURED_HADITHS.map((hadith, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <Link href="/hadith" className="block h-full group">
                <div
                  className="relative h-full flex flex-col transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
                  style={{
                    padding: 24,
                    minHeight: 240,
                    borderRadius: 20,
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005)), var(--islametra-bg-2)",
                    border: "1px solid var(--islametra-line)",
                  }}
                >
                  {/* Shimmer border */}
                  <div
                    className="absolute inset-0 pointer-events-none rounded-[20px]"
                    style={{
                      padding: 1,
                      background: "linear-gradient(180deg, rgba(255,255,255,0.07), transparent 30%)",
                      WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude",
                    }}
                  />

                  {/* Gold hover glow */}
                  <div
                    className="absolute pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      width: 200, height: 200,
                      right: -60, top: -60,
                      background:
                        "radial-gradient(circle, oklch(0.82 0.08 80 / 0.12), transparent 70%)",
                      filter: "blur(20px)",
                    }}
                  />

                  {/* Source */}
                  <div className="flex items-center gap-2 mb-5 relative z-10">
                    <span
                      style={{
                        padding: "4px 10px", borderRadius: 6,
                        fontFamily: "'Geist Mono', monospace",
                        fontSize: 11, letterSpacing: "0.04em",
                        background: "oklch(0.82 0.08 80 / 0.12)",
                        border: "1px solid oklch(0.82 0.08 80 / 0.2)",
                        color: "var(--islametra-gold-soft)",
                      }}
                    >
                      HR. {hadith.kitab}
                    </span>
                    <span
                      style={{
                        marginLeft: "auto",
                        fontFamily: "'Geist Mono', monospace",
                        fontSize: 11,
                        color: "var(--islametra-fg-dim)",
                      }}
                    >
                      No. {hadith.number}
                    </span>
                  </div>

                  {/* Arabic */}
                  <div
                    style={{
                      padding: "14px 16px",
                      borderRadius: 12,
                      background:
                        "linear-gradient(180deg, oklch(0.82 0.08 80 / 0.06), transparent)",
                      border: "1px solid oklch(0.82 0.08 80 / 0.12)",
                      marginBottom: 16,
                    }}
                    className="relative z-10"
                  >
                    <p
                      className="font-arabic"
                      lang="ar" dir="rtl"
                      style={{
                        fontSize: 18, lineHeight: 1.9,
                        color: "var(--islametra-gold-soft)",
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {hadith.arab}
                    </p>
                  </div>

                  {/* Translation */}
                  <p
                    className="flex-1 relative z-10"
                    style={{
                      fontSize: 13.5, lineHeight: 1.6,
                      color: "var(--islametra-fg-mute)",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {hadith.id_text}
                  </p>

                  {/* Footer */}
                  <div
                    className="flex items-center justify-between mt-5 pt-4 relative z-10"
                    style={{ borderTop: "1px dashed var(--islametra-line)" }}
                  >
                    <span
                      style={{
                        fontFamily: "'Geist Mono', monospace",
                        fontSize: 11, color: "var(--islametra-fg-dim)",
                        letterSpacing: "0.03em",
                      }}
                    >
                      {th.readMore}
                    </span>
                    <ArrowUpRight
                      size={14}
                      className="transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      style={{ color: "var(--islametra-fg-mute)" }}
                    />
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

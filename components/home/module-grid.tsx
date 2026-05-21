"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Heart, Scroll, Star, History, MessageCircle, ArrowUpRight, Clock, Beaker, Calendar } from "lucide-react";
import { useLang } from "@/contexts/language-context";
import { translations } from "@/lib/translations";

const MODULE_HREFS = ["/quran", "/doa", "/hadith", "/kisah-nabi", "/sejarah", "/jadwal-sholat", "/tasbih", "/kalender", "/ai-chat"];
const MODULE_ICONS = [BookOpen, Heart, Scroll, Star, History, Clock, Beaker, Calendar, MessageCircle];
type ModuleTone = "emerald" | "gold" | null;
const MODULE_TONES: ModuleTone[] = [null, null, null, null, null, null, null, null, "gold"];
const MODULE_FEATURED = [false, false, false, false, false, false, false, false, false];

export function ModuleGrid() {
  const { lang } = useLang();
  const tm = translations[lang].moduleGrid;

  return (
    <section
      id="features"
      className="relative"
      style={{
        backgroundColor: "var(--islametra-bg)",
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
        <div className="islametra-feat-head" style={{ marginBottom: 64 }}>
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
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
                marginBottom: 20,
              }}
            >
              <span
                style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--islametra-emerald)", flexShrink: 0 }}
              />
              {tm.badge}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              style={{
                fontFamily: "'Geist', sans-serif",
                fontWeight: 500,
                fontSize: "clamp(34px, 4.6vw, 56px)",
                lineHeight: 1.02,
                letterSpacing: "-0.03em",
                color: "var(--islametra-fg)",
                marginTop: 14,
              }}
            >
              {tm.title1}{" "}
              <em
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                  color: "var(--islametra-gold)",
                  letterSpacing: "-0.005em",
                }}
              >
                {tm.titleEm}
              </em>
              <br />
              {tm.title2}
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="hidden md:block"
            style={{
              fontSize: "clamp(16px, 1.4vw, 19px)",
              lineHeight: 1.55,
              color: "var(--islametra-fg-mute)",
              maxWidth: "36ch",
            }}
          >
            {tm.sub}
          </motion.p>
        </div>

        {/* Grid */}
        <div className="islametra-module-grid">
          {tm.modules.map((mod, i) => {
            const Icon = MODULE_ICONS[i];
            const tone = MODULE_TONES[i];
            const isEmerald = tone === "emerald";
            const isGold = tone === "gold";
            return (
              <motion.div
                key={MODULE_HREFS[i]}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
              >
                <Link href={MODULE_HREFS[i]} className="block h-full group">
                  <div
                    className="relative"
                    style={{
                      display: "flex", flexDirection: "column",
                      height: "100%", overflow: "hidden",
                      padding: 28,
                      minHeight: 240,
                      borderRadius: 22,
                      background: isEmerald
                        ? `radial-gradient(ellipse 100% 60% at 100% 0%, oklch(0.62 0.13 155 / 0.12), transparent 60%), linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005)), var(--islametra-bg-1)`
                        : "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005)), var(--islametra-bg-1)",
                      border: "1px solid var(--islametra-line)",
                      transition: "transform 0.25s ease, border-color 0.25s ease",
                    }}
                  >
                    <div
                      className="absolute inset-0 pointer-events-none rounded-[22px]"
                      style={{
                        padding: 1,
                        background: "linear-gradient(180deg, rgba(255,255,255,0.07), transparent 30%)",
                        WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                        WebkitMaskComposite: "xor",
                        maskComposite: "exclude",
                      }}
                    />
                    <div
                      className="absolute pointer-events-none transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                      style={{
                        width: 240, height: 240,
                        right: -80, top: -80,
                        background: isGold
                          ? "radial-gradient(circle, oklch(0.82 0.08 80 / 0.14), transparent 70%)"
                          : "radial-gradient(circle, oklch(0.62 0.13 155 / 0.12) 0%, transparent 70%)",
                        filter: "blur(20px)",
                        zIndex: 0,
                      }}
                    />
                    <div
                      className="relative z-10"
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "center",
                        marginBottom: 20,
                        width: 44, height: 44,
                        borderRadius: 12,
                        background: isEmerald
                          ? "linear-gradient(180deg, oklch(0.7 0.13 155 / 0.3), oklch(0.5 0.12 155 / 0.15))"
                          : isGold
                          ? "linear-gradient(180deg, oklch(0.82 0.08 80 / 0.25), oklch(0.6 0.08 80 / 0.1))"
                          : "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                        border: isEmerald
                          ? "1px solid oklch(0.62 0.13 155 / 0.3)"
                          : isGold
                          ? "1px solid oklch(0.82 0.08 80 / 0.25)"
                          : "1px solid var(--islametra-line)",
                        color: isEmerald
                          ? "oklch(0.85 0.1 155)"
                          : isGold
                          ? "var(--islametra-gold-soft)"
                          : "var(--islametra-fg)",
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={20} />
                    </div>
                    <div
                      className="relative z-10"
                      style={{
                        fontSize: 20, fontWeight: 500,
                        letterSpacing: "-0.02em",
                        color: "var(--islametra-fg)",
                        marginBottom: 8,
                      }}
                    >
                      {mod.title}
                    </div>
                    <div
                      className="relative z-10 flex-1"
                      style={{ fontSize: 14, color: "var(--islametra-fg-mute)", lineHeight: 1.55 }}
                    >
                      {mod.desc}
                    </div>
                    <div
                      className="relative z-10"
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        marginTop: 20, paddingTop: 16,
                        fontFamily: "'Geist Mono', monospace",
                        fontSize: 11,
                        color: "var(--islametra-fg-dim)",
                        letterSpacing: "0.03em",
                        borderTop: "1px dashed var(--islametra-line)",
                      }}
                    >
                      <span>{mod.meta}</span>
                      <ArrowUpRight
                        size={14}
                        className="transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        style={{ color: "var(--islametra-fg-mute)" }}
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

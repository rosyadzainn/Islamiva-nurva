"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";
import { useLang } from "@/contexts/language-context";
import { translations } from "@/lib/translations";

const TIMELINE_COLORS = [
  "oklch(0.62 0.13 155)",
  "oklch(0.62 0.13 155)",
  "oklch(0.82 0.08 80)",
  "oklch(0.82 0.08 80)",
  "oklch(0.82 0.08 80)",
  "oklch(0.68 0.15 30)",
  "oklch(0.68 0.15 30)",
];

const CATEGORY_STYLES = [
  { icon: "👑", iconBg: "oklch(0.62 0.13 155 / 0.12)", iconBorder: "1px solid oklch(0.62 0.13 155 / 0.2)", glowColor: "oklch(0.62 0.13 155 / 0.06)" },
  { icon: "🏰", iconBg: "oklch(0.82 0.08 80 / 0.12)", iconBorder: "1px solid oklch(0.82 0.08 80 / 0.2)", glowColor: "oklch(0.82 0.08 80 / 0.06)" },
  { icon: "📚", iconBg: "oklch(0.7 0.1 240 / 0.12)", iconBorder: "1px solid oklch(0.7 0.1 240 / 0.2)", glowColor: "oklch(0.7 0.1 240 / 0.06)" },
  { icon: "🌍", iconBg: "oklch(0.75 0.1 310 / 0.12)", iconBorder: "1px solid oklch(0.75 0.1 310 / 0.2)", glowColor: "oklch(0.75 0.1 310 / 0.06)" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number], delay: i },
  }),
};

const cardVariants = {
  hidden: { opacity: 0, y: 14 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number],
      delay: Math.min(i * 0.08, 0.36),
    },
  }),
};

export function SejarahList() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const isLight = mounted && theme === "light";
  const { lang } = useLang();
  const ts = translations[lang].sejarahList;
  useEffect(() => { setMounted(true); }, []);

  return (
    <div style={{ backgroundColor: "var(--islametra-bg)", minHeight: "100vh" }}>
      {/* ── Hero ── */}
      <section
        style={{
          position: "relative",
          padding: "clamp(80px, 12vw, 140px) 28px clamp(60px, 8vw, 100px)",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        {/* Emerald glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            height: 300,
            background: "radial-gradient(ellipse, oklch(0.62 0.13 155 / 0.1), transparent 70%)",
            filter: "blur(40px)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", maxWidth: 700, margin: "0 auto" }}>
          {/* Badge */}
          <motion.span
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              borderRadius: 9999,
              background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.03)",
              border: "1px solid var(--islametra-line)",
              color: "var(--islametra-fg-soft)",
              fontSize: 11,
              fontWeight: 500,
              fontFamily: "'Geist Mono', monospace",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--islametra-emerald)",
                flexShrink: 0,
              }}
            />
            {ts.badge}
          </motion.span>

          {/* Heading */}
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.06}
            style={{
              fontFamily: "'Geist', sans-serif",
              fontWeight: 500,
              fontSize: "clamp(36px, 5vw, 64px)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "var(--islametra-fg)",
              marginBottom: 20,
            }}
          >
            Sejarah{" "}
            <em
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                fontWeight: 400,
                color: "var(--islametra-emerald-soft)",
              }}
            >
              {ts.titleEm}
            </em>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.12}
            style={{
              fontSize: "clamp(15px, 1.8vw, 18px)",
              color: "var(--islametra-fg-mute)",
              lineHeight: 1.65,
              maxWidth: 540,
              margin: "0 auto",
            }}
          >
            {ts.sub}
          </motion.p>
        </div>
      </section>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background:
            "linear-gradient(90deg, transparent, var(--islametra-line-strong), transparent)",
        }}
      />

      <div
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "clamp(60px, 8vw, 100px) 28px",
        }}
      >
        {/* ── Timeline ── */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1], delay: 0.18 }}
          style={{
            marginBottom: 48,
            padding: "28px 32px",
            borderRadius: 20,
            background:
              isLight ? "var(--islametra-bg-1)" : "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005)), var(--islametra-bg-1)",
            border: "1px solid var(--islametra-line-strong)",
            overflow: "hidden",
            boxShadow: "0 20px 60px -20px rgba(0,0,0,0.4)",
          }}
        >
          <p
            style={{
              fontSize: 11,
              fontFamily: "'Geist Mono', monospace",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--islametra-fg-dim)",
              marginBottom: 24,
            }}
          >
            {ts.timelineLabel}
          </p>
          <div className="scrollbar-hide" style={{ overflowX: "auto" }}>
            <div style={{ minWidth: 560, position: "relative" }}>
              {/* Timeline line */}
              <div
                style={{
                  position: "absolute",
                  top: 12,
                  left: 0,
                  right: 0,
                  height: 1,
                  background:
                    "linear-gradient(90deg, oklch(0.62 0.13 155), oklch(0.82 0.08 80) 60%, oklch(0.68 0.15 30))",
                  opacity: 0.6,
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  position: "relative",
                }}
              >
                {ts.timeline.map((item, i) => (
                  <motion.div
                    key={item.year}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.35,
                      ease: [0.2, 0.8, 0.2, 1],
                      delay: 0.22 + i * 0.055,
                    }}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 10,
                    }}
                  >
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: TIMELINE_COLORS[i],
                        border: "2px solid var(--islametra-bg-1)",
                        boxShadow: `0 0 8px ${TIMELINE_COLORS[i]}`,
                        zIndex: 1,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        fontFamily: "'Geist Mono', monospace",
                        color: "var(--islametra-fg-soft)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.year}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        color: "var(--islametra-fg-dim)",
                        textAlign: "center",
                        maxWidth: 50,
                        lineHeight: 1.3,
                      }}
                    >
                      {item.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Categories grid ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 500px), 1fr))",
            gap: 20,
          }}
        >
          {ts.categories.map((cat, i) => {
            const style = CATEGORY_STYLES[i];
            return (
            <motion.div
              key={cat.id}
              variants={cardVariants}
              initial="hidden"
              animate="show"
              custom={i}
            >
              <div
                style={{
                  padding: 28,
                  borderRadius: 20,
                  background:
                    isLight ? "var(--islametra-bg-1)" : "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005)), var(--islametra-bg-1)",
                  border: "1px solid var(--islametra-line)",
                  position: "relative",
                  overflow: "hidden",
                  height: "100%",
                }}
              >
                {/* Shimmer border */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    borderRadius: 20,
                    padding: 1,
                    background:
                      isLight ? "linear-gradient(180deg, rgba(0,0,0,0.05), transparent 30%)" : "linear-gradient(180deg, rgba(255,255,255,0.06), transparent 30%)",
                    WebkitMask:
                      "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                    pointerEvents: "none",
                  }}
                />

                {/* Accent glow */}
                <div
                  style={{
                    position: "absolute",
                    top: -40,
                    left: -40,
                    width: 180,
                    height: 180,
                    background: `radial-gradient(circle, ${style.glowColor}, transparent 70%)`,
                    pointerEvents: "none",
                  }}
                />

                {/* Card header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 14,
                    marginBottom: 12,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: style.iconBg,
                      border: style.iconBorder,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 20,
                      flexShrink: 0,
                    }}
                  >
                    {style.icon}
                  </div>
                  <div>
                    <h2
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        fontFamily: "'Geist', sans-serif",
                        color: "var(--islametra-fg)",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {cat.title}
                    </h2>
                    <span
                      style={{
                        fontSize: 10,
                        fontFamily: "'Geist Mono', monospace",
                        color: "var(--islametra-fg-dim)",
                        letterSpacing: "0.03em",
                      }}
                    >
                      {cat.period}
                    </span>
                  </div>
                </div>

                <p
                  style={{
                    fontSize: 13.5,
                    color: "var(--islametra-fg-mute)",
                    lineHeight: 1.6,
                    marginBottom: 20,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {cat.description}
                </p>

                {/* Article links */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  {cat.articles.map((article, j) => (
                    <motion.div
                      key={article.slug}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        ease: [0.2, 0.8, 0.2, 1],
                        delay: Math.min(i * 0.08, 0.36) + j * 0.04 + 0.12,
                      }}
                    >
                      <Link
                        href={`/sejarah/${article.slug}`}
                        className="group transition-all duration-200 hover:bg-white/5"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          padding: "10px 14px",
                          borderRadius: 10,
                          background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.03)",
                          border: "1px solid var(--islametra-line)",
                        }}
                      >
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: 500,
                            color: "var(--islametra-fg-soft)",
                          }}
                        >
                          {article.title}
                        </span>
                        <ArrowRight
                          size={13}
                          style={{ color: "var(--islametra-fg-dim)", flexShrink: 0 }}
                          className="transition-transform duration-200 group-hover:translate-x-1"
                        />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

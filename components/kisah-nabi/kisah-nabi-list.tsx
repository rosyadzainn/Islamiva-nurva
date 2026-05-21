"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Star } from "lucide-react";
import { useTheme } from "next-themes";
import { PROPHETS } from "@/data/prophet-stories";
import { useLang } from "@/contexts/language-context";
import { translations } from "@/lib/translations";

const ARABIC_NAMES: Record<string, string> = {
  adam: "آدَم",
  idris: "إِدْرِيس",
  nuh: "نُوح",
  hud: "هُود",
  shaleh: "صَالِح",
  luth: "لُوط",
  ibrahim: "إِبْرَاهِيم",
  ismail: "إِسْمَاعِيل",
  ishaq: "إِسْحَاق",
  yaqub: "يَعْقُوب",
  yusuf: "يُوسُف",
  ayyub: "أَيُّوب",
  syuaib: "شُعَيْب",
  musa: "مُوسَى",
  harun: "هَارُون",
  dzulkifli: "ذُو الكِفْل",
  dawud: "دَاوُد",
  sulaiman: "سُلَيْمَان",
  ilyas: "إِلْيَاس",
  ilyasa: "اليَسَع",
  yunus: "يُونُس",
  zakaria: "زَكَرِيَّا",
  yahya: "يَحْيَى",
  isa: "عِيسَى",
  muhammad: "مُحَمَّد",
};

const fadeUp = {
  hidden: { opacity: 0, y: 10 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number], delay: i },
  }),
};

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.38,
      ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number],
      delay: Math.min(i * 0.055, 0.4),
    },
  }),
};

export function KisahNabiList() {
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const isLight = mounted && theme === "light";
  const { lang } = useLang();
  const tkn = translations[lang].kisahNabiList;
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
        {/* Gold radial glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            height: 300,
            background: "radial-gradient(ellipse, oklch(0.82 0.08 80 / 0.12), transparent 70%)",
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
                background: "var(--islametra-gold)",
                flexShrink: 0,
              }}
            />
            {tkn.badge}
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
            {tkn.title}{" "}
            <em
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                fontWeight: 400,
                color: "var(--islametra-gold)",
              }}
            >
              {tkn.titleEm}
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
              maxWidth: 520,
              margin: "0 auto",
            }}
          >
            {tkn.sub}
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

      {/* ── Cards grid ── */}
      <section
        style={{
          maxWidth: 1240,
          margin: "0 auto",
          padding: "clamp(60px, 8vw, 100px) 28px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 16,
          }}
        >
          {PROPHETS.map((prophet, i) => {
            const arabicName = ARABIC_NAMES[prophet.slug] ?? "";
            return (
              <motion.div
                key={prophet.id}
                variants={cardVariants}
                initial="hidden"
                animate="show"
                custom={i}
              >
                <Link href={`/kisah-nabi/${prophet.slug}`} className="block group">
                  <div
                    className="transition-all duration-300 hover:-translate-y-1"
                    style={{
                      position: "relative",
                      padding: 28,
                      borderRadius: 20,
                      background:
                        isLight ? "var(--islametra-bg-1)" : "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005)), var(--islametra-bg-1)",
                      border: "1px solid var(--islametra-line)",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      overflow: "hidden",
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
                          isLight ? "linear-gradient(180deg, rgba(0,0,0,0.05), transparent 30%)" : "linear-gradient(180deg, rgba(255,255,255,0.07), transparent 30%)",
                        WebkitMask:
                          "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                        WebkitMaskComposite: "xor",
                        maskComposite: "exclude",
                        pointerEvents: "none",
                      }}
                    />

                    {/* Gold glow on hover */}
                    <div
                      className="absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{
                        width: 200,
                        height: 200,
                        right: -60,
                        top: -60,
                        background:
                          "radial-gradient(circle, oklch(0.82 0.08 80 / 0.1), transparent 70%)",
                        filter: "blur(20px)",
                      }}
                    />

                    {/* Order badge + Arabic name */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 20,
                        position: "relative",
                        zIndex: 1,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 32,
                          height: 32,
                          borderRadius: 9,
                          background: "oklch(0.62 0.13 155 / 0.15)",
                          border: "1px solid oklch(0.62 0.13 155 / 0.25)",
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
                          {prophet.order}
                        </span>
                      </div>
                      {arabicName && (
                        <p
                          className="font-arabic"
                          lang="ar"
                          dir="rtl"
                          style={{
                            fontSize: 22,
                            color: "var(--islametra-gold-soft)",
                            lineHeight: 1.5,
                          }}
                        >
                          {arabicName}
                        </p>
                      )}
                    </div>

                    {/* Prophet name */}
                    <h2
                      style={{
                        fontSize: 18,
                        fontWeight: 600,
                        fontFamily: "'Geist', sans-serif",
                        color: "var(--islametra-fg)",
                        letterSpacing: "-0.01em",
                        marginBottom: 4,
                        position: "relative",
                        zIndex: 1,
                      }}
                    >
                      {prophet.prophetName}
                    </h2>
                    <p
                      style={{
                        fontSize: 11,
                        color: "var(--islametra-fg-dim)",
                        fontFamily: "'Geist Mono', monospace",
                        letterSpacing: "0.03em",
                        marginBottom: 14,
                        position: "relative",
                        zIndex: 1,
                      }}
                    >
                      {prophet.title}
                    </p>

                    {/* Excerpt */}
                    <p
                      style={{
                        fontSize: 13.5,
                        lineHeight: 1.65,
                        color: "var(--islametra-fg-mute)",
                        flex: 1,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        position: "relative",
                        zIndex: 1,
                      }}
                    >
                      {prophet.excerpt}
                    </p>

                    {/* Footer row */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: 20,
                        paddingTop: 16,
                        borderTop: "1px dashed var(--islametra-line)",
                        position: "relative",
                        zIndex: 1,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          color: "var(--islametra-fg-dim)",
                          fontFamily: "'Geist Mono', monospace",
                          letterSpacing: "0.03em",
                        }}
                      >
                        {tkn.readFull}
                      </span>
                      <ArrowUpRight
                        size={14}
                        style={{ color: "var(--islametra-fg-mute)" }}
                        className="transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

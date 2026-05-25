"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Plus, Mic, Send } from "lucide-react";
import { useLang } from "@/contexts/language-context";
import { translations } from "@/lib/translations";

const SparkleIcon = ({ size = 11 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5L12 2Z" />
  </svg>
);

const IslametraLogo = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <text x="4" y="18" fontSize="18" fontFamily="'Amiri', serif">ن</text>
  </svg>
);

export function AiChatPreview() {
  const [showTyping, setShowTyping] = useState(true);
  const { lang } = useLang();
  const ta = translations[lang].aiChatPreview;

  useEffect(() => {
    const t = setTimeout(() => setShowTyping(false), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      id="chat"
      className="relative overflow-hidden"
      style={{
        backgroundColor: "var(--islametra-bg)",
        padding: "clamp(80px, 12vw, 160px) 0",
      }}
    >
      {/* Section top divider */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--islametra-line-strong), transparent)",
        }}
      />

      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 50% 50%, oklch(0.62 0.13 155 / 0.14), transparent 60%)",
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.022) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 60% at 50% 50%, #000, transparent 75%)",
          maskImage:
            "radial-gradient(ellipse 60% 60% at 50% 50%, #000, transparent 75%)",
        }}
      />

      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 28px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
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
            <SparkleIcon size={11} />
            {ta.badge}
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
              marginBottom: 14,
              maxWidth: 820,
              marginInline: "auto",
            }}
          >
            {ta.title1}{" "}
            <em
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                fontWeight: 400,
                color: "var(--islametra-gold)",
              }}
            >
              {ta.titleEm}
            </em>
            .
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            style={{
              fontSize: "clamp(16px, 1.4vw, 19px)",
              lineHeight: 1.55,
              color: "var(--islametra-fg-mute)",
              maxWidth: "60ch",
              margin: "0 auto",
            }}
          >
            {ta.sub}
          </motion.p>
        </div>

        {/* Chat window */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="relative"
          style={{ maxWidth: 920, margin: "0 auto" }}
        >
          {/* Conic gradient glow ring */}
          <div
            className="absolute pointer-events-none opacity-40"
            style={{
              inset: -2,
              borderRadius: 28,
              padding: 2,
              background:
                "conic-gradient(from 0deg, transparent 0%, oklch(0.62 0.13 155 / 0.5) 25%, transparent 35%, oklch(0.82 0.08 80 / 0.3) 65%, transparent 75%)",
              WebkitMask:
                "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />

          <div
            style={{
              borderRadius: 26,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.005)), rgba(13, 16, 14, 0.7)",
              border: "1px solid var(--islametra-line-strong)",
              backdropFilter: "blur(24px)",
              boxShadow:
                "0 1px 0 rgba(255,255,255,0.06) inset, 0 50px 120px -40px rgba(0,0,0,0.8), 0 0 80px -20px oklch(0.62 0.13 155 / 0.3)",
              overflow: "hidden",
            }}
          >
            {/* Toolbar */}
            <div
              style={{
                display: "flex", alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 18px",
                borderBottom: "1px solid var(--islametra-line)",
                background: "linear-gradient(180deg, rgba(255,255,255,0.02), transparent)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ display: "flex", gap: 6 }}>
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      style={{
                        width: 10, height: 10, borderRadius: "50%",
                        background: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.04)",
                        display: "block",
                      }}
                    />
                  ))}
                </div>
                <span
                  style={{
                    fontFamily: "'Geist Mono', monospace",
                    fontSize: 13, color: "var(--islametra-fg-mute)",
                    letterSpacing: "0.02em",
                  }}
                >
                  islametra.ai · session
                </span>
              </div>
              <div
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "4px 10px", borderRadius: 999,
                  background: "oklch(0.62 0.13 155 / 0.12)",
                  border: "1px solid oklch(0.62 0.13 155 / 0.25)",
                  color: "oklch(0.88 0.08 155)",
                  fontSize: 11.5,
                  fontFamily: "'Geist Mono', monospace",
                }}
              >
                <span
                  style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: "oklch(0.78 0.13 155)",
                    boxShadow: "0 0 8px oklch(0.78 0.13 155)",
                    animation: "islametra-pulse-glow 1.6s ease-in-out infinite",
                    display: "block",
                  }}
                />
                Islametra 2.0 · online
              </div>
            </div>

            {/* Chat body */}
            <div style={{ padding: 32, display: "flex", flexDirection: "column", gap: 22, minHeight: 320 }}>
              {/* User message */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, maxWidth: "78%", alignSelf: "flex-end" }}>
                <div
                  style={{
                    padding: "14px 18px",
                    borderRadius: 16,
                    borderTopRightRadius: 6,
                    fontSize: 14.5, lineHeight: 1.55,
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                    border: "1px solid var(--islametra-line-strong)",
                    color: "var(--islametra-fg)",
                  }}
                >
                  {ta.userMsg}
                </div>
                <div
                  style={{
                    width: 32, height: 32, flexShrink: 0,
                    borderRadius: 10,
                    display: "grid", placeItems: "center",
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid var(--islametra-line)",
                    color: "var(--islametra-fg-soft)",
                    fontSize: 12.5, fontWeight: 600,
                  }}
                >
                  A
                </div>
              </div>

              {/* AI message */}
              <div style={{ display: "flex", gap: 12, maxWidth: "78%" }}>
                <div
                  style={{
                    width: 32, height: 32, flexShrink: 0,
                    borderRadius: 10,
                    display: "grid", placeItems: "center",
                    background:
                      "linear-gradient(135deg, oklch(0.7 0.13 155), oklch(0.4 0.11 155))",
                    color: "#08110b",
                    boxShadow: "0 4px 14px -4px oklch(0.62 0.13 155 / 0.6)",
                    fontSize: 14,
                    fontWeight: 700,
                  }}
                >
                  ن
                </div>
                <div
                  style={{
                    padding: "14px 18px",
                    borderRadius: 16,
                    borderTopLeftRadius: 6,
                    fontSize: 14.5, lineHeight: 1.55,
                    background:
                      "radial-gradient(ellipse 100% 100% at 0% 0%, oklch(0.62 0.13 155 / 0.08), transparent 70%), linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005))",
                    border: "1px solid var(--islametra-line)",
                    color: "var(--islametra-fg-soft)",
                  }}
                >
                  <div style={{ marginBottom: 10 }}>
                    {ta.aiMsg1}
                  </div>
                  <div
                    className="font-arabic"
                    lang="ar" dir="rtl"
                    style={{
                      fontSize: 19, lineHeight: 1.85,
                      color: "var(--islametra-gold-soft)",
                      padding: "4px 0",
                    }}
                  >
                    يٰٓاَيُّهَا الَّذِيْنَ اٰمَنُوا اسْتَعِيْنُوْا بِالصَّبْرِ وَالصَّلٰوةِ
                  </div>
                  <div style={{ marginTop: 10, color: "var(--islametra-fg-mute)", fontSize: 13.5 }}>
                    {ta.aiMsg2}
                  </div>
                  {/* Citations */}
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12, paddingTop: 12, borderTop: "1px dashed var(--islametra-line)" }}
                  >
                    {["QS. Al-Baqarah: 153", "Tafsir Ibnu Katsir", "Riyadhus Shalihin"].map((cite, i) => (
                      <span
                        key={cite}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: 6,
                          padding: "4px 9px", borderRadius: 6,
                          background: "rgba(255,255,255,0.04)",
                          border: "1px solid var(--islametra-line)",
                          fontSize: 11.5,
                          color: "var(--islametra-fg-soft)",
                          fontFamily: "'Geist Mono', monospace",
                        }}
                      >
                        <span
                          style={{
                            width: 14, height: 14, borderRadius: 4,
                            background: "oklch(0.62 0.13 155 / 0.25)",
                            color: "oklch(0.88 0.08 155)",
                            display: "grid", placeItems: "center",
                            fontSize: 9, fontWeight: 600,
                          }}
                        >
                          {i + 1}
                        </span>
                        {cite}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Typing indicator */}
              {showTyping && (
                <div style={{ display: "flex", gap: 12, maxWidth: "78%" }}>
                  <div
                    style={{
                      width: 32, height: 32, flexShrink: 0,
                      borderRadius: 10,
                      display: "grid", placeItems: "center",
                      background:
                        "linear-gradient(135deg, oklch(0.7 0.13 155), oklch(0.4 0.11 155))",
                      color: "#08110b",
                      fontSize: 14, fontWeight: 700,
                    }}
                  >
                    ن
                  </div>
                  <div
                    style={{
                      padding: "14px 18px",
                      borderRadius: 16,
                      borderTopLeftRadius: 6,
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005))",
                      border: "1px solid var(--islametra-line)",
                    }}
                  >
                    <div style={{ display: "flex", gap: 4 }}>
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          style={{
                            width: 7, height: 7, borderRadius: "50%",
                            background: "var(--islametra-fg-mute)",
                            display: "block",
                          }}
                          animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
                          transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.15 }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Suggestion chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "0 32px 16px" }}>
              {ta.chips.map((label, i) => (
                <button
                  key={label}
                  className="transition-colors"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "8px 14px", borderRadius: 999,
                    fontSize: 13, color: "var(--islametra-fg-soft)",
                    background: "rgba(255,255,255,0.025)",
                    border: "1px solid var(--islametra-line)",
                  }}
                >
                  {i === 0 && <SparkleIcon size={12} />}
                  {label}
                </button>
              ))}
            </div>

            {/* Input */}
            <div style={{ margin: "0 32px 32px" }}>
              <div
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "6px 6px 6px 18px",
                  borderRadius: 16,
                  background: "rgba(0,0,0,0.25)",
                  border: "1px solid var(--islametra-line-strong)",
                }}
              >
                <input
                  readOnly
                  value={ta.inputPlaceholder}
                  style={{
                    flex: 1, background: "transparent",
                    border: 0, outline: 0,
                    color: "var(--islametra-fg-mute)",
                    fontFamily: "inherit", fontSize: 14,
                    padding: "12px 0",
                  }}
                />
                <div style={{ display: "flex", gap: 4 }}>
                  {([["Plus", Plus], ["Mic", Mic]] as const).map(([label, Icon]) => (
                    <button
                      key={label}
                      aria-label={label === "Plus" ? "Lampirkan" : "Rekam suara"}
                      style={{
                        width: 36, height: 36, borderRadius: 10,
                        display: "grid", placeItems: "center",
                        color: "var(--islametra-fg-mute)",
                      }}
                    >
                      <Icon size={16} />
                    </button>
                  ))}
                </div>
                <button
                  aria-label="Kirim pesan"
                  style={{
                    width: 40, height: 40, borderRadius: 12,
                    display: "grid", placeItems: "center",
                    background:
                      "linear-gradient(180deg, oklch(0.7 0.13 155), oklch(0.5 0.12 155))",
                    color: "#08110b",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25)",
                  }}
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Link href="/ai-chat">
            <button
              className="transition-transform hover:-translate-y-px group"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                height: 46, padding: "0 20px",
                borderRadius: 12, fontSize: 14, fontWeight: 500,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid var(--islametra-line)",
                color: "var(--islametra-fg-soft)",
              }}
            >
              {ta.cta}
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}

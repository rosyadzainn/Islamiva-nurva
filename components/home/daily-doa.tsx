"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, CheckCheck, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";
import { DAILY_DUAS } from "@/data/doa-data";

export function DailyDoa() {
  const [copied, setCopied] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const doa = DAILY_DUAS[activeIdx];

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `${doa.title}\n\n${doa.arabic}\n\n${doa.latin}\n\nArtinya: ${doa.translation}\n\nSumber: ${doa.source}`
    );
    setCopied(true);
    toast.success("Doa berhasil disalin!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      className="relative"
      style={{
        backgroundColor: "var(--islamiva-bg)",
        padding: "clamp(80px, 12vw, 160px) 0",
      }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--islamiva-line-strong), transparent)",
        }}
      />

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 28px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 40 }}>
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
                border: "1px solid var(--islamiva-line)",
                color: "var(--islamiva-fg-soft)",
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
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--islamiva-emerald)", flexShrink: 0 }} />
              Amalan Harian
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
                color: "var(--islamiva-fg)",
              }}
            >
              Doa Hari Ini
            </motion.h2>
          </div>
          <Link
            href="/doa"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium transition-colors group"
            style={{ color: "var(--islamiva-fg-mute)", fontFamily: "'Geist', sans-serif" }}
          >
            Semua doa
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Tabs */}
        <div className="scrollbar-hide" style={{ display: "flex", gap: 8, marginBottom: 32, overflowX: "auto", paddingBottom: 8 }}>
          {DAILY_DUAS.slice(0, 5).map((d, i) => (
            <button
              key={d.id}
              onClick={() => setActiveIdx(i)}
              className="flex-shrink-0 transition-all"
              style={{
                padding: "8px 16px",
                borderRadius: 10,
                fontSize: 13, fontWeight: 500,
                fontFamily: "'Geist', sans-serif",
                ...(activeIdx === i
                  ? {
                      background:
                        "linear-gradient(180deg, oklch(0.7 0.13 155) 0%, oklch(0.55 0.12 155) 100%)",
                      color: "#08110b",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), 0 6px 18px -8px oklch(0.62 0.13 155 / 0.5)",
                    }
                  : {
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid var(--islamiva-line)",
                      color: "var(--islamiva-fg-mute)",
                    }),
              }}
            >
              {d.title}
            </button>
          ))}
        </div>

        {/* Doa card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={doa.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22 }}
            style={{
              borderRadius: 22,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005)), var(--islamiva-bg-1)",
              border: "1px solid var(--islamiva-line-strong)",
              overflow: "hidden",
              boxShadow: "0 30px 80px -30px rgba(0,0,0,0.6)",
            }}
          >
            {/* Top bar */}
            <div
              className="flex items-center justify-between"
              style={{
                padding: "16px 24px",
                borderBottom: "1px solid var(--islamiva-line)",
                background: "linear-gradient(180deg, rgba(255,255,255,0.02), transparent)",
              }}
            >
              <div>
                <p style={{ fontWeight: 500, fontSize: 14, color: "var(--islamiva-fg)" }}>
                  {doa.title}
                </p>
                <p
                  style={{
                    fontSize: 11, color: "var(--islamiva-fg-dim)", marginTop: 2,
                    fontFamily: "'Geist Mono', monospace",
                    letterSpacing: "0.04em", textTransform: "capitalize",
                  }}
                >
                  {doa.category.replace("-", " ")}
                </p>
              </div>
              <span
                style={{
                  fontSize: 11, fontFamily: "'Geist Mono', monospace",
                  padding: "4px 10px", borderRadius: 6,
                  background: "oklch(0.62 0.13 155 / 0.12)",
                  border: "1px solid oklch(0.62 0.13 155 / 0.2)",
                  color: "oklch(0.85 0.1 155)",
                  letterSpacing: "0.03em",
                }}
              >
                {doa.source}
              </span>
            </div>

            {/* Arabic */}
            <div
              className="text-center"
              style={{
                padding: "40px 32px 24px",
                background:
                  "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.62 0.13 155 / 0.06), transparent 60%)",
              }}
            >
              <p
                className="font-arabic"
                lang="ar" dir="rtl"
                style={{
                  fontSize: "clamp(26px, 4vw, 40px)",
                  color: "var(--islamiva-gold-soft)",
                  lineHeight: 2,
                  opacity: 0.9,
                }}
              >
                {doa.arabic}
              </p>
            </div>

            {/* Latin + Translation */}
            <div style={{ padding: "0 32px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
              <p
                style={{
                  fontSize: 14, fontStyle: "italic",
                  lineHeight: 1.65,
                  color: "var(--islamiva-fg-mute)",
                  textAlign: "center",
                }}
              >
                {doa.latin}
              </p>
              <div
                style={{
                  padding: 16, borderRadius: 12,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid var(--islamiva-line)",
                }}
              >
                <p style={{ fontSize: 14, lineHeight: 1.65, color: "var(--islamiva-fg-soft)" }}>
                  <span
                    style={{
                      fontWeight: 600,
                      color: "oklch(0.78 0.13 155)",
                    }}
                  >
                    Artinya:{" "}
                  </span>
                  {doa.translation}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div
              className="flex items-center justify-between"
              style={{
                padding: "14px 32px",
                borderTop: "1px solid var(--islamiva-line)",
                background: "rgba(0,0,0,0.15)",
              }}
            >
              <button
                onClick={handleCopy}
                className="transition-colors"
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  fontSize: 13, fontWeight: 500,
                  color: copied ? "oklch(0.78 0.13 155)" : "var(--islamiva-fg-mute)",
                }}
              >
                {copied ? <CheckCheck size={14} /> : <Copy size={14} />}
                {copied ? "Tersalin!" : "Salin Doa"}
              </button>
              <Link
                href="/doa"
                className="transition-colors group"
                style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--islamiva-fg-dim)" }}
              >
                Lihat semua doa
                <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Heart, Scroll, Star, History, MessageCircle, ArrowUpRight, Clock, Beaker, Calendar } from "lucide-react";

const modules = [
  {
    href: "/quran",
    icon: BookOpen,
    title: "Al-Quran",
    desc: "Baca, dengar, dan telusuri 114 surah dengan tafsir berlapis dari ulama klasik hingga kontemporer.",
    meta: "114 surah · 6,236 ayat",
    tone: "emerald",
    featured: true,
  },
  {
    href: "/doa",
    icon: Heart,
    title: "Doa Harian",
    desc: "Koleksi doa pilihan untuk setiap momen kehidupan, lengkap dengan transliterasi dan terjemahan.",
    meta: "320+ doa terkurasi",
    tone: null,
  },
  {
    href: "/hadith",
    icon: Scroll,
    title: "Hadits Shahih",
    desc: "Akses kitab hadits utama dengan derajat keshahihan, perawi, dan konteks historis yang lengkap.",
    meta: "Bukhari · Muslim · 4 lainnya",
    tone: null,
  },
  {
    href: "/kisah-nabi",
    icon: Star,
    title: "Kisah Nabi",
    desc: "25 kisah Nabi diceritakan dengan elegan — peta perjalanan, kronologi, dan pelajaran hidup.",
    meta: "25 nabi · timeline interaktif",
    tone: null,
  },
  {
    href: "/sejarah",
    icon: History,
    title: "Sejarah Islam",
    desc: "Telusuri 1.400 tahun peradaban — dari Madinah hingga keemasan Andalusia.",
    meta: "Atlas waktu lengkap",
    tone: null,
  },
  {
    href: "/jadwal-sholat",
    icon: Clock,
    title: "Jadwal Sholat",
    desc: "Waktu sholat akurat berdasarkan lokasi GPS kamu, dengan countdown ke sholat berikutnya.",
    meta: "5 waktu · lokasi otomatis",
    tone: null,
  },
  {
    href: "/tasbih",
    icon: Beaker,
    title: "Tasbih Digital",
    desc: "Counter dzikir digital dengan haptic feedback. Pilih dzikir, tentukan target, dan mulai berdzikir.",
    meta: "SubhanAllah · Alhamdulillah · Allahu Akbar",
    tone: null,
  },
  {
    href: "/kalender",
    icon: Calendar,
    title: "Kalender Hijriah",
    desc: "Konversi tanggal Masehi ↔ Hijriah dan temukan hari-hari penting dalam kalender Islam.",
    meta: "12 bulan Hijriah · hari penting",
    tone: null,
  },
  {
    href: "/ai-chat",
    icon: MessageCircle,
    title: "Islamiva AI",
    desc: "Asisten percakapan yang menjawab dengan rujukan ayat, hadits, dan pendapat ulama terpercaya.",
    meta: "GPT-class · sumber tercantum",
    tone: "gold",
  },
];

export function ModuleGrid() {
  return (
    <section
      id="features"
      className="relative"
      style={{
        backgroundColor: "var(--islamiva-bg)",
        padding: "clamp(80px, 12vw, 160px) 0",
      }}
    >
      {/* Subtle top divider glow */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--islamiva-line-strong), transparent)",
        }}
      />

      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "0 28px" }}>
        {/* Header */}
        <div className="islamiva-feat-head" style={{ marginBottom: 64 }}>
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
                border: "1px solid var(--islamiva-line)",
                color: "var(--islamiva-fg-soft)",
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
                style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--islamiva-emerald)", flexShrink: 0 }}
              />
              Apa yang ditawarkan Islamiva
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
                color: "var(--islamiva-fg)",
                marginTop: 14,
              }}
            >
              Satu platform,{" "}
              <em
                style={{
                  fontFamily: "'Instrument Serif', serif",
                  fontStyle: "italic",
                  fontWeight: 400,
                  color: "var(--islamiva-gold)",
                  letterSpacing: "-0.005em",
                }}
              >
                lengkap
              </em>
              <br />
              untuk perjalanan spiritual.
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
              color: "var(--islamiva-fg-mute)",
              maxWidth: "36ch",
            }}
          >
            Setiap fitur dirancang dengan rasa hormat terhadap tradisi, dan disempurnakan dengan teknologi modern.
          </motion.p>
        </div>

        {/* Grid */}
        <div className="islamiva-module-grid">
          {modules.map((mod, i) => {
            const Icon = mod.icon;
            const isEmerald = mod.tone === "emerald";
            const isGold = mod.tone === "gold";
            return (
              <motion.div
                key={mod.href}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
              >
                <Link href={mod.href} className="block h-full group">
                  <div
                    className="relative"
                    style={{
                      display: "flex", flexDirection: "column",
                      height: "100%", overflow: "hidden",
                      padding: 28,
                      minHeight: 240,
                      borderRadius: 22,
                      background: isEmerald
                        ? `radial-gradient(ellipse 100% 60% at 100% 0%, oklch(0.62 0.13 155 / 0.12), transparent 60%), linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005)), var(--islamiva-bg-1)`
                        : "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005)), var(--islamiva-bg-1)",
                      border: "1px solid var(--islamiva-line)",
                      transition: "transform 0.25s ease, border-color 0.25s ease",
                    }}
                  >
                    {/* Shimmer top border */}
                    <div
                      className="absolute inset-0 pointer-events-none rounded-[22px]"
                      style={{
                        padding: 1,
                        background:
                          "linear-gradient(180deg, rgba(255,255,255,0.07), transparent 30%)",
                        WebkitMask:
                          "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                        WebkitMaskComposite: "xor",
                        maskComposite: "exclude",
                      }}
                    />

                    {/* Hover glow */}
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
                        ...(isEmerald ? { opacity: 0.6 } : {}),
                      }}
                    />
                    {isEmerald && (
                      <div
                        className="absolute pointer-events-none"
                        style={{
                          width: 240, height: 240,
                          right: -80, top: -80,
                          background:
                            "radial-gradient(circle, oklch(0.62 0.13 155 / 0.12) 0%, transparent 70%)",
                          filter: "blur(20px)",
                          opacity: 0.6,
                          zIndex: 0,
                        }}
                      />
                    )}

                    {/* Icon */}
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
                          : "1px solid var(--islamiva-line)",
                        color: isEmerald
                          ? "oklch(0.85 0.1 155)"
                          : isGold
                          ? "var(--islamiva-gold-soft)"
                          : "var(--islamiva-fg)",
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={20} />
                    </div>

                    {/* Title */}
                    <div
                      className="relative z-10"
                      style={{
                        fontSize: 20, fontWeight: 500,
                        letterSpacing: "-0.02em",
                        color: "var(--islamiva-fg)",
                        marginBottom: 8,
                      }}
                    >
                      {mod.title}
                    </div>

                    {/* Desc */}
                    <div
                      className="relative z-10 flex-1"
                      style={{
                        fontSize: 14,
                        color: "var(--islamiva-fg-mute)",
                        lineHeight: 1.55,
                      }}
                    >
                      {mod.desc}
                    </div>

                    {/* Meta */}
                    <div
                      className="relative z-10"
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        marginTop: 20, paddingTop: 16,
                        fontFamily: "'Geist Mono', monospace",
                        fontSize: 11,
                        color: "var(--islamiva-fg-dim)",
                        letterSpacing: "0.03em",
                        borderTop: "1px dashed var(--islamiva-line)",
                      }}
                    >
                      <span>{mod.meta}</span>
                      <ArrowUpRight
                        size={14}
                        className="transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        style={{ color: "var(--islamiva-fg-mute)" }}
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

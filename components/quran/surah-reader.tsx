"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@clerk/nextjs";
import {
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Share2,
  Copy,
  CheckCheck,
  Minus,
  Plus,
  Play,
  Pause,
} from "lucide-react";
import { toast } from "react-hot-toast";
import type { Surah, Ayah } from "@/types";
import { SURAH_LIST } from "@/data/quran-data";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useQuranProgress } from "@/hooks/use-quran-progress";

interface SurahReaderProps {
  surah: Surah;
}

const QURAN_API_BASE = "https://api.alquran.cloud/v1";

function AyahSkeleton() {
  return (
    <div
      style={{
        padding: 24,
        borderRadius: 16,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.005)), var(--islametra-bg-1)",
        border: "1px solid var(--islametra-line)",
      }}
    >
      <div
        style={{
          height: 16,
          width: "30%",
          borderRadius: 6,
          background: "rgba(255,255,255,0.04)",
          marginBottom: 20,
        }}
      />
      <div
        style={{
          height: 36,
          borderRadius: 8,
          background: "rgba(255,255,255,0.03)",
          marginBottom: 16,
        }}
      />
      <div style={{ height: 12, width: "70%", borderRadius: 4, background: "rgba(255,255,255,0.03)", marginBottom: 8 }} />
      <div style={{ height: 12, width: "50%", borderRadius: 4, background: "rgba(255,255,255,0.03)" }} />
    </div>
  );
}

export function SurahReader({ surah }: SurahReaderProps) {
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState(26);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [showResume, setShowResume] = useState(false);
  const { isBookmarked, toggle: toggleBookmark } = useBookmarks();
  const { saveProgress, getProgress } = useQuranProgress();
  const { isSignedIn } = useAuth();
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const prevSurah = SURAH_LIST.find((s) => s.number === surah.number - 1);
  const nextSurah = SURAH_LIST.find((s) => s.number === surah.number + 1);

  useEffect(() => {
    const fetchSurah = async () => {
      setLoading(true);
      setAyahs([]);
      try {
        const timeout = (ms: number) => new Promise<never>((_, reject) => setTimeout(() => reject(new Error("timeout")), ms));
        const fetchWithTimeout = (url: string) => Promise.race([fetch(url), timeout(10000)]);

        const [arabicRes, indoRes, latinRes] = await Promise.all([
          fetchWithTimeout(`${QURAN_API_BASE}/surah/${surah.number}`),
          fetchWithTimeout(`${QURAN_API_BASE}/surah/${surah.number}/id.indonesian`),
          fetchWithTimeout(`${QURAN_API_BASE}/surah/${surah.number}/en.transliteration`),
        ]);
        const [arabicData, indoData, latinData] = await Promise.all([
          arabicRes.json(),
          indoRes.json(),
          latinRes.json(),
        ]);

        if (arabicData.code === 200 && indoData.code === 200) {
          const combined: Ayah[] = arabicData.data.ayahs.map(
            (a: { numberInSurah: number; text: string; number: number }, i: number) => ({
              number: a.numberInSurah,
              surahNumber: surah.number,
              text: a.text,
              transliteration: latinData.code === 200 ? (latinData.data.ayahs[i]?.text || "") : undefined,
              translation: indoData.data.ayahs[i]?.text || "",
              audioUrl: `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${a.number}.mp3`,
            })
          );
          setAyahs(combined);
          if (isSignedIn) {
            fetch("/api/reading-history", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ type: "quran", referenceId: `surah-${surah.number}`, metadata: { surahNumber: surah.number, surahName: surah.name, totalAyahs: combined.length } }),
            }).catch(() => {});
          }
        }
      } catch {
        toast.error("Gagal memuat surah. Coba lagi.");
      } finally {
        setLoading(false);
      }
    };
    fetchSurah();
  }, [surah.number]);

  // Show resume banner if there's saved progress past ayah 1
  useEffect(() => {
    const p = getProgress(surah.number);
    if (p && p.lastAyah > 1) setShowResume(true);
  }, [surah.number]); // eslint-disable-line

  const handleCopy = (ayah: Ayah) => {
    navigator.clipboard.writeText(
      `${ayah.text}\n\n${ayah.translation}\n\n(QS. ${surah.name}: ${ayah.number})`
    );
    setCopiedId(ayah.number);
    toast.success("Ayat berhasil disalin!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShare = (ayah: Ayah) => {
    const text = `${ayah.text}\n\n${ayah.translation}\n\n(QS. ${surah.name}: ${ayah.number})\n\n📖 Baca di https://www.islametra.com/quran/${surah.number}`;
    if (navigator.share) {
      navigator.share({ text }).catch(() => {});
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
    }
  };

  const handleBookmark = async (ayah: Ayah) => {
    const added = await toggleBookmark({
      type: "quran",
      surahNumber: surah.number,
      ayahNumber: ayah.number,
      surahName: surah.name,
      ayahText: ayah.text,
      createdAt: new Date().toISOString(),
    });
    toast.success(added ? "Ayat di-bookmark!" : "Bookmark dihapus");
    saveProgress(surah.number, ayah.number, ayahs.length, surah.name);
  };

  const handlePlay = (ayah: Ayah) => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    if (playingId === ayah.number) {
      setPlayingId(null);
      return;
    }
    if (ayah.audioUrl) {
      const newAudio = new Audio(ayah.audioUrl);
      newAudio.play();
      newAudio.onended = () => setPlayingId(null);
      setAudio(newAudio);
      setPlayingId(ayah.number);
      saveProgress(surah.number, ayah.number, ayahs.length, surah.name);
    }
  };

  const handleResume = () => {
    const p = getProgress(surah.number);
    if (!p) return;
    const el = document.getElementById(`ayah-${p.lastAyah}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    setShowResume(false);
  };

  return (
    <div style={{ backgroundColor: "var(--islametra-bg)", minHeight: "100vh" }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "clamp(32px, 5vw, 60px) 28px" }}>

        {/* Back link */}
        <Link
          href="/quran"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13,
            color: "var(--islametra-fg-dim)",
            fontFamily: "'Geist', sans-serif",
            marginBottom: 32,
            transition: "color 0.2s",
          }}
          className="hover:text-[var(--islametra-fg-soft)] transition-colors"
        >
          <ChevronLeft size={15} />
          Kembali ke daftar surah
        </Link>

        {/* Surah header card */}
        <div
          style={{
            position: "relative",
            padding: "40px 32px",
            borderRadius: 24,
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.005)), var(--islametra-bg-1)",
            border: "1px solid var(--islametra-line-strong)",
            textAlign: "center",
            marginBottom: 24,
            overflow: "hidden",
            boxShadow: "0 30px 80px -30px rgba(0,0,0,0.5)",
          }}
        >
          {/* Emerald radial glow */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400,
              height: 200,
              background: "radial-gradient(ellipse, oklch(0.62 0.13 155 / 0.1), transparent 70%)",
              filter: "blur(20px)",
              pointerEvents: "none",
            }}
          />
          {/* Shimmer border */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: 24,
              padding: 1,
              background: "linear-gradient(180deg, rgba(255,255,255,0.08), transparent 40%)",
              WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              pointerEvents: "none",
            }}
          />

          <div style={{ position: "relative" }}>
            {/* Arabic name */}
            <p
              className="font-arabic"
              lang="ar"
              dir="rtl"
              style={{
                fontSize: "clamp(36px, 6vw, 56px)",
                color: "var(--islametra-gold-soft)",
                lineHeight: 1.5,
                marginBottom: 12,
                opacity: 0.9,
              }}
            >
              {surah.nameArabic}
            </p>

            {/* Latin name */}
            <h1
              style={{
                fontSize: "clamp(20px, 3vw, 28px)",
                fontWeight: 600,
                fontFamily: "'Geist', sans-serif",
                color: "var(--islametra-fg)",
                letterSpacing: "-0.02em",
                marginBottom: 4,
              }}
            >
              {surah.name}
            </h1>
            <p
              style={{
                fontSize: 13,
                color: "var(--islametra-fg-mute)",
                fontFamily: "'Geist', sans-serif",
                marginBottom: 20,
              }}
            >
              {surah.nameTranslation}
            </p>

            {/* Badges */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  padding: "4px 12px",
                  borderRadius: 999,
                  fontFamily: "'Geist Mono', monospace",
                  letterSpacing: "0.04em",
                  background: "oklch(0.62 0.13 155 / 0.12)",
                  border: "1px solid oklch(0.62 0.13 155 / 0.25)",
                  color: "oklch(0.85 0.1 155)",
                }}
              >
                {surah.numberOfAyahs} Ayat
              </span>
              <span
                style={{
                  fontSize: 11,
                  padding: "4px 12px",
                  borderRadius: 999,
                  fontFamily: "'Geist Mono', monospace",
                  letterSpacing: "0.04em",
                  background: "oklch(0.82 0.08 80 / 0.1)",
                  border: "1px solid oklch(0.82 0.08 80 / 0.2)",
                  color: "var(--islametra-gold-soft)",
                }}
              >
                {surah.revelationType === "Meccan" ? "Makkiyah" : "Madaniyah"}
              </span>
            </div>

            {/* Bismillah */}
            {surah.number !== 9 && surah.number !== 1 && (
              <p
                className="font-arabic"
                lang="ar"
                dir="rtl"
                style={{
                  fontSize: "clamp(18px, 2.8vw, 26px)",
                  color: "var(--islametra-gold-soft)",
                  lineHeight: 2,
                  marginTop: 24,
                  paddingTop: 20,
                  borderTop: "1px dashed oklch(0.62 0.13 155 / 0.2)",
                  opacity: 0.8,
                }}
              >
                بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
              </p>
            )}
          </div>
        </div>

        {/* Font size control */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 8,
            marginBottom: 20,
          }}
        >
          <span
            style={{
              fontSize: 11,
              color: "var(--islametra-fg-dim)",
              fontFamily: "'Geist Mono', monospace",
            }}
          >
            Ukuran Arabic:
          </span>
          <button
            onClick={() => setFontSize((f) => Math.max(18, f - 2))}
            aria-label="Perkecil font Arab"
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--islametra-line)",
              color: "var(--islametra-fg-mute)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s",
            }}
          >
            <Minus size={12} />
          </button>
          <span
            style={{
              fontSize: 12,
              fontFamily: "'Geist Mono', monospace",
              color: "var(--islametra-fg-soft)",
              width: 28,
              textAlign: "center",
            }}
          >
            {fontSize}
          </span>
          <button
            onClick={() => setFontSize((f) => Math.min(44, f + 2))}
            aria-label="Perbesar font Arab"
            style={{
              width: 28,
              height: 28,
              borderRadius: 7,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--islametra-line)",
              color: "var(--islametra-fg-mute)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s",
            }}
          >
            <Plus size={12} />
          </button>
        </div>

        {/* Resume banner */}
        <AnimatePresence>
          {showResume && getProgress(surah.number) && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 18px",
                borderRadius: 12,
                background: "oklch(0.62 0.13 155 / 0.1)",
                border: "1px solid oklch(0.62 0.13 155 / 0.25)",
                marginBottom: 16,
                gap: 12,
              }}
            >
              <span style={{ fontSize: 13, color: "oklch(0.85 0.1 155)", fontFamily: "'Geist', sans-serif" }}>
                Terakhir baca ayat {getProgress(surah.number)!.lastAyah}
              </span>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={handleResume}
                  style={{
                    padding: "5px 14px",
                    borderRadius: 8,
                    border: "none",
                    background: "oklch(0.62 0.13 155)",
                    color: "#08110b",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "'Geist', sans-serif",
                  }}
                >
                  Lanjutkan
                </button>
                <button
                  onClick={() => setShowResume(false)}
                  style={{
                    padding: "5px 10px",
                    borderRadius: 8,
                    border: "1px solid oklch(0.62 0.13 155 / 0.3)",
                    background: "transparent",
                    color: "var(--islametra-fg-dim)",
                    fontSize: 12,
                    cursor: "pointer",
                  }}
                >
                  ✕
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ayahs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {loading
            ? Array.from({ length: 7 }).map((_, i) => <AyahSkeleton key={i} />)
            : ayahs.map((ayah, i) => (
                <motion.div
                  key={ayah.number}
                  id={`ayah-${ayah.number}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.02, 0.5) }}
                  className="group"
                  style={{
                    borderRadius: 16,
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005)), var(--islametra-bg-1)",
                    border: "1px solid var(--islametra-line)",
                    overflow: "hidden",
                    transition: "border-color 0.2s",
                  }}
                >
                  {/* Ayah header row */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "14px 20px",
                      borderBottom: "1px solid var(--islametra-line)",
                      background: "rgba(0,0,0,0.1)",
                    }}
                  >
                    {/* Ayah number */}
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: "50%",
                        background: "oklch(0.62 0.13 155 / 0.12)",
                        border: "1px solid oklch(0.62 0.13 155 / 0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          fontFamily: "'Geist Mono', monospace",
                          color: "oklch(0.85 0.1 155)",
                        }}
                      >
                        {ayah.number}
                      </span>
                    </div>

                    {/* Action buttons — visible on hover */}
                    <div
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ display: "flex", alignItems: "center", gap: 4 }}
                    >
                      <button
                        onClick={() => handlePlay(ayah)}
                        aria-label={playingId === ayah.number ? "Pause audio" : "Putar audio"}
                        style={{
                          padding: "6px",
                          borderRadius: 7,
                          border: "none",
                          background:
                            playingId === ayah.number
                              ? "oklch(0.62 0.13 155 / 0.15)"
                              : "rgba(255,255,255,0.04)",
                          color:
                            playingId === ayah.number
                              ? "oklch(0.78 0.13 155)"
                              : "var(--islametra-fg-dim)",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          transition: "all 0.2s",
                        }}
                      >
                        {playingId === ayah.number ? <Pause size={13} /> : <Play size={13} />}
                      </button>
                      <button
                        onClick={() => handleBookmark(ayah)}
                        aria-label={isBookmarked(`quran-${surah.number}-${ayah.number}`) ? "Hapus bookmark" : "Bookmark ayat"}
                        style={{
                          padding: "6px",
                          borderRadius: 7,
                          border: "none",
                          background: isBookmarked(`quran-${surah.number}-${ayah.number}`)
                            ? "oklch(0.62 0.13 155 / 0.12)"
                            : "rgba(255,255,255,0.04)",
                          color: isBookmarked(`quran-${surah.number}-${ayah.number}`)
                            ? "oklch(0.78 0.13 155)"
                            : "var(--islametra-fg-dim)",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          transition: "all 0.2s",
                        }}
                      >
                        <Bookmark
                          size={13}
                          fill={isBookmarked(`quran-${surah.number}-${ayah.number}`) ? "currentColor" : "none"}
                        />
                      </button>
                      <button
                        onClick={() => handleCopy(ayah)}
                        aria-label="Salin ayat"
                        style={{
                          padding: "6px",
                          borderRadius: 7,
                          border: "none",
                          background: "rgba(255,255,255,0.04)",
                          color:
                            copiedId === ayah.number
                              ? "oklch(0.78 0.13 155)"
                              : "var(--islametra-fg-dim)",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          transition: "all 0.2s",
                        }}
                      >
                        {copiedId === ayah.number ? (
                          <CheckCheck size={13} />
                        ) : (
                          <Copy size={13} />
                        )}
                      </button>
                      <button
                        onClick={() => handleShare(ayah)}
                        aria-label="Bagikan ayat"
                        style={{
                          padding: "6px",
                          borderRadius: 7,
                          border: "none",
                          background: "rgba(255,255,255,0.04)",
                          color: "var(--islametra-fg-dim)",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Share2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Arabic text */}
                  <div
                    style={{
                      padding: "28px 24px 20px",
                      background:
                        "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.62 0.13 155 / 0.04), transparent 60%)",
                    }}
                  >
                    <p
                      className="font-arabic"
                      lang="ar"
                      dir="rtl"
                      style={{
                        fontSize: `${fontSize}px`,
                        color: "var(--islametra-gold-soft)",
                        lineHeight: 2.1,
                        textAlign: "right",
                        opacity: 0.9,
                      }}
                    >
                      {ayah.text}
                    </p>
                  </div>

                  {/* Transliteration */}
                  {ayah.transliteration && (
                    <div
                      style={{
                        padding: "12px 24px 14px",
                        borderTop: "1px dashed var(--islametra-line)",
                        background: "rgba(255,255,255,0.01)",
                      }}
                    >
                      <p
                        style={{
                          fontSize: 13,
                          fontStyle: "italic",
                          lineHeight: 1.75,
                          color: "var(--islametra-fg-dim)",
                          fontFamily: "'Geist', sans-serif",
                          letterSpacing: "0.01em",
                        }}
                      >
                        {ayah.transliteration}
                      </p>
                    </div>
                  )}

                  {/* Translation */}
                  <div
                    style={{
                      padding: "16px 24px 20px",
                      borderTop: "1px dashed var(--islametra-line)",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 13.5,
                        lineHeight: 1.75,
                        color: "var(--islametra-fg-mute)",
                      }}
                    >
                      {ayah.translation}
                    </p>
                  </div>
                </motion.div>
              ))}
        </div>

        {/* Navigation */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 48,
            paddingTop: 24,
            borderTop: "1px solid var(--islametra-line)",
          }}
        >
          {prevSurah ? (
            <Link href={`/quran/${prevSurah.number}`}>
              <div
                className="group transition-all duration-200 hover:-translate-x-0.5"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 16px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid var(--islametra-line)",
                  cursor: "pointer",
                }}
              >
                <ChevronLeft size={15} style={{ color: "var(--islametra-fg-dim)" }} />
                <div>
                  <p
                    style={{
                      fontSize: 10,
                      color: "var(--islametra-fg-dim)",
                      fontFamily: "'Geist Mono', monospace",
                      letterSpacing: "0.04em",
                      marginBottom: 2,
                    }}
                  >
                    Sebelumnya
                  </p>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: "var(--islametra-fg-soft)",
                      fontFamily: "'Geist', sans-serif",
                    }}
                  >
                    {prevSurah.name}
                  </p>
                </div>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextSurah ? (
            <Link href={`/quran/${nextSurah.number}`}>
              <div
                className="group transition-all duration-200 hover:translate-x-0.5"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 16px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid var(--islametra-line)",
                  cursor: "pointer",
                }}
              >
                <div style={{ textAlign: "right" }}>
                  <p
                    style={{
                      fontSize: 10,
                      color: "var(--islametra-fg-dim)",
                      fontFamily: "'Geist Mono', monospace",
                      letterSpacing: "0.04em",
                      marginBottom: 2,
                    }}
                  >
                    Berikutnya
                  </p>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: "var(--islametra-fg-soft)",
                      fontFamily: "'Geist', sans-serif",
                    }}
                  >
                    {nextSurah.name}
                  </p>
                </div>
                <ChevronRight size={15} style={{ color: "var(--islametra-fg-dim)" }} />
              </div>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Bookmark, BookOpen, Heart, Trash2, ArrowRight, Scroll, Clock } from "lucide-react";
import { useTheme } from "next-themes";
import { useAuth } from "@clerk/nextjs";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { toast } from "react-hot-toast";
import { useLang } from "@/contexts/language-context";
import { translations } from "@/lib/translations";

interface HistoryItem {
  id: string;
  type: string;
  referenceId: string;
  metadata: Record<string, unknown> | null;
  lastReadAt: string;
}

export default function BookmarkPage() {
  const { quranBookmarks, doaBookmarks, hadithBookmarks, remove, getKey } = useBookmarks();
  const total = quranBookmarks.length + doaBookmarks.length + hadithBookmarks.length;
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const { isSignedIn } = useAuth();
  useEffect(() => setMounted(true), []);
  const isLight = mounted && theme === "light";
  const { lang } = useLang();
  const tb = translations[lang].bookmarkPage;

  useEffect(() => {
    if (isSignedIn) {
      fetch("/api/reading-history")
        .then((r) => r.json())
        .then((d) => setHistory(d.history ?? []))
        .catch(() => {});
    }
  }, [isSignedIn]);

  const handleRemove = (key: string, label: string) => {
    remove(key);
    toast.success(`"${label}" ${tb.removed}`);
  };

  return (
    <div style={{ backgroundColor: "var(--islametra-bg)", minHeight: "100vh" }}>
      {/* Hero */}
      <section
        style={{
          position: "relative",
          padding: "clamp(80px, 12vw, 140px) 28px clamp(48px, 7vw, 80px)",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500, height: 260,
            background: "radial-gradient(ellipse, oklch(0.62 0.13 155 / 0.1), transparent 70%)",
            filter: "blur(40px)", pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", maxWidth: 600, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "6px 14px", borderRadius: 9999,
              background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.03)",
              border: "1px solid var(--islametra-line)",
              color: "var(--islametra-fg-soft)", fontSize: 11, fontWeight: 500,
              fontFamily: "'Geist Mono', monospace", letterSpacing: "0.08em",
              textTransform: "uppercase", marginBottom: 20,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--islametra-emerald)", flexShrink: 0 }} />
            {total} {tb.itemSaved}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            style={{
              fontFamily: "'Geist', sans-serif", fontWeight: 500,
              fontSize: "clamp(32px, 5vw, 56px)", lineHeight: 1.05,
              letterSpacing: "-0.03em", color: "var(--islametra-fg)", marginBottom: 16,
            }}
          >
            Bookmark{" "}
            <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400, color: "var(--islametra-emerald-soft)" }}>
              {tb.titleEm}
            </em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ fontSize: 15, color: "var(--islametra-fg-mute)", lineHeight: 1.65 }}
          >
            {tb.sub}
          </motion.p>
        </div>
      </section>

      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, var(--islametra-line-strong), transparent)" }} />

      <section style={{ maxWidth: 860, margin: "0 auto", padding: "clamp(40px, 6vw, 72px) 28px" }}>
        {!isSignedIn && (
          <div
            role="note"
            style={{
              display: "flex", alignItems: "flex-start", gap: 12,
              padding: "14px 18px", borderRadius: 12, marginBottom: 32,
              background: "oklch(0.82 0.08 80 / 0.07)",
              border: "1px solid oklch(0.82 0.08 80 / 0.2)",
            }}
          >
            <span style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }}>💡</span>
            <p style={{ fontSize: 13, color: "var(--islametra-fg-mute)", fontFamily: "'Geist', sans-serif", lineHeight: 1.6, margin: 0 }}>
              Bookmark kamu saat ini disimpan di perangkat ini saja. <strong style={{ color: "var(--islametra-fg-soft)" }}>Masuk</strong> agar bookmark tersinkronisasi di semua perangkat dan tidak hilang saat cache dihapus.
            </p>
          </div>
        )}
        {total === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              textAlign: "center", padding: "80px 32px", borderRadius: 24,
              background: isLight ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.02)",
              border: "1px solid var(--islametra-line)",
            }}
          >
            <div
              style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "oklch(0.62 0.13 155 / 0.1)",
                border: "1px solid oklch(0.62 0.13 155 / 0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 20px",
              }}
            >
              <Bookmark size={22} style={{ color: "oklch(0.78 0.13 155)" }} />
            </div>
            <h2
              style={{
                fontSize: 18, fontWeight: 600, fontFamily: "'Geist', sans-serif",
                color: "var(--islametra-fg)", letterSpacing: "-0.02em", marginBottom: 8,
              }}
            >
              {tb.emptyTitle}
            </h2>
            <p style={{ fontSize: 14, color: "var(--islametra-fg-mute)", marginBottom: 28, lineHeight: 1.6 }}>
              {tb.emptySub}
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
              <Link href="/quran" style={{ textDecoration: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: 10, background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)", border: "1px solid var(--islametra-line)", color: "var(--islametra-fg-soft)", fontSize: 13, fontFamily: "'Geist', sans-serif" }}>
                  <BookOpen size={14} /> Al-Quran
                </div>
              </Link>
              <Link href="/doa" style={{ textDecoration: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: 10, background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)", border: "1px solid var(--islametra-line)", color: "var(--islametra-fg-soft)", fontSize: 13, fontFamily: "'Geist', sans-serif" }}>
                  <Heart size={14} /> Doa
                </div>
              </Link>
              <Link href="/hadith" style={{ textDecoration: "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 18px", borderRadius: 10, background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)", border: "1px solid var(--islametra-line)", color: "var(--islametra-fg-soft)", fontSize: 13, fontFamily: "'Geist', sans-serif" }}>
                  <Scroll size={14} /> Hadits
                </div>
              </Link>
            </div>
          </motion.div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 48 }}>

            {/* Quran bookmarks */}
            {quranBookmarks.length > 0 && (
              <section>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: "oklch(0.62 0.13 155 / 0.12)", border: "1px solid oklch(0.62 0.13 155 / 0.22)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <BookOpen size={13} style={{ color: "oklch(0.78 0.13 155)" }} />
                  </div>
                  <h2 style={{ fontSize: 14, fontWeight: 600, fontFamily: "'Geist', sans-serif", color: "var(--islametra-fg-soft)", letterSpacing: "-0.01em" }}>
                    Al-Quran
                  </h2>
                  <span style={{ fontSize: 11, fontFamily: "'Geist Mono', monospace", color: "var(--islametra-fg-dim)", padding: "2px 8px", borderRadius: 999, background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)", border: "1px solid var(--islametra-line)" }}>
                    {quranBookmarks.length}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {quranBookmarks.map((b, i) => (
                    <motion.div
                      key={getKey(b)}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="group"
                      style={{
                        padding: "16px 20px", borderRadius: 14,
                        background: isLight ? "var(--islametra-bg-1)" : "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005)), var(--islametra-bg-1)",
                        border: "1px solid var(--islametra-line)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                            <span style={{ fontSize: 10, fontFamily: "'Geist Mono', monospace", padding: "2px 8px", borderRadius: 999, background: "oklch(0.62 0.13 155 / 0.1)", border: "1px solid oklch(0.62 0.13 155 / 0.2)", color: "oklch(0.85 0.1 155)" }}>
                              {b.surahName} : {b.ayahNumber}
                            </span>
                          </div>
                          <p className="font-arabic" lang="ar" dir="rtl" style={{ fontSize: 18, color: "var(--islametra-gold-soft)", lineHeight: 2, textAlign: "right", marginBottom: 8 }}>
                            {b.ayahText}
                          </p>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                          <Link href={`/quran/${b.surahNumber}`}>
                            <button style={{ padding: "6px", borderRadius: 8, border: "none", background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)", color: "var(--islametra-fg-dim)", cursor: "pointer", display: "flex", alignItems: "center" }} title={tb.titleOpenSurah}>
                              <ArrowRight size={13} />
                            </button>
                          </Link>
                          <button onClick={() => handleRemove(getKey(b), `${b.surahName}:${b.ayahNumber}`)} style={{ padding: "6px", borderRadius: 8, border: "none", background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)", color: "var(--islametra-fg-dim)", cursor: "pointer", display: "flex", alignItems: "center" }} title={tb.titleRemove}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Doa bookmarks */}
            {doaBookmarks.length > 0 && (
              <section>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: "oklch(0.62 0.13 155 / 0.12)", border: "1px solid oklch(0.62 0.13 155 / 0.22)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Heart size={13} style={{ color: "oklch(0.78 0.13 155)" }} />
                  </div>
                  <h2 style={{ fontSize: 14, fontWeight: 600, fontFamily: "'Geist', sans-serif", color: "var(--islametra-fg-soft)", letterSpacing: "-0.01em" }}>Doa</h2>
                  <span style={{ fontSize: 11, fontFamily: "'Geist Mono', monospace", color: "var(--islametra-fg-dim)", padding: "2px 8px", borderRadius: 999, background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)", border: "1px solid var(--islametra-line)" }}>
                    {doaBookmarks.length}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {doaBookmarks.map((b, i) => (
                    <motion.div
                      key={getKey(b)}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      style={{
                        padding: "16px 20px", borderRadius: 14,
                        background: isLight ? "var(--islametra-bg-1)" : "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005)), var(--islametra-bg-1)",
                        border: "1px solid var(--islametra-line)",
                        display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12,
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 500, color: "var(--islametra-fg-soft)", fontFamily: "'Geist', sans-serif", marginBottom: 8 }}>{b.title}</p>
                        <p className="font-arabic" lang="ar" dir="rtl" style={{ fontSize: 16, color: "var(--islametra-gold-soft)", lineHeight: 1.9, textAlign: "right", opacity: 0.8 }}>{b.arabic}</p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                        <Link href={`/doa/${b.slug}`}>
                          <button style={{ padding: "6px", borderRadius: 8, border: "none", background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)", color: "var(--islametra-fg-dim)", cursor: "pointer", display: "flex", alignItems: "center" }} title={tb.titleOpenDoa}>
                            <ArrowRight size={13} />
                          </button>
                        </Link>
                        <button onClick={() => handleRemove(getKey(b), b.title)} style={{ padding: "6px", borderRadius: 8, border: "none", background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)", color: "var(--islametra-fg-dim)", cursor: "pointer", display: "flex", alignItems: "center" }} title={tb.titleRemove}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {/* Hadith bookmarks */}
            {hadithBookmarks.length > 0 && (
              <section>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: "oklch(0.62 0.13 155 / 0.12)", border: "1px solid oklch(0.62 0.13 155 / 0.22)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Scroll size={13} style={{ color: "oklch(0.78 0.13 155)" }} />
                  </div>
                  <h2 style={{ fontSize: 14, fontWeight: 600, fontFamily: "'Geist', sans-serif", color: "var(--islametra-fg-soft)", letterSpacing: "-0.01em" }}>Hadits</h2>
                  <span style={{ fontSize: 11, fontFamily: "'Geist Mono', monospace", color: "var(--islametra-fg-dim)", padding: "2px 8px", borderRadius: 999, background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)", border: "1px solid var(--islametra-line)" }}>
                    {hadithBookmarks.length}
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {hadithBookmarks.map((b, i) => (
                    <motion.div
                      key={getKey(b)}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      style={{
                        padding: "16px 20px", borderRadius: 14,
                        background: isLight ? "var(--islametra-bg-1)" : "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005)), var(--islametra-bg-1)",
                        border: "1px solid var(--islametra-line)",
                        display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12,
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                          <span style={{ fontSize: 10, fontFamily: "'Geist Mono', monospace", padding: "2px 8px", borderRadius: 999, background: "oklch(0.82 0.08 80 / 0.1)", border: "1px solid oklch(0.82 0.08 80 / 0.2)", color: "var(--islametra-gold-soft)" }}>
                            {b.kitab} No. {b.number}
                          </span>
                        </div>
                        <p className="font-arabic" lang="ar" dir="rtl" style={{ fontSize: 17, color: "var(--islametra-gold-soft)", lineHeight: 2, textAlign: "right", opacity: 0.85 }}>{b.arab}</p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
                        <Link href={`/hadith/${b.kitab.toLowerCase()}`}>
                          <button style={{ padding: "6px", borderRadius: 8, border: "none", background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)", color: "var(--islametra-fg-dim)", cursor: "pointer", display: "flex", alignItems: "center" }} title={tb.titleOpenKitab}>
                            <ArrowRight size={13} />
                          </button>
                        </Link>
                        <button onClick={() => handleRemove(getKey(b), `${b.kitab} No.${b.number}`)} style={{ padding: "6px", borderRadius: 8, border: "none", background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)", color: "var(--islametra-fg-dim)", cursor: "pointer", display: "flex", alignItems: "center" }} title={tb.titleRemove}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

          </div>
        )}

        {/* Reading History */}
        {isSignedIn && history.length > 0 && (
          <section style={{ marginTop: 64 }}>
            <div style={{ height: 1, background: "linear-gradient(90deg, transparent, var(--islametra-line-strong), transparent)", marginBottom: 40 }} />
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "oklch(0.62 0.13 155 / 0.12)", border: "1px solid oklch(0.62 0.13 155 / 0.22)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Clock size={13} style={{ color: "oklch(0.78 0.13 155)" }} />
              </div>
              <h2 style={{ fontSize: 14, fontWeight: 600, fontFamily: "'Geist', sans-serif", color: "var(--islametra-fg-soft)", letterSpacing: "-0.01em" }}>
                Riwayat Baca
              </h2>
              <span style={{ fontSize: 11, fontFamily: "'Geist Mono', monospace", color: "var(--islametra-fg-dim)", padding: "2px 8px", borderRadius: 999, background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)", border: "1px solid var(--islametra-line)" }}>
                {history.length}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {history.map((item, i) => {
                const meta = item.metadata as Record<string, unknown> | null;
                let label = item.referenceId;
                let href = "/";
                let icon = <BookOpen size={13} />;
                if (item.type === "quran") {
                  label = `${meta?.surahName ?? "Surah"} (${meta?.totalAyahs ?? "?"} ayat)`;
                  href = `/quran/${meta?.surahNumber ?? ""}`;
                  icon = <BookOpen size={13} />;
                } else if (item.type === "hadith") {
                  label = `Hadits ${String(meta?.kitab ?? "").charAt(0).toUpperCase() + String(meta?.kitab ?? "").slice(1)}`;
                  href = `/hadith`;
                  icon = <Scroll size={13} />;
                } else if (item.type === "doa") {
                  label = String(meta?.title ?? item.referenceId);
                  href = `/doa`;
                  icon = <Heart size={13} />;
                }
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    style={{
                      padding: "14px 18px", borderRadius: 12,
                      background: isLight ? "var(--islametra-bg-1)" : "rgba(255,255,255,0.02)",
                      border: "1px solid var(--islametra-line)",
                      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ color: "var(--islametra-fg-dim)" }}>{icon}</span>
                      <span style={{ fontSize: 13, color: "var(--islametra-fg-soft)", fontFamily: "'Geist', sans-serif" }}>{label}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                      <span style={{ fontSize: 11, color: "var(--islametra-fg-dim)", fontFamily: "'Geist Mono', monospace" }}>
                        {new Date(item.lastReadAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                      </span>
                      <Link href={href}>
                        <button style={{ padding: "5px", borderRadius: 7, border: "none", background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)", color: "var(--islametra-fg-dim)", cursor: "pointer", display: "flex", alignItems: "center" }}>
                          <ArrowRight size={13} />
                        </button>
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}
      </section>
    </div>
  );
}

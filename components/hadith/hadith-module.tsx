"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Search, Bookmark, Copy, CheckCheck } from "lucide-react";
import { toast } from "react-hot-toast";
import { HADITH_KITAB } from "@/data/hadith-data";
import { useBookmarks } from "@/hooks/use-bookmarks";

interface HadithItem {
  arab: string;
  id_text: string;
  number: number;
  transliteration?: string;
}

const ARABIC_MAP: Record<string, string> = {
  "ا": "a", "أ": "a", "إ": "i", "آ": "ā",
  "ب": "b", "ت": "t", "ث": "ts",
  "ج": "j", "ح": "ḥ", "خ": "kh",
  "د": "d", "ذ": "dz",
  "ر": "r", "ز": "z",
  "س": "s", "ش": "sy",
  "ص": "ṣ", "ض": "ḍ",
  "ط": "ṭ", "ظ": "ẓ",
  "ع": "'", "غ": "gh",
  "ف": "f", "ق": "q",
  "ك": "k", "ل": "l",
  "م": "m", "ن": "n",
  "ه": "h", "و": "w",
  "ي": "y", "ى": "ā",
  "ة": "h", "ء": "'",
  "لا": "lā", "لأ": "la",
  // harakat (short vowels)
  "َ": "a", "ُ": "u", "ِ": "i",
  "ً": "an", "ٌ": "un", "ٍ": "in",
  "ْ": "", "ّ": "ّ",
  // misc
  "ـ": "",
};

function transliterateArabic(text: string): string {
  let result = "";
  let i = 0;
  while (i < text.length) {
    const two = text.slice(i, i + 2);
    if (ARABIC_MAP[two] !== undefined) {
      result += ARABIC_MAP[two];
      i += 2;
    } else {
      const ch = text[i];
      if (ch === "ّ" && result.length > 0) {
        result += result[result.length - 1];
      } else {
        result += ARABIC_MAP[ch] ?? (ch.charCodeAt(0) > 127 ? "" : ch);
      }
      i++;
    }
  }
  return result.replace(/\s+/g, " ").trim();
}

const HADITH_API = "https://api.hadith.gading.dev";

function SkeletonCard({ isLight }: { isLight: boolean }) {
  return (
    <div
      style={{
        padding: 24,
        borderRadius: 16,
        background:
          isLight ? "var(--islamiva-bg-1)" : "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005)), var(--islamiva-bg-1)",
        border: "1px solid var(--islamiva-line)",
      }}
    >
      <div
        style={{
          height: 20,
          borderRadius: 6,
          background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)",
          marginBottom: 16,
          width: "40%",
        }}
      />
      <div
        style={{
          height: 60,
          borderRadius: 8,
          background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.03)",
          marginBottom: 16,
        }}
      />
      <div
        style={{
          height: 14,
          borderRadius: 4,
          background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.03)",
          marginBottom: 8,
          width: "80%",
        }}
      />
      <div
        style={{
          height: 14,
          borderRadius: 4,
          background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.03)",
          width: "60%",
        }}
      />
    </div>
  );
}

export function HadithModule() {
  const [activeKitab, setActiveKitab] = useState("bukhari");
  const [hadiths, setHadiths] = useState<HadithItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const isLight = mounted && theme === "light";
  const { isBookmarked, toggle: toggleBookmark } = useBookmarks();

  useEffect(() => { setMounted(true); }, []);

  const fetchHadiths = useCallback(async (kitab: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${HADITH_API}/books/${kitab}?range=1-20`);
      const data = await res.json();
      if (data.data?.hadiths) {
        setHadiths(
          data.data.hadiths.map((h: HadithItem) => ({
            ...h,
            transliteration: transliterateArabic(h.arab),
          }))
        );
      }
    } catch {
      toast.error("Gagal memuat hadits");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHadiths(activeKitab);
  }, [activeKitab, fetchHadiths]);

  const filtered = hadiths.filter((h) => {
    if (!search) return true;
    return (
      h.id_text?.toLowerCase().includes(search.toLowerCase()) ||
      h.arab?.includes(search)
    );
  });

  const handleCopy = (h: HadithItem) => {
    navigator.clipboard.writeText(
      `${h.arab}\n\n${h.id_text}\n\n(HR. ${HADITH_KITAB.find((k) => k.id === activeKitab)?.name}, No. ${h.number})`
    );
    setCopiedId(String(h.number));
    toast.success("Hadits berhasil disalin!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleBookmark = (hadith: HadithItem) => {
    const added = toggleBookmark({
      type: "hadith",
      kitab: activeKitab,
      number: hadith.number,
      arab: hadith.arab,
      createdAt: new Date().toISOString(),
    });
    toast.success(added ? "Hadits di-bookmark!" : "Bookmark dihapus");
  };

  const currentKitab = HADITH_KITAB.find((k) => k.id === activeKitab);

  return (
    <div style={{ backgroundColor: "var(--islamiva-bg)", minHeight: "100vh" }}>
      {/* Hero */}
      <section
        style={{
          position: "relative",
          padding: "clamp(80px, 12vw, 140px) 28px clamp(60px, 8vw, 100px)",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
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
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              borderRadius: 9999,
              background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.03)",
              border: "1px solid var(--islamiva-line)",
              color: "var(--islamiva-fg-soft)",
              fontSize: 11,
              fontWeight: 500,
              fontFamily: "'Geist Mono', monospace",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: 20,
            }}
          >
            <span
              style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--islamiva-gold)", flexShrink: 0 }}
            />
            6 Kitab Shahih
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            style={{
              fontFamily: "'Geist', sans-serif",
              fontWeight: 500,
              fontSize: "clamp(36px, 5vw, 64px)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "var(--islamiva-fg)",
              marginBottom: 20,
            }}
          >
            Hadits{" "}
            <em
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                fontWeight: 400,
                color: "var(--islamiva-gold)",
              }}
            >
              Nabi ﷺ
            </em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              fontSize: "clamp(15px, 1.8vw, 18px)",
              color: "var(--islamiva-fg-mute)",
              lineHeight: 1.65,
              maxWidth: 520,
              margin: "0 auto",
            }}
          >
            Kumpulan hadits shahih dari kitab-kitab terpercaya dengan terjemahan bahasa Indonesia dan informasi perawi.
          </motion.p>
        </div>
      </section>

      <div
        style={{
          height: 1,
          background: "linear-gradient(90deg, transparent, var(--islamiva-line-strong), transparent)",
        }}
      />

      {/* Content */}
      <section style={{ maxWidth: 1240, margin: "0 auto", padding: "clamp(48px, 7vw, 80px) 28px" }}>
        {/* Kitab selector */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 12,
            marginBottom: 32,
          }}
        >
          {HADITH_KITAB.map((kitab) => (
            <button
              key={kitab.id}
              onClick={() => setActiveKitab(kitab.id)}
              style={{
                padding: "16px 12px",
                borderRadius: 16,
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.2s",
                ...(activeKitab === kitab.id
                  ? {
                      background:
                        isLight ? "var(--islamiva-bg-1)" : "linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.01)), var(--islamiva-bg-1)",
                      border: "1px solid oklch(0.82 0.08 80 / 0.5)",
                      boxShadow: "0 0 20px -8px oklch(0.82 0.08 80 / 0.3)",
                    }
                  : {
                      background:
                        isLight ? "var(--islamiva-bg-1)" : "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.005)), var(--islamiva-bg-1)",
                      border: "1px solid var(--islamiva-line)",
                    }),
              }}
            >
              <p
                className="font-arabic"
                style={{
                  fontSize: 18,
                  color: activeKitab === kitab.id ? "var(--islamiva-gold)" : "var(--islamiva-gold-soft)",
                  lineHeight: 1.6,
                  marginBottom: 6,
                  opacity: activeKitab === kitab.id ? 1 : 0.7,
                }}
              >
                {kitab.nameAr}
              </p>
              <p
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: activeKitab === kitab.id ? "var(--islamiva-fg)" : "var(--islamiva-fg-soft)",
                  fontFamily: "'Geist', sans-serif",
                  marginBottom: 4,
                }}
              >
                {kitab.name}
              </p>
              <p
                style={{
                  fontSize: 10,
                  color: "var(--islamiva-fg-dim)",
                  fontFamily: "'Geist Mono', monospace",
                  letterSpacing: "0.02em",
                }}
              >
                {kitab.available.toLocaleString()} hadits
              </p>
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: 24 }}>
          <Search
            size={15}
            style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--islamiva-fg-dim)",
              pointerEvents: "none",
            }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari hadits..."
            style={{
              width: "100%",
              padding: "12px 14px 12px 40px",
              borderRadius: 12,
              background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.03)",
              border: "1px solid var(--islamiva-line)",
              color: "var(--islamiva-fg)",
              fontSize: 14,
              fontFamily: "'Geist', sans-serif",
              outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "oklch(0.82 0.08 80 / 0.5)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--islamiva-line)";
            }}
          />
        </div>

        {/* Kitab info bar */}
        {currentKitab && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 24,
              padding: "14px 20px",
              borderRadius: 12,
              background: isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.02)",
              border: "1px solid var(--islamiva-line)",
            }}
          >
            <div style={{ flex: 1 }}>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--islamiva-fg-soft)",
                  fontFamily: "'Geist', sans-serif",
                }}
              >
                {currentKitab.name}
              </p>
              <p
                style={{
                  fontSize: 11,
                  color: "var(--islamiva-fg-dim)",
                  fontFamily: "'Geist Mono', monospace",
                  marginTop: 2,
                }}
              >
                {currentKitab.available.toLocaleString()} hadits tersedia · Menampilkan 20 pertama
              </p>
            </div>
            <p
              className="font-arabic"
              style={{
                fontSize: 20,
                color: "var(--islamiva-gold-soft)",
                lineHeight: 1.5,
              }}
            >
              {currentKitab.nameAr}
            </p>
          </div>
        )}

        {/* Hadith list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} isLight={isLight} />)
            : filtered.map((hadith, i) => {
                const bookmarkKey = `hadith-${activeKitab}-${hadith.number}`;
                const isHadithBookmarked = isBookmarked(bookmarkKey);

                return (
                  <motion.div
                    key={hadith.number}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.03, 0.4) }}
                    className="group"
                    style={{
                      padding: 24,
                      borderRadius: 16,
                      background:
                        isLight ? "var(--islamiva-bg-1)" : "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005)), var(--islamiva-bg-1)",
                      border: "1px solid var(--islamiva-line)",
                      transition: "border-color 0.2s",
                    }}
                  >
                    {/* Card header */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 16,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          fontFamily: "'Geist Mono', monospace",
                          padding: "4px 10px",
                          borderRadius: 6,
                          background: "oklch(0.82 0.08 80 / 0.12)",
                          border: "1px solid oklch(0.82 0.08 80 / 0.2)",
                          color: "var(--islamiva-gold-soft)",
                          letterSpacing: "0.03em",
                        }}
                      >
                        No. {hadith.number}
                      </span>
                      <div
                        className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ display: "flex", alignItems: "center", gap: 8 }}
                      >
                        <button
                          onClick={() => handleBookmark(hadith)}
                          style={{
                            padding: "6px",
                            borderRadius: 8,
                            border: "none",
                            background: "none",
                            color: isHadithBookmarked ? "var(--islamiva-gold)" : "var(--islamiva-fg-dim)",
                            cursor: "pointer",
                            transition: "color 0.2s",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Bookmark
                            size={14}
                            fill={isHadithBookmarked ? "currentColor" : "none"}
                          />
                        </button>
                        <button
                          onClick={() => handleCopy(hadith)}
                          style={{
                            padding: "6px",
                            borderRadius: 8,
                            border: "none",
                            background: "none",
                            color:
                              copiedId === String(hadith.number)
                                ? "var(--islamiva-gold)"
                                : "var(--islamiva-fg-dim)",
                            cursor: "pointer",
                            transition: "color 0.2s",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {copiedId === String(hadith.number) ? (
                            <CheckCheck size={14} />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Arabic */}
                    <div
                      style={{
                        padding: "16px 20px",
                        borderRadius: 12,
                        background:
                          "linear-gradient(180deg, oklch(0.82 0.08 80 / 0.06), transparent)",
                        border: "1px solid oklch(0.82 0.08 80 / 0.12)",
                        marginBottom: 16,
                      }}
                    >
                      <p
                        className="font-arabic"
                        lang="ar"
                        dir="rtl"
                        style={{
                          fontSize: 20,
                          lineHeight: 1.9,
                          color: "var(--islamiva-gold-soft)",
                        }}
                      >
                        {hadith.arab}
                      </p>
                    </div>

                    {/* Transliteration */}
                    {hadith.transliteration && (
                      <div
                        style={{
                          paddingTop: 12,
                          paddingBottom: 14,
                          borderTop: "1px dashed var(--islamiva-line)",
                        }}
                      >
                        <p
                          style={{
                            fontSize: 13,
                            fontStyle: "italic",
                            lineHeight: 1.75,
                            color: "var(--islamiva-fg-dim)",
                            fontFamily: "'Geist', sans-serif",
                            letterSpacing: "0.01em",
                          }}
                        >
                          {hadith.transliteration}
                        </p>
                      </div>
                    )}

                    {/* Translation */}
                    <div
                      style={{
                        paddingTop: 14,
                        borderTop: "1px dashed var(--islamiva-line)",
                      }}
                    >
                      <p
                        style={{
                          fontSize: 13.5,
                          lineHeight: 1.7,
                          color: "var(--islamiva-fg-mute)",
                        }}
                      >
                        {hadith.id_text}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
        </div>

        {filtered.length === 0 && !loading && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ color: "var(--islamiva-fg-mute)", fontSize: 14 }}>Hadits tidak ditemukan</p>
          </div>
        )}
      </section>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Search, BookOpen, Heart, Scroll, X, ArrowRight, Star, Clock } from "lucide-react";
import { SURAH_LIST } from "@/data/quran-data";
import { DAILY_DUAS, DOA_CATEGORIES } from "@/data/doa-data";
import { PROPHETS } from "@/data/prophet-stories";
import { useLang } from "@/contexts/language-context";
import { translations } from "@/lib/translations";

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

type ResultType = "quran" | "doa" | "hadith" | "story" | "sejarah";

interface SearchResult {
  type: ResultType;
  title: string;
  subtitle: string;
  url: string;
}

const TYPE_ICONS: Record<ResultType, React.ElementType> = {
  quran: BookOpen,
  doa: Heart,
  hadith: Scroll,
  story: Star,
  sejarah: Clock,
};

const TYPE_COLORS: Record<ResultType, string> = {
  quran: "oklch(0.78 0.13 155)",
  doa: "oklch(0.75 0.15 20)",
  hadith: "oklch(0.82 0.08 80)",
  story: "oklch(0.82 0.12 290)",
  sejarah: "oklch(0.82 0.1 60)",
};

// TYPE_LABELS is now derived from translations inside the component

// Static sejarah entries for search
const SEJARAH_ENTRIES = [
  { slug: "abu-bakar-ash-shiddiq", title: "Abu Bakar Ash-Shiddiq RA", period: "573 – 634 M" },
  { slug: "umar-bin-khattab", title: "Umar bin Khattab RA", period: "584 – 644 M" },
  { slug: "utsman-bin-affan", title: "Utsman bin Affan RA", period: "579 – 656 M" },
  { slug: "ali-bin-abi-thalib", title: "Ali bin Abi Thalib RA", period: "601 – 661 M" },
  { slug: "dinasti-umayyah", title: "Dinasti Umayyah", period: "661 – 750 M" },
  { slug: "dinasti-abbasiyah", title: "Dinasti Abbasiyah", period: "750 – 1258 M" },
  { slug: "kekhalifahan-utsmani", title: "Kekhalifahan Utsmani", period: "1299 – 1924 M" },
  { slug: "islam-di-andalusia", title: "Kejayaan Islam di Andalusia", period: "711 – 1492 M" },
  { slug: "imam-al-ghazali", title: "Imam Al-Ghazali", period: "1058 – 1111 M" },
  { slug: "ibnu-sina", title: "Ibnu Sina (Avicenna)", period: "980 – 1037 M" },
  { slug: "al-khawarizmi", title: "Al-Khawarizmi — Bapak Aljabar", period: "780 – 850 M" },
  { slug: "ibnu-khaldun", title: "Ibnu Khaldun", period: "1332 – 1406 M" },
  { slug: "islam-di-indonesia", title: "Masuknya Islam ke Indonesia", period: "Abad ke-7 M" },
  { slug: "islam-asia-tenggara", title: "Islam di Asia Tenggara", period: "Abad ke-13 M" },
  { slug: "islam-di-afrika", title: "Islam di Afrika", period: "Abad ke-7 M" },
  { slug: "islam-di-eropa", title: "Islam di Eropa", period: "Abad ke-7 M" },
];

const DOA_CATEGORY_MAP = Object.fromEntries(
  DOA_CATEGORIES.map((c) => [c.id, c.nameId])
);

function searchAll(q: string): SearchResult[] {
  if (!q.trim()) return [];
  const lower = q.toLowerCase();
  const results: SearchResult[] = [];

  // Quran — search by name, translation, number
  SURAH_LIST.filter(
    (s) =>
      s.name.toLowerCase().includes(lower) ||
      s.nameTranslation.toLowerCase().includes(lower) ||
      s.nameArabic.includes(q) ||
      s.number.toString().startsWith(q)
  )
    .slice(0, 4)
    .forEach((s) =>
      results.push({
        type: "quran",
        title: s.name,
        subtitle: `${s.nameTranslation} · ${s.numberOfAyahs} ayat`,
        url: `/quran/${s.number}`,
      })
    );

  // Doa — search by title, latin, translation
  DAILY_DUAS.filter(
    (d) =>
      d.title.toLowerCase().includes(lower) ||
      d.latin.toLowerCase().includes(lower) ||
      d.translation.toLowerCase().includes(lower)
  )
    .slice(0, 3)
    .forEach((d) =>
      results.push({
        type: "doa",
        title: d.title,
        subtitle: DOA_CATEGORY_MAP[d.category] ?? d.category,
        url: `/doa/${d.slug}`,
      })
    );

  // Kisah Nabi
  PROPHETS.filter(
    (p) =>
      p.prophetName.toLowerCase().includes(lower) ||
      p.title.toLowerCase().includes(lower)
  )
    .slice(0, 2)
    .forEach((p) =>
      results.push({
        type: "story",
        title: p.prophetName,
        subtitle: p.title,
        url: `/kisah-nabi/${p.slug}`,
      })
    );

  // Sejarah
  SEJARAH_ENTRIES.filter(
    (a) =>
      a.title.toLowerCase().includes(lower) ||
      a.slug.replace(/-/g, " ").includes(lower)
  )
    .slice(0, 2)
    .forEach((a) =>
      results.push({
        type: "sejarah",
        title: a.title,
        subtitle: a.period,
        url: `/sejarah/${a.slug}`,
      })
    );

  return results.slice(0, 8);
}

// Highlight matched substring
function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, idx)}
      <span style={{ color: "oklch(0.85 0.1 155)", fontWeight: 600 }}>
        {text.slice(idx, idx + query.length)}
      </span>
      {text.slice(idx + query.length)}
    </>
  );
}

// SUGGESTED is now derived from translations inside the component

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(-1);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { theme } = useTheme();
  const isLight = mounted && theme === "light";
  const { lang } = useLang();
  const ts = translations[lang].searchDialog;
  const TYPE_LABELS = ts.typeLabels as Record<ResultType, string>;
  const SUGGESTED = ts.suggestions;

  useEffect(() => { setMounted(true); }, []);

  const results = useMemo(() => searchAll(query), [query]);

  // Reset on open
  useEffect(() => {
    if (open) {
      setQuery("");
      setFocused(-1);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // ESC to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocused((f) => Math.min(f + 1, results.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocused((f) => Math.max(f - 1, -1));
      }
      if (e.key === "Enter" && focused >= 0 && results[focused]) {
        router.push(results[focused].url);
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose, focused, results, router]);

  const handleSelect = (url: string) => {
    router.push(url);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed", inset: 0, zIndex: 60,
              backgroundColor: "rgba(0,0,0,0.75)",
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
            }}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ duration: 0.15, ease: [0.2, 0.8, 0.2, 1] }}
            style={{
              position: "fixed",
              top: "clamp(60px, 10vh, 120px)",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 60,
              width: "100%",
              maxWidth: 580,
              padding: "0 16px",
            }}
          >
            <div
              style={{
                backgroundColor: isLight ? "rgba(250,249,246,0.98)" : "rgba(14,18,15,0.98)",
                borderRadius: 20,
                boxShadow: "0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px var(--islametra-line-strong)",
                border: "1px solid var(--islametra-line-strong)",
                overflow: "hidden",
              }}
            >
              {/* Input row */}
              <div
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "14px 18px",
                  borderBottom: query || results.length > 0 ? "1px solid var(--islametra-line)" : "none",
                }}
              >
                <Search size={17} style={{ color: query ? "oklch(0.78 0.13 155)" : "var(--islametra-fg-dim)", flexShrink: 0, transition: "color 0.2s" }} />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setFocused(-1); }}
                  placeholder={ts.placeholder}
                  style={{
                    flex: 1, background: "transparent", border: "none", outline: "none",
                    color: "var(--islametra-fg)", fontSize: 15,
                    fontFamily: "'Geist', sans-serif",
                  }}
                />
                {query ? (
                  <button
                    onClick={() => { setQuery(""); setFocused(-1); inputRef.current?.focus(); }}
                    aria-label="Hapus pencarian"
                    style={{
                      width: 24, height: 24, borderRadius: 6, border: "none",
                      background: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)",
                      color: "var(--islametra-fg-dim)", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                    }}
                  >
                    <X size={13} />
                  </button>
                ) : (
                  <kbd
                    style={{
                      padding: "3px 8px", fontSize: 10,
                      color: "var(--islametra-fg-dim)", background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)",
                      borderRadius: 6, border: "1px solid var(--islametra-line)",
                      fontFamily: "'Geist Mono', monospace", letterSpacing: "0.04em", flexShrink: 0,
                    }}
                  >
                    ESC
                  </kbd>
                )}
              </div>

              {/* Results */}
              <AnimatePresence mode="wait">
                {query && results.length > 0 && (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                    style={{ maxHeight: 380, overflowY: "auto", padding: "6px 8px 8px" }}
                  >
                    {results.map((result, i) => {
                      const Icon = TYPE_ICONS[result.type];
                      const isFocused = focused === i;
                      return (
                        <button
                          key={`${result.type}-${result.url}`}
                          onClick={() => handleSelect(result.url)}
                          onMouseEnter={() => setFocused(i)}
                          style={{
                            width: "100%", display: "flex", alignItems: "center",
                            gap: 12, padding: "10px 12px", borderRadius: 11,
                            border: "none", cursor: "pointer", textAlign: "left",
                            background: isFocused ? (isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)") : "transparent",
                            transition: "background 0.1s",
                          }}
                        >
                          <div
                            style={{
                              width: 32, height: 32, borderRadius: 9, flexShrink: 0,
                              background: `${TYPE_COLORS[result.type]}18`,
                              border: `1px solid ${TYPE_COLORS[result.type]}30`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                            }}
                          >
                            <Icon size={14} style={{ color: TYPE_COLORS[result.type] }} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{ fontSize: 13, fontWeight: 500, color: "var(--islametra-fg-soft)", fontFamily: "'Geist', sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                              <Highlight text={result.title} query={query} />
                            </p>
                            <p style={{ fontSize: 11, color: "var(--islametra-fg-dim)", fontFamily: "'Geist', sans-serif", marginTop: 1 }}>
                              <span style={{ color: TYPE_COLORS[result.type], opacity: 0.7, marginRight: 4 }}>{TYPE_LABELS[result.type]}</span>
                              {result.subtitle}
                            </p>
                          </div>
                          <ArrowRight size={13} style={{ color: "var(--islametra-fg-dim)", flexShrink: 0, opacity: isFocused ? 1 : 0, transition: "opacity 0.1s" }} />
                        </button>
                      );
                    })}
                  </motion.div>
                )}

                {query && results.length === 0 && (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ padding: "36px 16px", textAlign: "center" }}
                  >
                    <p style={{ fontSize: 24, marginBottom: 8 }}>🔍</p>
                    <p style={{ fontSize: 13, color: "var(--islametra-fg-mute)", fontFamily: "'Geist', sans-serif" }}>
                      {ts.empty} <strong style={{ color: "var(--islametra-fg-soft)" }}>&ldquo;{query}&rdquo;</strong>
                    </p>
                  </motion.div>
                )}

                {!query && (
                  <motion.div
                    key="suggested"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{ padding: "12px 16px 16px" }}
                  >
                    <p style={{ fontSize: 10, fontFamily: "'Geist Mono', monospace", letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--islametra-fg-dim)", marginBottom: 10 }}>
                      {ts.suggested}
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {SUGGESTED.map((s) => (
                        <button
                          key={s}
                          onClick={() => setQuery(s)}
                          style={{
                            padding: "5px 13px", fontSize: 12, borderRadius: 999,
                            background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)",
                            border: "1px solid var(--islametra-line)",
                            color: "var(--islametra-fg-mute)", cursor: "pointer",
                            fontFamily: "'Geist', sans-serif", transition: "border-color 0.15s, color 0.15s, background 0.15s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = "oklch(0.62 0.13 155 / 0.5)";
                            e.currentTarget.style.color = "var(--islametra-fg-soft)";
                            e.currentTarget.style.background = "oklch(0.62 0.13 155 / 0.06)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = "var(--islametra-line)";
                            e.currentTarget.style.color = "var(--islametra-fg-mute)";
                            e.currentTarget.style.background = isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)";
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Footer hint */}
              {results.length > 0 && (
                <div
                  style={{
                    padding: "8px 18px",
                    borderTop: "1px solid var(--islametra-line)",
                    display: "flex", alignItems: "center", gap: 12,
                  }}
                >
                  <span style={{ fontSize: 10, color: "var(--islametra-fg-dim)", fontFamily: "'Geist Mono', monospace" }}>
                    {ts.navigate}
                  </span>
                  <span style={{ fontSize: 10, color: "var(--islametra-fg-dim)", fontFamily: "'Geist Mono', monospace" }}>
                    {ts.open}
                  </span>
                  <span style={{ fontSize: 10, color: "var(--islametra-fg-dim)", fontFamily: "'Geist Mono', monospace" }}>
                    {ts.close}
                  </span>
                  <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--islametra-fg-dim)", fontFamily: "'Geist Mono', monospace" }}>
                    {results.length} {ts.results}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { Search, Copy, CheckCheck, Heart, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "react-hot-toast";
import { DAILY_DUAS, DOA_CATEGORIES } from "@/data/doa-data";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { useLang } from "@/contexts/language-context";
import { translations } from "@/lib/translations";

export function DoaModule() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const isLight = mounted && theme === "light";
  const { isBookmarked, toggle: toggleBookmark } = useBookmarks();
  const { lang } = useLang();
  const td = translations[lang].doaModule;
  useEffect(() => { setMounted(true); }, []);

  const filtered = useMemo(() => {
    return DAILY_DUAS.filter((doa) => {
      const matchSearch =
        doa.title.toLowerCase().includes(search.toLowerCase()) ||
        doa.translation.toLowerCase().includes(search.toLowerCase());
      const matchCat = activeCategory === "all" || doa.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [search, activeCategory]);

  const handleCopy = (doa: (typeof DAILY_DUAS)[0]) => {
    navigator.clipboard.writeText(
      `${doa.title}\n\n${doa.arabic}\n\n${doa.latin}\n\n${td.meaning} ${doa.translation}\n\nSumber: ${doa.source}`
    );
    setCopiedId(doa.id);
    toast.success(td.toastCopied);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleFavorite = async (doa: (typeof DAILY_DUAS)[0]) => {
    const added = await toggleBookmark({
      type: "doa",
      slug: doa.slug,
      title: doa.title,
      arabic: doa.arabic,
      createdAt: new Date().toISOString(),
    });
    toast.success(added ? td.toastBookmarked : td.toastUnbookmarked);
  };

  return (
    <div style={{ backgroundColor: "var(--islametra-bg)", minHeight: "100vh" }}>
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
            background: "radial-gradient(ellipse, oklch(0.62 0.13 155 / 0.12), transparent 70%)",
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
              background: "rgba(255,255,255,0.03)",
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
              style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--islametra-emerald)", flexShrink: 0 }}
            />
            {td.badge}
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
              color: "var(--islametra-fg)",
              marginBottom: 20,
            }}
          >
            Doa{" "}
            <em
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                fontWeight: 400,
                color: "var(--islametra-emerald-soft)",
              }}
            >
              {td.titleEm}
            </em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              fontSize: "clamp(15px, 1.8vw, 18px)",
              color: "var(--islametra-fg-mute)",
              lineHeight: 1.65,
              maxWidth: 520,
              margin: "0 auto",
            }}
          >
            {td.sub}
          </motion.p>
        </div>
      </section>

      <div
        style={{
          height: 1,
          background: "linear-gradient(90deg, transparent, var(--islametra-line-strong), transparent)",
        }}
      />

      {/* Content */}
      <section style={{ maxWidth: 860, margin: "0 auto", padding: "clamp(48px, 7vw, 80px) 28px" }}>
        {/* Category filters */}
        <div
          className="scrollbar-hide"
          style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}
        >
          <button
            onClick={() => setActiveCategory("all")}
            style={{
              padding: "8px 16px",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 500,
              fontFamily: "'Geist', sans-serif",
              cursor: "pointer",
              transition: "all 0.2s",
              ...(activeCategory === "all"
                ? {
                    background:
                      "linear-gradient(180deg, oklch(0.7 0.13 155) 0%, oklch(0.55 0.12 155) 100%)",
                    color: "#08110b",
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.25), 0 6px 18px -8px oklch(0.62 0.13 155 / 0.5)",
                    border: "1px solid transparent",
                  }
                : {
                    background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.03)",
                    border: "1px solid var(--islametra-line)",
                    color: "var(--islametra-fg-mute)",
                  }),
            }}
          >
            {td.allDoa}
          </button>
          {DOA_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                borderRadius: 10,
                fontSize: 13,
                fontWeight: 500,
                fontFamily: "'Geist', sans-serif",
                cursor: "pointer",
                transition: "all 0.2s",
                ...(activeCategory === cat.id
                  ? {
                      background:
                        "linear-gradient(180deg, oklch(0.7 0.13 155) 0%, oklch(0.55 0.12 155) 100%)",
                      color: "#08110b",
                      boxShadow:
                        "inset 0 1px 0 rgba(255,255,255,0.25), 0 6px 18px -8px oklch(0.62 0.13 155 / 0.5)",
                      border: "1px solid transparent",
                    }
                  : {
                      background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.03)",
                      border: "1px solid var(--islametra-line)",
                      color: "var(--islametra-fg-mute)",
                    }),
              }}
            >
              <span>{cat.icon}</span>
              {cat.nameId}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: 28 }}>
          <Search
            size={15}
            style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--islametra-fg-dim)",
              pointerEvents: "none",
            }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={td.searchPlaceholder}
            className="islametra-input"
            style={{
              width: "100%",
              padding: "12px 14px 12px 40px",
              borderRadius: 12,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid var(--islametra-line)",
              color: "var(--islametra-fg)",
              fontSize: 14,
              fontFamily: "'Geist', sans-serif",
              outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "oklch(0.62 0.13 155 / 0.5)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "var(--islametra-line)";
            }}
          />
        </div>

        {/* Doa list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <AnimatePresence mode="popLayout">
            {filtered.map((doa) => {
              const isExpanded = expandedId === doa.id;
              const isFav = isBookmarked(`doa-${doa.slug}`);
              const categoryIcon =
                DOA_CATEGORIES.find((c) => c.id === doa.category)?.icon || "🤲";

              return (
                <motion.div
                  key={doa.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  style={{
                    borderRadius: 16,
                    background:
                      isLight ? "var(--islametra-bg-1)" : "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005)), var(--islametra-bg-1)",
                    border: "1px solid var(--islametra-line)",
                    overflow: "hidden",
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "16px 20px",
                      cursor: "pointer",
                    }}
                    onClick={() => setExpandedId(isExpanded ? null : doa.id)}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
                          background: "oklch(0.62 0.13 155 / 0.1)",
                          border: "1px solid oklch(0.62 0.13 155 / 0.2)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 16,
                          flexShrink: 0,
                        }}
                      >
                        {categoryIcon}
                      </div>
                      <div>
                        <h3
                          style={{
                            fontSize: 14,
                            fontWeight: 500,
                            color: "var(--islametra-fg)",
                            fontFamily: "'Geist', sans-serif",
                          }}
                        >
                          {doa.title}
                        </h3>
                        <p
                          style={{
                            fontSize: 11,
                            color: "var(--islametra-fg-dim)",
                            fontFamily: "'Geist Mono', monospace",
                            letterSpacing: "0.03em",
                            marginTop: 2,
                          }}
                        >
                          {doa.source}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(doa);
                        }}
                        aria-label={isFav ? "Hapus favorit" : "Tambah ke favorit"}
                        style={{
                          padding: "6px",
                          borderRadius: 8,
                          border: "none",
                          background: "none",
                          color: isFav ? "oklch(0.7 0.2 20)" : "var(--islametra-fg-dim)",
                          cursor: "pointer",
                          transition: "color 0.2s",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Heart size={14} fill={isFav ? "currentColor" : "none"} />
                      </button>
                      {isExpanded ? (
                        <ChevronUp size={14} style={{ color: "var(--islametra-fg-dim)" }} />
                      ) : (
                        <ChevronDown size={14} style={{ color: "var(--islametra-fg-dim)" }} />
                      )}
                    </div>
                  </div>

                  {/* Expanded content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ overflow: "hidden" }}
                      >
                        <div
                          style={{
                            padding: "20px 20px 20px",
                            borderTop: "1px solid var(--islametra-line)",
                          }}
                        >
                          {/* Arabic */}
                          <div
                            style={{
                              padding: "20px",
                              borderRadius: 12,
                              background:
                                "radial-gradient(ellipse 80% 60% at 50% 0%, oklch(0.62 0.13 155 / 0.06), transparent 60%)",
                              border: "1px solid oklch(0.62 0.13 155 / 0.15)",
                              marginBottom: 16,
                              textAlign: "center",
                            }}
                          >
                            <p
                              className="font-arabic"
                              lang="ar"
                              dir="rtl"
                              style={{
                                fontSize: "clamp(20px, 3vw, 30px)",
                                color: "var(--islametra-gold-soft)",
                                lineHeight: 2,
                                opacity: 0.9,
                              }}
                            >
                              {doa.arabic}
                            </p>
                          </div>

                          {/* Latin */}
                          <p
                            style={{
                              fontSize: 13,
                              fontStyle: "italic",
                              color: "var(--islametra-fg-mute)",
                              lineHeight: 1.7,
                              textAlign: "center",
                              marginBottom: 16,
                            }}
                          >
                            {doa.latin}
                          </p>

                          {/* Translation */}
                          <div
                            style={{
                              padding: 14,
                              borderRadius: 10,
                              background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.03)",
                              border: "1px solid var(--islametra-line)",
                              marginBottom: 16,
                            }}
                          >
                            <p style={{ fontSize: 13.5, lineHeight: 1.65, color: "var(--islametra-fg-soft)" }}>
                              <span style={{ fontWeight: 600, color: "oklch(0.78 0.13 155)" }}>
                                {td.meaning}{" "}
                              </span>
                              {doa.translation}
                            </p>
                          </div>

                          {/* Actions */}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              paddingTop: 12,
                              borderTop: "1px solid var(--islametra-line)",
                            }}
                          >
                            <span
                              style={{
                                fontSize: 11,
                                fontFamily: "'Geist Mono', monospace",
                                padding: "4px 10px",
                                borderRadius: 6,
                                background: "oklch(0.62 0.13 155 / 0.12)",
                                border: "1px solid oklch(0.62 0.13 155 / 0.2)",
                                color: "oklch(0.85 0.1 155)",
                                letterSpacing: "0.03em",
                              }}
                            >
                              {doa.source}
                            </span>
                            <button
                              onClick={() => handleCopy(doa)}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                fontSize: 12,
                                fontWeight: 500,
                                color:
                                  copiedId === doa.id
                                    ? "oklch(0.78 0.13 155)"
                                    : "var(--islametra-fg-mute)",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                transition: "color 0.2s",
                              }}
                            >
                              {copiedId === doa.id ? (
                                <CheckCheck size={13} />
                              ) : (
                                <Copy size={13} />
                              )}
                              {copiedId === doa.id ? td.copied : td.copy}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <p style={{ fontSize: 40, marginBottom: 12 }}>🤲</p>
              <p style={{ color: "var(--islametra-fg-mute)", fontSize: 14 }}>{td.notFound}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

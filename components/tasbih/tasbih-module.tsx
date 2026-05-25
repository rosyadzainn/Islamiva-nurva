"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { useLang } from "@/contexts/language-context";
import { translations } from "@/lib/translations";
import { trackEvent } from "@/lib/analytics";

const DHIKR_LIST = [
  {
    id: "subhanallah",
    nameId: "SubhanAllah",
    arabic: "سُبْحَانَ اللَّهِ",
    meaning: "Maha Suci Allah",
  },
  {
    id: "alhamdulillah",
    nameId: "Alhamdulillah",
    arabic: "اَلْحَمْدُ لِلَّهِ",
    meaning: "Segala Puji Bagi Allah",
  },
  {
    id: "allahuakbar",
    nameId: "Allahu Akbar",
    arabic: "اللَّهُ أَكْبَرُ",
    meaning: "Allah Maha Besar",
  },
  {
    id: "lailahaillallah",
    nameId: "La ilaha illallah",
    arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ",
    meaning: "Tiada Tuhan Selain Allah",
  },
  {
    id: "astaghfirullah",
    nameId: "Astaghfirullah",
    arabic: "أَسْتَغْفِرُ اللَّهَ",
    meaning: "Aku Mohon Ampun kepada Allah",
  },
];

const TARGET_OPTIONS = [33, 99, 100];

function vibrate(pattern: number | number[]) {
  if (typeof navigator !== "undefined" && navigator.vibrate) {
    navigator.vibrate(pattern);
  }
}

const TASBIH_KEY = "islametra_tasbih";

function loadTasbihState() {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem(TASBIH_KEY) ?? "null");
  } catch {
    return null;
  }
}

export function TasbihModule() {
  const saved = typeof window !== "undefined" ? loadTasbihState() : null;
  const [count, setCount] = useState<number>(saved?.count ?? 0);
  const [selectedDhikr, setSelectedDhikr] = useState(
    DHIKR_LIST.find((d) => d.id === saved?.dhikrId) ?? DHIKR_LIST[0]
  );
  const [target, setTarget] = useState<number>(saved?.target ?? 33);
  const [customTarget, setCustomTarget] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [celebrated, setCelebrated] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const isLight = mounted && theme === "light";
  const { lang } = useLang();
  const tt = translations[lang].tasbih;
  const celebrateTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sessionStartedRef = useRef(false);

  const effectiveTarget = showCustom
    ? parseInt(customTarget) || 0
    : target;

  const progress = effectiveTarget > 0 ? Math.min(count / effectiveTarget, 1) : 0;

  const handleTap = useCallback(() => {
    if (celebrated) return;
    vibrate(30);
    if (!sessionStartedRef.current) {
      sessionStartedRef.current = true;
      trackEvent("tasbih_start", { dhikr: selectedDhikr.id });
    }
    setCount((prev) => {
      const next = prev + 1;
      setSessionTotal((t) => t + 1);

      if (effectiveTarget > 0 && next >= effectiveTarget) {
        vibrate([60, 40, 60, 40, 120]);
        setCelebrated(true);
        if (celebrateTimeout.current) clearTimeout(celebrateTimeout.current);
        celebrateTimeout.current = setTimeout(() => {
          setCelebrated(false);
          setCount(0);
        }, 2200);
      }

      return next;
    });
  }, [celebrated, effectiveTarget, selectedDhikr.id]);

  const handleReset = useCallback(() => {
    vibrate(20);
    setCount(0);
    setCelebrated(false);
    if (celebrateTimeout.current) clearTimeout(celebrateTimeout.current);
  }, []);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    return () => {
      if (celebrateTimeout.current) clearTimeout(celebrateTimeout.current);
    };
  }, []);

  useEffect(() => {
    setCount(0);
    setCelebrated(false);
    sessionStartedRef.current = false;
    if (celebrateTimeout.current) clearTimeout(celebrateTimeout.current);
  }, [selectedDhikr]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(TASBIH_KEY, JSON.stringify({ count, dhikrId: selectedDhikr.id, target: effectiveTarget }));
    } catch {}
  }, [count, selectedDhikr.id, effectiveTarget]);

  const circumference = 2 * Math.PI * 110;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div
      style={{
        backgroundColor: "var(--islametra-bg)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <section
        style={{
          position: "relative",
          padding: "clamp(60px, 10vw, 100px) 28px 32px",
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
            width: 500,
            height: 260,
            background:
              "radial-gradient(ellipse, oklch(0.82 0.08 80 / 0.1), transparent 70%)",
            filter: "blur(40px)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", maxWidth: 520, margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
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
              marginBottom: 18,
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
            {tt.badge}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            style={{
              fontFamily: "'Geist', sans-serif",
              fontWeight: 500,
              fontSize: "clamp(30px, 5vw, 52px)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "var(--islametra-fg)",
              marginBottom: 12,
            }}
          >
            Tasbih{" "}
            <em
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                fontWeight: 400,
                color: "var(--islametra-gold)",
              }}
            >
              {tt.titleEm}
            </em>
          </motion.h1>
        </div>
      </section>

      <div
        style={{
          height: 1,
          background:
            "linear-gradient(90deg, transparent, var(--islametra-line-strong), transparent)",
        }}
      />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "32px 28px 0",
          maxWidth: 520,
          margin: "0 auto",
          width: "100%",
        }}
      >
        <motion.p
          key={selectedDhikr.id}
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-arabic"
          lang="ar"
          dir="rtl"
          style={{
            fontSize: "clamp(26px, 6vw, 40px)",
            color: "var(--islametra-gold-soft)",
            lineHeight: 1.8,
            textAlign: "center",
            marginBottom: 6,
          }}
        >
          {selectedDhikr.arabic}
        </motion.p>
        <motion.p
          key={selectedDhikr.id + "-meaning"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{
            fontSize: 12,
            color: "var(--islametra-fg-dim)",
            fontFamily: "'Geist', sans-serif",
            fontStyle: "italic",
            marginBottom: 36,
          }}
        >
          {tt.dhikrMeanings[selectedDhikr.id as keyof typeof tt.dhikrMeanings]}
        </motion.p>

        <div style={{ position: "relative", marginBottom: 24 }}>
          <svg
            width={260}
            height={260}
            viewBox="0 0 260 260"
            style={{ transform: "rotate(-90deg)" }}
          >
            <circle
              cx={130}
              cy={130}
              r={110}
              fill="none"
              stroke={isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.04)"}
              strokeWidth={8}
            />
            <motion.circle
              cx={130}
              cy={130}
              r={110}
              fill="none"
              stroke={
                celebrated
                  ? "oklch(0.62 0.13 155)"
                  : progress >= 1
                  ? "oklch(0.62 0.13 155)"
                  : "oklch(0.82 0.08 80)"
              }
              strokeWidth={8}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{ transition: "stroke-dashoffset 0.15s ease, stroke 0.3s ease" }}
            />
          </svg>

          <button
            onClick={handleTap}
            aria-label={`Tasbih — ketuk untuk menghitung, saat ini ${count}`}
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "50%",
              background: "transparent",
              border: "none",
              cursor: celebrated ? "default" : "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              WebkitTapHighlightColor: "transparent",
              userSelect: "none",
            }}
          >
            <AnimatePresence mode="wait">
              {celebrated ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: "50%",
                      background: "oklch(0.62 0.13 155 / 0.15)",
                      border: "2px solid oklch(0.62 0.13 155 / 0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Check size={28} style={{ color: "var(--islametra-emerald-soft)" }} />
                  </div>
                  <p
                    style={{
                      fontSize: 13,
                      color: "var(--islametra-emerald-soft)",
                      fontFamily: "'Geist', sans-serif",
                      fontWeight: 500,
                    }}
                  >
                    Alhamdulillah!
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="count"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <motion.span
                    key={count}
                    initial={{ scale: 1.15, opacity: 0.7 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    style={{
                      fontFamily: "'Geist Mono', monospace",
                      fontSize: "clamp(64px, 15vw, 96px)",
                      fontWeight: 700,
                      color: "var(--islametra-fg)",
                      lineHeight: 1,
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {count}
                  </motion.span>
                  {effectiveTarget > 0 && (
                    <span
                      style={{
                        fontSize: 13,
                        color: "var(--islametra-fg-dim)",
                        fontFamily: "'Geist Mono', monospace",
                        marginTop: 4,
                      }}
                    >
                      / {effectiveTarget}
                    </span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        <p
          style={{
            fontSize: 12,
            color: "var(--islametra-fg-dim)",
            fontFamily: "'Geist', sans-serif",
            marginBottom: 24,
            textAlign: "center",
          }}
        >
          {tt.tapHint} · {tt.sessionTotal}{" "}
          <span
            style={{
              fontFamily: "'Geist Mono', monospace",
              color: "var(--islametra-fg-soft)",
            }}
          >
            {sessionTotal}
          </span>
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 28,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize: 11,
              color: "var(--islametra-fg-dim)",
              fontFamily: "'Geist', sans-serif",
              marginRight: 4,
            }}
          >
            {tt.target}
          </span>
          {TARGET_OPTIONS.map((t) => (
            <button
              key={t}
              onClick={() => {
                setTarget(t);
                setShowCustom(false);
                setCount(0);
                setCelebrated(false);
              }}
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                border:
                  !showCustom && target === t
                    ? "1px solid oklch(0.82 0.08 80 / 0.5)"
                    : "1px solid var(--islametra-line)",
                background:
                  !showCustom && target === t
                    ? "oklch(0.82 0.08 80 / 0.1)"
                    : isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.03)",
                color:
                  !showCustom && target === t ? "var(--islametra-gold)" : "var(--islametra-fg-dim)",
                fontSize: 12,
                fontFamily: "'Geist Mono', monospace",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {t}
            </button>
          ))}
          <button
            onClick={() => {
              setShowCustom(true);
              setCount(0);
              setCelebrated(false);
            }}
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              border: showCustom
                ? "1px solid oklch(0.82 0.08 80 / 0.5)"
                : "1px solid var(--islametra-line)",
              background: showCustom ? "oklch(0.82 0.08 80 / 0.1)" : "rgba(255,255,255,0.03)",
              color: showCustom ? "var(--islametra-gold)" : "var(--islametra-fg-dim)",
              fontSize: 12,
              fontFamily: "'Geist', sans-serif",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            Custom
          </button>
          {showCustom && (
            <input
              type="number"
              aria-label="Target hitungan kustom"
              value={customTarget}
              onChange={(e) => setCustomTarget(e.target.value)}
              placeholder={tt.customPlaceholder}
              min={1}
              style={{
                padding: "6px 12px",
                borderRadius: 8,
                border: "1px solid var(--islametra-line)",
                background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.03)",
                color: "var(--islametra-fg)",
                fontSize: 12,
                fontFamily: "'Geist Mono', monospace",
                outline: "none",
                width: 130,
              }}
            />
          )}
        </div>

        <button
          onClick={handleReset}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "8px 18px",
            borderRadius: 10,
            border: "1px solid var(--islametra-line)",
            background: isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.02)",
            color: "var(--islametra-fg-dim)",
            fontSize: 12,
            fontFamily: "'Geist', sans-serif",
            cursor: "pointer",
            marginBottom: 36,
          }}
        >
          <RotateCcw size={12} />
          Reset
        </button>
      </div>

      <div
        style={{
          height: 1,
          background:
            "linear-gradient(90deg, transparent, var(--islametra-line-strong), transparent)",
        }}
      />

      <div
        style={{
          padding: "16px 20px",
          display: "flex",
          gap: 8,
          overflowX: "auto",
          justifyContent: "center",
          flexWrap: "wrap",
          maxWidth: 640,
          margin: "0 auto",
          width: "100%",
        }}
      >
        {DHIKR_LIST.map((d) => (
          <button
            key={d.id}
            onClick={() => setSelectedDhikr(d)}
            style={{
              padding: "10px 16px",
              borderRadius: 12,
              border:
                selectedDhikr.id === d.id
                  ? "1px solid oklch(0.82 0.08 80 / 0.45)"
                  : "1px solid var(--islametra-line)",
              background:
                selectedDhikr.id === d.id
                  ? "oklch(0.82 0.08 80 / 0.08)"
                  : isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.02)",
              cursor: "pointer",
              textAlign: "center",
              transition: "all 0.15s",
              flexShrink: 0,
            }}
          >
            <p
              className="font-arabic"
              lang="ar"
              dir="rtl"
              style={{
                fontSize: 15,
                color:
                  selectedDhikr.id === d.id ? "var(--islametra-gold)" : "var(--islametra-gold-soft)",
                lineHeight: 1.6,
                marginBottom: 2,
                opacity: selectedDhikr.id === d.id ? 1 : 0.6,
              }}
            >
              {d.arabic}
            </p>
            <p
              style={{
                fontSize: 10,
                color:
                  selectedDhikr.id === d.id ? "var(--islametra-fg-soft)" : "var(--islametra-fg-dim)",
                fontFamily: "'Geist', sans-serif",
                fontWeight: 500,
              }}
            >
              {d.nameId}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

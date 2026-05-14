"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { ArrowRight, RefreshCw, CalendarDays, Star } from "lucide-react";
import { toast } from "react-hot-toast";

interface HijriDate {
  date: string;
  day: string;
  month: { number: number; en: string; ar: string };
  year: string;
  weekday: { en: string; ar: string };
}

interface GregorianDate {
  date: string;
  day: string;
  month: { number: number; en: string };
  year: string;
  weekday: { en: string };
}

interface ConvertedDate {
  hijri: HijriDate;
  gregorian: GregorianDate;
}

const ISLAMIC_MONTHS = [
  { number: 1, ar: "مُحَرَّم", nameId: "Muharram", desc: "Bulan pertama, salah satu bulan haram" },
  { number: 2, ar: "صَفَر", nameId: "Safar", desc: "Bulan kedua kalender Hijriah" },
  { number: 3, ar: "رَبِيعُ الْأَوَّل", nameId: "Rabiul Awal", desc: "Bulan kelahiran Nabi Muhammad ﷺ" },
  { number: 4, ar: "رَبِيعُ الثَّانِي", nameId: "Rabiul Akhir", desc: "Bulan keempat kalender Hijriah" },
  { number: 5, ar: "جُمَادَى الْأُولَى", nameId: "Jumadil Awal", desc: "Bulan kelima kalender Hijriah" },
  { number: 6, ar: "جُمَادَى الثَّانِيَة", nameId: "Jumadil Akhir", desc: "Bulan keenam kalender Hijriah" },
  { number: 7, ar: "رَجَب", nameId: "Rajab", desc: "Bulan haram, terjadi Isra Mi'raj" },
  { number: 8, ar: "شَعْبَان", nameId: "Syaban", desc: "Bulan penuh keberkahan sebelum Ramadhan" },
  { number: 9, ar: "رَمَضَان", nameId: "Ramadhan", desc: "Bulan puasa wajib dan turunnya Al-Quran" },
  { number: 10, ar: "شَوَّال", nameId: "Syawal", desc: "Bulan Idul Fitri dan puasa 6 hari" },
  { number: 11, ar: "ذُو الْقَعْدَة", nameId: "Dzulqadah", desc: "Bulan haram, bulan ke-11" },
  { number: 12, ar: "ذُو الْحِجَّة", nameId: "Dzulhijjah", desc: "Bulan Idul Adha dan ibadah haji" },
];

const IMPORTANT_DATES = [
  {
    day: 1,
    month: 1,
    nameId: "Tahun Baru Islam",
    monthName: "Muharram",
    desc: "Awal tahun baru Hijriah, momen muhasabah dan memperbanyak ibadah.",
    color: "gold",
  },
  {
    day: 10,
    month: 1,
    nameId: "Hari Asyura",
    monthName: "Muharram",
    desc: "Hari ke-10 Muharram, disunnahkan berpuasa karena keistimewaannya.",
    color: "emerald",
  },
  {
    day: 12,
    month: 3,
    nameId: "Maulid Nabi ﷺ",
    monthName: "Rabiul Awal",
    desc: "Peringatan kelahiran Nabi Muhammad SAW, dirayakan dengan sholawat dan kajian.",
    color: "gold",
  },
  {
    day: 27,
    month: 7,
    nameId: "Isra Mi'raj",
    monthName: "Rajab",
    desc: "Peristiwa perjalanan Nabi dari Masjidil Haram ke Masjidil Aqsa dan ke Sidratul Muntaha.",
    color: "emerald",
  },
  {
    day: 1,
    month: 9,
    nameId: "Awal Ramadhan",
    monthName: "Ramadhan",
    desc: "Bulan puasa wajib bagi seluruh umat Islam yang mampu.",
    color: "gold",
  },
  {
    day: 17,
    month: 9,
    nameId: "Nuzulul Quran",
    monthName: "Ramadhan",
    desc: "Peringatan turunnya Al-Quran pertama kali kepada Nabi Muhammad SAW.",
    color: "emerald",
  },
  {
    day: 1,
    month: 10,
    nameId: "Idul Fitri",
    monthName: "Syawal",
    desc: "Hari kemenangan setelah sebulan penuh berpuasa di bulan Ramadhan.",
    color: "gold",
  },
  {
    day: 10,
    month: 12,
    nameId: "Idul Adha",
    monthName: "Dzulhijjah",
    desc: "Hari raya kurban, dirayakan bersamaan dengan puncak ibadah haji di Arafah.",
    color: "emerald",
  },
];

const WEEKDAYS_ID: Record<string, string> = {
  Sunday: "Ahad",
  Monday: "Senin",
  Tuesday: "Selasa",
  Wednesday: "Rabu",
  Thursday: "Kamis",
  Friday: "Jumat",
  Saturday: "Sabtu",
};

function todayDDMMYYYY(): string {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

async function fetchHijri(ddmmyyyy: string): Promise<ConvertedDate | null> {
  try {
    const res = await fetch(`https://api.aladhan.com/v1/gToH/${ddmmyyyy}`);
    const data = await res.json();
    if (data.code === 200 && data.data) return data.data;
  } catch {
    return null;
  }
  return null;
}

function toDisplayDate(ddmmyyyy: string): string {
  const [dd, mm, yyyy] = ddmmyyyy.split("-");
  const d = new Date(parseInt(yyyy), parseInt(mm) - 1, parseInt(dd));
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

function inputDateToDDMMYYYY(inputVal: string): string {
  const [yyyy, mm, dd] = inputVal.split("-");
  return `${dd}-${mm}-${yyyy}`;
}

export function KalenderModule() {
  const [todayHijri, setTodayHijri] = useState<ConvertedDate | null>(null);
  const [todayLoading, setTodayLoading] = useState(true);
  const [converterInput, setConverterInput] = useState("");
  const [converterResult, setConverterResult] = useState<ConvertedDate | null>(null);
  const [converterLoading, setConverterLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"today" | "months" | "dates" | "converter">("today");
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const isLight = mounted && theme === "light";

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    async function load() {
      setTodayLoading(true);
      const result = await fetchHijri(todayDDMMYYYY());
      setTodayHijri(result);
      setTodayLoading(false);
    }
    load();
  }, []);

  const handleConvert = async () => {
    if (!converterInput) {
      toast.error("Pilih tanggal terlebih dahulu");
      return;
    }
    setConverterLoading(true);
    setConverterResult(null);
    const ddmmyyyy = inputDateToDDMMYYYY(converterInput);
    const result = await fetchHijri(ddmmyyyy);
    if (result) {
      setConverterResult(result);
    } else {
      toast.error("Gagal mengkonversi tanggal");
    }
    setConverterLoading(false);
  };

  const TABS = [
    { key: "today" as const, label: "Hari Ini" },
    { key: "months" as const, label: "12 Bulan" },
    { key: "dates" as const, label: "Hari Penting" },
    { key: "converter" as const, label: "Konversi" },
  ];

  return (
    <div style={{ backgroundColor: "var(--islamiva-bg)", minHeight: "100vh" }}>
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
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 560,
            height: 280,
            background:
              "radial-gradient(ellipse, oklch(0.82 0.08 80 / 0.1), transparent 70%)",
            filter: "blur(40px)",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", maxWidth: 640, margin: "0 auto" }}>
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
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "var(--islamiva-gold)",
                flexShrink: 0,
              }}
            />
            Kalender Islam
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            style={{
              fontFamily: "'Geist', sans-serif",
              fontWeight: 500,
              fontSize: "clamp(32px, 5vw, 58px)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "var(--islamiva-fg)",
              marginBottom: 16,
            }}
          >
            Kalender{" "}
            <em
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                fontWeight: 400,
                color: "var(--islamiva-gold)",
              }}
            >
              Hijriah
            </em>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              fontSize: 15,
              color: "var(--islamiva-fg-mute)",
              lineHeight: 1.65,
              maxWidth: 480,
              margin: "0 auto",
            }}
          >
            Tanggal Hijriah hari ini, konversi kalender, dan hari-hari penting dalam Islam.
          </motion.p>
        </div>
      </section>

      <div
        style={{
          height: 1,
          background:
            "linear-gradient(90deg, transparent, var(--islamiva-line-strong), transparent)",
        }}
      />

      <section
        style={{ maxWidth: 800, margin: "0 auto", padding: "clamp(40px, 6vw, 72px) 28px" }}
      >
        <div
          style={{
            display: "flex",
            gap: 6,
            marginBottom: 36,
            padding: "4px",
            borderRadius: 14,
            background: isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.02)",
            border: "1px solid var(--islamiva-line)",
            overflowX: "auto",
          }}
        >
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: "8px 18px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                fontSize: 13,
                fontFamily: "'Geist', sans-serif",
                fontWeight: 500,
                whiteSpace: "nowrap",
                flex: 1,
                transition: "all 0.15s",
                ...(activeTab === tab.key
                  ? {
                      background: isLight
                        ? "linear-gradient(180deg, rgba(0,0,0,0.05), rgba(0,0,0,0.02))"
                        : "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                      color: "var(--islamiva-fg)",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                    }
                  : {
                      background: "transparent",
                      color: "var(--islamiva-fg-dim)",
                    }),
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "today" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            {todayLoading ? (
              <div
                style={{
                  padding: "60px 32px",
                  borderRadius: 24,
                  background: isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.02)",
                  border: "1px solid var(--islamiva-line)",
                  textAlign: "center",
                }}
              >
                <RefreshCw
                  size={24}
                  style={{
                    color: "var(--islamiva-fg-dim)",
                    animation: "spin 1s linear infinite",
                    margin: "0 auto",
                  }}
                />
                <p
                  style={{
                    fontSize: 13,
                    color: "var(--islamiva-fg-mute)",
                    fontFamily: "'Geist', sans-serif",
                    marginTop: 16,
                  }}
                >
                  Mengambil data tanggal Hijriah...
                </p>
              </div>
            ) : todayHijri ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div
                  style={{
                    padding: "36px 32px",
                    borderRadius: 24,
                    background:
                      "linear-gradient(135deg, oklch(0.82 0.08 80 / 0.08), oklch(0.82 0.08 80 / 0.03))",
                    border: "1px solid oklch(0.82 0.08 80 / 0.2)",
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      fontSize: 11,
                      fontFamily: "'Geist Mono', monospace",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--islamiva-gold-soft)",
                      marginBottom: 16,
                    }}
                  >
                    {WEEKDAYS_ID[todayHijri.gregorian.weekday.en] ?? todayHijri.gregorian.weekday.en}
                  </p>
                  <p
                    className="font-arabic"
                    lang="ar"
                    dir="rtl"
                    style={{
                      fontSize: "clamp(28px, 6vw, 44px)",
                      color: "var(--islamiva-gold-soft)",
                      lineHeight: 1.6,
                      marginBottom: 12,
                    }}
                  >
                    {todayHijri.hijri.weekday.ar}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Geist Mono', monospace",
                      fontSize: "clamp(32px, 7vw, 56px)",
                      fontWeight: 700,
                      color: "var(--islamiva-fg)",
                      letterSpacing: "-0.03em",
                      lineHeight: 1,
                      marginBottom: 8,
                    }}
                  >
                    {todayHijri.hijri.day}
                  </p>
                  <p
                    style={{
                      fontSize: "clamp(16px, 3vw, 22px)",
                      fontFamily: "'Geist', sans-serif",
                      fontWeight: 600,
                      color: "var(--islamiva-gold)",
                      letterSpacing: "-0.01em",
                      marginBottom: 6,
                    }}
                  >
                    {todayHijri.hijri.month.en} {todayHijri.hijri.year} H
                  </p>
                  <p
                    className="font-arabic"
                    lang="ar"
                    dir="rtl"
                    style={{
                      fontSize: 18,
                      color: "var(--islamiva-gold-soft)",
                      opacity: 0.75,
                      lineHeight: 1.8,
                    }}
                  >
                    {todayHijri.hijri.month.ar}
                  </p>
                </div>

                <div
                  style={{
                    padding: "20px 24px",
                    borderRadius: 16,
                    background: isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.02)",
                    border: "1px solid var(--islamiva-line)",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                  }}
                >
                  <CalendarDays size={18} style={{ color: "var(--islamiva-fg-dim)" }} />
                  <div>
                    <p
                      style={{
                        fontSize: 11,
                        color: "var(--islamiva-fg-dim)",
                        fontFamily: "'Geist Mono', monospace",
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                        marginBottom: 4,
                      }}
                    >
                      Masehi
                    </p>
                    <p
                      style={{
                        fontSize: 16,
                        fontFamily: "'Geist', sans-serif",
                        fontWeight: 600,
                        color: "var(--islamiva-fg-soft)",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {toDisplayDate(todayHijri.gregorian.date)}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p
                style={{
                  textAlign: "center",
                  color: "var(--islamiva-fg-mute)",
                  fontSize: 14,
                  padding: "60px 0",
                }}
              >
                Gagal memuat data
              </p>
            )}
          </motion.div>
        )}

        {activeTab === "months" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 12,
              }}
            >
              {ISLAMIC_MONTHS.map((month, i) => (
                <motion.div
                  key={month.number}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  style={{
                    padding: "20px 22px",
                    borderRadius: 16,
                    background:
                      isLight ? "var(--islamiva-bg-1)" : "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005)), var(--islamiva-bg-1)",
                    border: "1px solid var(--islamiva-line)",
                    display: "flex",
                    gap: 16,
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: "oklch(0.82 0.08 80 / 0.1)",
                      border: "1px solid oklch(0.82 0.08 80 / 0.18)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      fontFamily: "'Geist Mono', monospace",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "var(--islamiva-gold-soft)",
                    }}
                  >
                    {month.number}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        gap: 8,
                        marginBottom: 6,
                        flexWrap: "wrap",
                      }}
                    >
                      <p
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          fontFamily: "'Geist', sans-serif",
                          color: "var(--islamiva-fg-soft)",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {month.nameId}
                      </p>
                      <p
                        className="font-arabic"
                        lang="ar"
                        dir="rtl"
                        style={{
                          fontSize: 13,
                          color: "var(--islamiva-gold-soft)",
                          opacity: 0.7,
                          lineHeight: 1.6,
                        }}
                      >
                        {month.ar}
                      </p>
                    </div>
                    <p
                      style={{
                        fontSize: 12,
                        color: "var(--islamiva-fg-mute)",
                        lineHeight: 1.55,
                        fontFamily: "'Geist', sans-serif",
                      }}
                    >
                      {month.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "dates" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {IMPORTANT_DATES.map((item, i) => {
                const isGold = item.color === "gold";
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    style={{
                      padding: "20px 24px",
                      borderRadius: 16,
                      background: isGold
                        ? "linear-gradient(135deg, oklch(0.82 0.08 80 / 0.07), rgba(255,255,255,0.005))"
                        : "linear-gradient(135deg, oklch(0.62 0.13 155 / 0.06), transparent)",
                      border: isGold
                        ? "1px solid oklch(0.82 0.08 80 / 0.2)"
                        : "1px solid oklch(0.62 0.13 155 / 0.2)",
                      display: "flex",
                      gap: 18,
                      alignItems: "flex-start",
                    }}
                  >
                    <div
                      style={{
                        flexShrink: 0,
                        textAlign: "center",
                        minWidth: 56,
                      }}
                    >
                      <p
                        style={{
                          fontFamily: "'Geist Mono', monospace",
                          fontSize: 26,
                          fontWeight: 700,
                          color: isGold ? "var(--islamiva-gold)" : "var(--islamiva-emerald-soft)",
                          lineHeight: 1,
                          marginBottom: 4,
                        }}
                      >
                        {item.day}
                      </p>
                      <p
                        style={{
                          fontSize: 10,
                          fontFamily: "'Geist', sans-serif",
                          color: isGold ? "var(--islamiva-gold-soft)" : "var(--islamiva-emerald-soft)",
                          opacity: 0.7,
                          lineHeight: 1.3,
                        }}
                      >
                        {item.monthName}
                      </p>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <Star
                          size={12}
                          style={{
                            color: isGold ? "var(--islamiva-gold)" : "var(--islamiva-emerald-soft)",
                            fill: "currentColor",
                            flexShrink: 0,
                          }}
                        />
                        <p
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            fontFamily: "'Geist', sans-serif",
                            color: "var(--islamiva-fg-soft)",
                            letterSpacing: "-0.01em",
                          }}
                        >
                          {item.nameId}
                        </p>
                      </div>
                      <p
                        style={{
                          fontSize: 13,
                          color: "var(--islamiva-fg-mute)",
                          lineHeight: 1.6,
                          fontFamily: "'Geist', sans-serif",
                        }}
                      >
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}

        {activeTab === "converter" && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <div
              style={{
                padding: "28px 32px",
                borderRadius: 20,
                background: isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.02)",
                border: "1px solid var(--islamiva-line)",
                marginBottom: 24,
              }}
            >
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: "var(--islamiva-fg-soft)",
                  fontFamily: "'Geist', sans-serif",
                  marginBottom: 6,
                }}
              >
                Konversi Masehi ke Hijriah
              </p>
              <p
                style={{
                  fontSize: 12,
                  color: "var(--islamiva-fg-dim)",
                  fontFamily: "'Geist', sans-serif",
                  marginBottom: 20,
                  lineHeight: 1.55,
                }}
              >
                Masukkan tanggal Masehi untuk mendapatkan tanggal Hijriah yang setara.
              </p>
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-end",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ flex: 1, minWidth: 180 }}>
                  <label
                    style={{
                      display: "block",
                      fontSize: 11,
                      color: "var(--islamiva-fg-dim)",
                      fontFamily: "'Geist Mono', monospace",
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    Tanggal Masehi
                  </label>
                  <input
                    type="date"
                    value={converterInput}
                    onChange={(e) => {
                      setConverterInput(e.target.value);
                      setConverterResult(null);
                    }}
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 10,
                      border: "1px solid var(--islamiva-line)",
                      background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.03)",
                      color: "var(--islamiva-fg)",
                      fontSize: 13,
                      fontFamily: "'Geist', sans-serif",
                      outline: "none",
                      colorScheme: "dark",
                    }}
                  />
                </div>
                <button
                  onClick={handleConvert}
                  disabled={converterLoading || !converterInput}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "10px 20px",
                    borderRadius: 10,
                    border: "1px solid oklch(0.82 0.08 80 / 0.35)",
                    background: "oklch(0.82 0.08 80 / 0.1)",
                    color: "var(--islamiva-gold)",
                    fontSize: 13,
                    fontFamily: "'Geist', sans-serif",
                    fontWeight: 500,
                    cursor: converterLoading || !converterInput ? "not-allowed" : "pointer",
                    opacity: !converterInput ? 0.5 : 1,
                    transition: "opacity 0.15s",
                    whiteSpace: "nowrap",
                  }}
                >
                  {converterLoading ? (
                    <RefreshCw
                      size={13}
                      style={{ animation: "spin 1s linear infinite" }}
                    />
                  ) : (
                    <ArrowRight size={13} />
                  )}
                  Konversi
                </button>
              </div>
            </div>

            {converterResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  padding: "28px 32px",
                  borderRadius: 20,
                  background:
                    "linear-gradient(135deg, oklch(0.82 0.08 80 / 0.08), oklch(0.82 0.08 80 / 0.03))",
                  border: "1px solid oklch(0.82 0.08 80 / 0.25)",
                }}
              >
                <p
                  style={{
                    fontSize: 11,
                    fontFamily: "'Geist Mono', monospace",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--islamiva-gold-soft)",
                    marginBottom: 14,
                  }}
                >
                  Hasil Konversi
                </p>
                <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "center" }}>
                  <div>
                    <p
                      style={{
                        fontSize: 11,
                        color: "var(--islamiva-fg-dim)",
                        fontFamily: "'Geist Mono', monospace",
                        marginBottom: 6,
                      }}
                    >
                      Masehi
                    </p>
                    <p
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        fontFamily: "'Geist', sans-serif",
                        color: "var(--islamiva-fg-soft)",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {toDisplayDate(converterResult.gregorian.date)}
                    </p>
                  </div>
                  <ArrowRight size={16} style={{ color: "var(--islamiva-fg-dim)", flexShrink: 0 }} />
                  <div>
                    <p
                      style={{
                        fontSize: 11,
                        color: "var(--islamiva-fg-dim)",
                        fontFamily: "'Geist Mono', monospace",
                        marginBottom: 6,
                      }}
                    >
                      Hijriah
                    </p>
                    <p
                      style={{
                        fontSize: 16,
                        fontWeight: 600,
                        fontFamily: "'Geist', sans-serif",
                        color: "var(--islamiva-gold)",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {converterResult.hijri.day} {converterResult.hijri.month.en}{" "}
                      {converterResult.hijri.year} H
                    </p>
                    <p
                      className="font-arabic"
                      lang="ar"
                      dir="rtl"
                      style={{
                        fontSize: 14,
                        color: "var(--islamiva-gold-soft)",
                        opacity: 0.7,
                        lineHeight: 1.8,
                        marginTop: 4,
                      }}
                    >
                      {converterResult.hijri.day} {converterResult.hijri.month.ar}{" "}
                      {converterResult.hijri.year}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </section>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

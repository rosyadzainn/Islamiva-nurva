"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, RefreshCw, Clock, AlertCircle, Bell, BellOff } from "lucide-react";
import { useTheme } from "next-themes";

interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

interface TimingData {
  timings: PrayerTimes;
  date: {
    readable: string;
    hijri: { date: string; month: { en: string }; year: string };
  };
}

interface LocationData {
  city?: string;
  locality?: string;
  principalSubdivision?: string;
  countryName?: string;
}

const PRAYERS = [
  { key: "Fajr" as keyof PrayerTimes, nameId: "Subuh", icon: "🌙" },
  { key: "Sunrise" as keyof PrayerTimes, nameId: "Syuruk", icon: "🌅" },
  { key: "Dhuhr" as keyof PrayerTimes, nameId: "Dzuhur", icon: "☀️" },
  { key: "Asr" as keyof PrayerTimes, nameId: "Ashar", icon: "🌤️" },
  { key: "Maghrib" as keyof PrayerTimes, nameId: "Maghrib", icon: "🌇" },
  { key: "Isha" as keyof PrayerTimes, nameId: "Isya", icon: "🌃" },
];

const MAIN_PRAYERS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function formatCountdown(totalSeconds: number): string {
  if (totalSeconds <= 0) return "00:00:00";
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, "0")).join(":");
}

function getCurrentAndNextPrayer(
  timings: PrayerTimes,
  nowMinutes: number
): { current: string | null; next: string } {
  const mainPrayers = PRAYERS.filter((p) => MAIN_PRAYERS.includes(p.key));
  let current: string | null = null;
  let next = mainPrayers[0].key;

  for (let i = 0; i < mainPrayers.length; i++) {
    const start = timeToMinutes(timings[mainPrayers[i].key]);
    const end =
      i < mainPrayers.length - 1
        ? timeToMinutes(timings[mainPrayers[i + 1].key])
        : 24 * 60;

    if (nowMinutes >= start && nowMinutes < end) {
      current = mainPrayers[i].key;
      next = i < mainPrayers.length - 1 ? mainPrayers[i + 1].key : mainPrayers[0].key;
      break;
    }
  }

  if (!current) {
    const firstStart = timeToMinutes(timings[mainPrayers[0].key]);
    if (nowMinutes < firstStart) {
      next = mainPrayers[0].key;
    } else {
      next = mainPrayers[0].key;
    }
  }

  return { current, next };
}

function getSecondsToNext(timings: PrayerTimes, nextKey: string, nowDate: Date): number {
  const [h, m] = timings[nextKey as keyof PrayerTimes].split(":").map(Number);
  const target = new Date(nowDate);
  target.setHours(h, m, 0, 0);
  if (target <= nowDate) {
    target.setDate(target.getDate() + 1);
  }
  return Math.max(0, Math.floor((target.getTime() - nowDate.getTime()) / 1000));
}

function SkeletonCard({ isLight }: { isLight: boolean }) {
  return (
    <div
      style={{
        padding: "20px 24px",
        borderRadius: 16,
        background: isLight ? "var(--islamiva-bg-1)" : "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005)), var(--islamiva-bg-1)",
        border: "1px solid var(--islamiva-line)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <div>
        <div
          style={{
            width: 80,
            height: 14,
            borderRadius: 6,
            background: isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)",
            marginBottom: 8,
          }}
        />
        <div
          style={{
            width: 48,
            height: 11,
            borderRadius: 4,
            background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.03)",
          }}
        />
      </div>
      <div
        style={{
          width: 64,
          height: 28,
          borderRadius: 8,
          background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)",
        }}
      />
    </div>
  );
}

export function JadwalSholatModule() {
  const [timings, setTimings] = useState<TimingData | null>(null);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState(new Date());
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();
  const isLight = mounted && theme === "light";
  const notifTimers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => { setMounted(true); }, []);

  const fetchPrayerTimes = useCallback(async (lat: number, lng: number) => {
    setLoading(true);
    setError(null);
    try {
      const [timingRes, locationRes] = await Promise.all([
        fetch(
          `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=11&school=1`
        ),
        fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=id`
        ),
      ]);
      const timingJson = await timingRes.json();
      const locationJson = await locationRes.json();
      if (timingJson.code === 200 && timingJson.data) {
        setTimings(timingJson.data);
      } else {
        setError("Gagal mengambil data jadwal sholat.");
      }
      setLocation(locationJson);
    } catch {
      setError("Gagal terhubung ke server. Periksa koneksi internet.");
    } finally {
      setLoading(false);
    }
  }, []);

  const requestLocation = useCallback(() => {
    setLoading(true);
    setError(null);
    if (!navigator.geolocation) {
      setError("Browser kamu tidak mendukung geolocation.");
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setCoords({ lat, lng });
        fetchPrayerTimes(lat, lng);
      },
      () => {
        setError("Akses lokasi ditolak. Izinkan akses lokasi untuk melihat jadwal sholat.");
        setLoading(false);
      },
      { timeout: 10000 }
    );
  }, [fetchPrayerTimes]);

  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Check stored notif preference on mount
  useEffect(() => {
    if (typeof window !== "undefined" && Notification.permission === "granted") {
      const stored = localStorage.getItem("islamiva_notif_sholat");
      if (stored === "true") setNotifEnabled(true);
    }
  }, []);

  const scheduleNotifications = useCallback((t: PrayerTimes) => {
    // Clear existing timers
    notifTimers.current.forEach(clearTimeout);
    notifTimers.current = [];

    const mainPrayerList = PRAYERS.filter((p) => MAIN_PRAYERS.includes(p.key));
    const nowDate = new Date();

    mainPrayerList.forEach((prayer) => {
      const [h, m] = t[prayer.key].split(":").map(Number);
      const target = new Date(nowDate);
      target.setHours(h, m, 0, 0);
      // If prayer time has passed, schedule for tomorrow
      if (target <= nowDate) target.setDate(target.getDate() + 1);
      const delay = target.getTime() - nowDate.getTime();
      const timer = setTimeout(() => {
        if (Notification.permission === "granted") {
          new Notification(`🕌 Waktu ${prayer.nameId}`, {
            body: `Sudah masuk waktu ${prayer.nameId}. Mari kita sholat.`,
            icon: "/icons/icon-192x192.png",
            tag: prayer.key,
          });
        }
      }, delay);
      notifTimers.current.push(timer);
    });
  }, []);

  const toggleNotifications = useCallback(async () => {
    if (!("Notification" in window)) {
      alert("Browser kamu tidak mendukung notifikasi.");
      return;
    }
    if (notifEnabled) {
      notifTimers.current.forEach(clearTimeout);
      notifTimers.current = [];
      setNotifEnabled(false);
      localStorage.setItem("islamiva_notif_sholat", "false");
      return;
    }
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      setNotifEnabled(true);
      localStorage.setItem("islamiva_notif_sholat", "true");
      if (timings) scheduleNotifications(timings.timings);
      new Notification("✅ Notifikasi Sholat Aktif", {
        body: "Kamu akan mendapat notifikasi saat masuk waktu sholat.",
        icon: "/icons/icon-192x192.png",
      });
    } else {
      alert("Izin notifikasi ditolak. Aktifkan di pengaturan browser kamu.");
    }
  }, [notifEnabled, timings, scheduleNotifications]);

  // Re-schedule when timings load and notif is enabled
  useEffect(() => {
    if (notifEnabled && timings) scheduleNotifications(timings.timings);
    return () => { notifTimers.current.forEach(clearTimeout); };
  }, [timings, notifEnabled, scheduleNotifications]);

  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const prayerStatus =
    timings ? getCurrentAndNextPrayer(timings.timings, nowMinutes) : null;
  const countdownSeconds =
    timings && prayerStatus
      ? getSecondsToNext(timings.timings, prayerStatus.next, now)
      : 0;

  const cityName =
    location?.city || location?.locality || location?.principalSubdivision || null;

  const nextPrayerInfo = prayerStatus
    ? PRAYERS.find((p) => p.key === prayerStatus.next)
    : null;

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
              "radial-gradient(ellipse, oklch(0.62 0.13 155 / 0.12), transparent 70%)",
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
                background: "var(--islamiva-emerald)",
                flexShrink: 0,
              }}
            />
            Berdasarkan Lokasi
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            style={{
              fontFamily: "'Geist', sans-serif",
              fontWeight: 500,
              fontSize: "clamp(32px, 5vw, 60px)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "var(--islamiva-fg)",
              marginBottom: 16,
            }}
          >
            Jadwal{" "}
            <em
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                fontWeight: 400,
                color: "var(--islamiva-emerald-soft)",
              }}
            >
              Sholat
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
            Waktu sholat akurat berdasarkan koordinat GPS lokasimu, diperbarui setiap hari.
          </motion.p>

          {cityName && !loading && !error && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 20, flexWrap: "wrap" }}
            >
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 14px",
                  borderRadius: 9999,
                  background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.03)",
                  border: "1px solid var(--islamiva-line)",
                  color: "var(--islamiva-fg-soft)",
                  fontSize: 12,
                  fontFamily: "'Geist', sans-serif",
                }}
              >
                <MapPin size={12} style={{ color: "var(--islamiva-emerald)" }} />
                {cityName}
              </div>
              <button
                onClick={toggleNotifications}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 14px",
                  borderRadius: 9999,
                  border: notifEnabled
                    ? "1px solid oklch(0.62 0.13 155 / 0.4)"
                    : "1px solid var(--islamiva-line)",
                  background: notifEnabled
                    ? "oklch(0.62 0.13 155 / 0.1)"
                    : "rgba(255,255,255,0.03)",
                  color: notifEnabled ? "oklch(0.85 0.1 155)" : "var(--islamiva-fg-soft)",
                  fontSize: 12,
                  fontFamily: "'Geist', sans-serif",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {notifEnabled ? <Bell size={12} /> : <BellOff size={12} />}
                {notifEnabled ? "Notifikasi aktif" : "Aktifkan notifikasi"}
              </button>
            </motion.div>
          )}
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
        style={{ maxWidth: 680, margin: "0 auto", padding: "clamp(40px, 6vw, 72px) 28px" }}
      >
        <AnimatePresence mode="wait">
          {error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                textAlign: "center",
                padding: "60px 32px",
                borderRadius: 24,
                background: isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.02)",
                border: "1px solid var(--islamiva-line)",
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: "rgba(255,80,80,0.08)",
                  border: "1px solid rgba(255,80,80,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <AlertCircle size={22} style={{ color: "rgba(255,100,100,0.8)" }} />
              </div>
              <p
                style={{
                  fontSize: 15,
                  color: "var(--islamiva-fg-soft)",
                  fontFamily: "'Geist', sans-serif",
                  marginBottom: 8,
                  fontWeight: 500,
                }}
              >
                Gagal Mendapatkan Lokasi
              </p>
              <p
                style={{
                  fontSize: 13,
                  color: "var(--islamiva-fg-mute)",
                  lineHeight: 1.6,
                  marginBottom: 28,
                }}
              >
                {error}
              </p>
              <button
                onClick={requestLocation}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 20px",
                  borderRadius: 10,
                  background: "oklch(0.62 0.13 155 / 0.12)",
                  border: "1px solid oklch(0.62 0.13 155 / 0.25)",
                  color: "var(--islamiva-emerald-soft)",
                  fontSize: 13,
                  fontFamily: "'Geist', sans-serif",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                <RefreshCw size={13} />
                Coba Lagi
              </button>
            </motion.div>
          ) : (
            <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {!loading && timings && prayerStatus && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    marginBottom: 32,
                    padding: "28px 32px",
                    borderRadius: 20,
                    background:
                      "linear-gradient(135deg, oklch(0.62 0.13 155 / 0.08), oklch(0.62 0.13 155 / 0.03))",
                    border: "1px solid oklch(0.62 0.13 155 / 0.2)",
                    textAlign: "center",
                  }}
                >
                  <p
                    style={{
                      fontSize: 11,
                      fontFamily: "'Geist Mono', monospace",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--islamiva-emerald-soft)",
                      marginBottom: 10,
                    }}
                  >
                    Waktu Sekarang
                  </p>
                  <p
                    style={{
                      fontFamily: "'Geist Mono', monospace",
                      fontSize: "clamp(36px, 8vw, 64px)",
                      fontWeight: 600,
                      color: "var(--islamiva-fg)",
                      letterSpacing: "-0.02em",
                      lineHeight: 1,
                      marginBottom: 20,
                    }}
                  >
                    {now.toLocaleTimeString("id-ID", {
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </p>
                  {timings.date?.hijri && (
                    <p
                      style={{
                        fontSize: 12,
                        color: "var(--islamiva-fg-dim)",
                        fontFamily: "'Geist', sans-serif",
                        marginBottom: 20,
                      }}
                    >
                      {timings.date.hijri.date} {timings.date.hijri.month.en}{" "}
                      {timings.date.hijri.year} H &middot; {timings.date.readable}
                    </p>
                  )}
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "10px 20px",
                      borderRadius: 12,
                      background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)",
                      border: "1px solid var(--islamiva-line)",
                    }}
                  >
                    <Clock size={13} style={{ color: "var(--islamiva-emerald)" }} />
                    <span
                      style={{
                        fontSize: 12,
                        color: "var(--islamiva-fg-mute)",
                        fontFamily: "'Geist', sans-serif",
                      }}
                    >
                      Menuju {nextPrayerInfo?.nameId}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        fontFamily: "'Geist Mono', monospace",
                        color: "var(--islamiva-emerald-soft)",
                        fontWeight: 600,
                      }}
                    >
                      {formatCountdown(countdownSeconds)}
                    </span>
                  </div>
                </motion.div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {loading
                  ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} isLight={isLight} />)
                  : PRAYERS.map((prayer, i) => {
                      const isMain = MAIN_PRAYERS.includes(prayer.key);
                      const isCurrent =
                        prayerStatus?.current === prayer.key;
                      const isNext =
                        prayerStatus?.next === prayer.key && !isCurrent;
                      const time = timings?.timings[prayer.key] ?? "--:--";

                      return (
                        <motion.div
                          key={prayer.key}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          style={{
                            padding: "18px 24px",
                            borderRadius: 16,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            transition: "border-color 0.2s",
                            ...(isCurrent
                              ? {
                                  background:
                                    "linear-gradient(135deg, oklch(0.82 0.08 80 / 0.1), oklch(0.82 0.08 80 / 0.04))",
                                  border: "1px solid oklch(0.82 0.08 80 / 0.35)",
                                  boxShadow: "0 0 24px -8px oklch(0.82 0.08 80 / 0.25)",
                                }
                              : isNext
                              ? {
                                  background:
                                    "linear-gradient(135deg, oklch(0.62 0.13 155 / 0.08), oklch(0.62 0.13 155 / 0.03))",
                                  border: "1px solid oklch(0.62 0.13 155 / 0.3)",
                                  boxShadow: "0 0 20px -8px oklch(0.62 0.13 155 / 0.2)",
                                }
                              : {
                                  background:
                                    isLight ? "var(--islamiva-bg-1)" : "linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.005)), var(--islamiva-bg-1)",
                                  border: "1px solid var(--islamiva-line)",
                                  opacity: isMain ? 1 : 0.65,
                                }),
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                            <div
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: 12,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 18,
                                background: isCurrent
                                  ? "oklch(0.82 0.08 80 / 0.12)"
                                  : isNext
                                  ? "oklch(0.62 0.13 155 / 0.1)"
                                  : "rgba(255,255,255,0.04)",
                                border: isCurrent
                                  ? "1px solid oklch(0.82 0.08 80 / 0.2)"
                                  : isNext
                                  ? "1px solid oklch(0.62 0.13 155 / 0.2)"
                                  : "1px solid var(--islamiva-line)",
                              }}
                            >
                              {prayer.icon}
                            </div>
                            <div>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <p
                                  style={{
                                    fontSize: 15,
                                    fontWeight: 600,
                                    fontFamily: "'Geist', sans-serif",
                                    color: isCurrent
                                      ? "var(--islamiva-gold)"
                                      : isNext
                                      ? "var(--islamiva-emerald-soft)"
                                      : "var(--islamiva-fg-soft)",
                                    letterSpacing: "-0.01em",
                                  }}
                                >
                                  {prayer.nameId}
                                </p>
                                {isCurrent && (
                                  <span
                                    style={{
                                      fontSize: 9,
                                      fontFamily: "'Geist Mono', monospace",
                                      letterSpacing: "0.06em",
                                      textTransform: "uppercase",
                                      padding: "2px 7px",
                                      borderRadius: 999,
                                      background: "oklch(0.82 0.08 80 / 0.15)",
                                      border: "1px solid oklch(0.82 0.08 80 / 0.3)",
                                      color: "var(--islamiva-gold)",
                                    }}
                                  >
                                    Sekarang
                                  </span>
                                )}
                                {isNext && (
                                  <span
                                    style={{
                                      fontSize: 9,
                                      fontFamily: "'Geist Mono', monospace",
                                      letterSpacing: "0.06em",
                                      textTransform: "uppercase",
                                      padding: "2px 7px",
                                      borderRadius: 999,
                                      background: "oklch(0.62 0.13 155 / 0.12)",
                                      border: "1px solid oklch(0.62 0.13 155 / 0.25)",
                                      color: "var(--islamiva-emerald-soft)",
                                    }}
                                  >
                                    Berikutnya
                                  </span>
                                )}
                              </div>
                              <p
                                style={{
                                  fontSize: 11,
                                  color: "var(--islamiva-fg-dim)",
                                  fontFamily: "'Geist', sans-serif",
                                  marginTop: 2,
                                }}
                              >
                                {prayer.key}
                              </p>
                            </div>
                          </div>
                          <p
                            style={{
                              fontFamily: "'Geist Mono', monospace",
                              fontSize: 22,
                              fontWeight: 600,
                              letterSpacing: "-0.02em",
                              color: isCurrent
                                ? "var(--islamiva-gold)"
                                : isNext
                                ? "var(--islamiva-emerald-soft)"
                                : "var(--islamiva-fg-soft)",
                            }}
                          >
                            {time}
                          </p>
                        </motion.div>
                      );
                    })}
              </div>

              {!loading && coords && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  style={{
                    marginTop: 24,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <p
                    style={{
                      fontSize: 11,
                      color: "var(--islamiva-fg-dim)",
                      fontFamily: "'Geist Mono', monospace",
                    }}
                  >
                    {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)} · Metode Kemenag RI
                  </p>
                  <button
                    onClick={requestLocation}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      padding: "6px 12px",
                      borderRadius: 8,
                      background: isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.03)",
                      border: "1px solid var(--islamiva-line)",
                      color: "var(--islamiva-fg-dim)",
                      fontSize: 11,
                      fontFamily: "'Geist', sans-serif",
                      cursor: "pointer",
                    }}
                  >
                    <RefreshCw size={10} />
                    Perbarui
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "islamiva_quran_progress";

interface ProgressEntry {
  lastAyah: number;
  totalAyahs: number;
  surahName: string;
  timestamp: string;
}

type ProgressMap = Record<number, ProgressEntry>;

export function useQuranProgress() {
  const [progress, setProgress] = useState<ProgressMap>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setProgress(JSON.parse(stored));
    } catch {}
  }, []);

  const saveProgress = (surahNumber: number, ayahNumber: number, totalAyahs: number, surahName: string) => {
    setProgress((prev) => {
      const updated: ProgressMap = {
        ...prev,
        [surahNumber]: {
          lastAyah: ayahNumber,
          totalAyahs,
          surahName,
          timestamp: new Date().toISOString(),
        },
      };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const getProgress = (surahNumber: number): ProgressEntry | null =>
    progress[surahNumber] ?? null;

  const clearProgress = (surahNumber: number) => {
    setProgress((prev) => {
      const updated = { ...prev };
      delete updated[surahNumber];
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  // Most recently read surah
  const lastRead = Object.entries(progress)
    .sort(([, a], [, b]) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .map(([surahNum, entry]) => ({ surahNumber: Number(surahNum), ...entry }))[0] ?? null;

  return { saveProgress, getProgress, clearProgress, progress, lastRead };
}

"use client";

import { useState, useEffect, useCallback } from "react";

export type BookmarkType = "quran" | "doa" | "hadith";

export interface QuranBookmark {
  type: "quran";
  surahNumber: number;
  ayahNumber: number;
  surahName: string;
  ayahText: string;
  createdAt: string;
}

export interface DoaBookmark {
  type: "doa";
  slug: string;
  title: string;
  arabic: string;
  createdAt: string;
}

export interface HadithBookmark {
  type: "hadith";
  kitab: string;
  number: number;
  arab: string;
  createdAt: string;
}

export type Bookmark = QuranBookmark | DoaBookmark | HadithBookmark;

const STORAGE_KEY = "islamiva_bookmarks";

function getKey(bookmark: Bookmark): string {
  if (bookmark.type === "quran") return `quran-${bookmark.surahNumber}-${bookmark.ayahNumber}`;
  if (bookmark.type === "doa") return `doa-${bookmark.slug}`;
  return `hadith-${bookmark.kitab}-${bookmark.number}`;
}

function load(): Bookmark[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function save(bookmarks: Bookmark[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    setBookmarks(load());
  }, []);

  const isBookmarked = useCallback(
    (key: string) => bookmarks.some((b) => getKey(b) === key),
    [bookmarks]
  );

  const toggle = useCallback((bookmark: Bookmark) => {
    const key = getKey(bookmark);
    setBookmarks((prev) => {
      const exists = prev.some((b) => getKey(b) === key);
      const next = exists ? prev.filter((b) => getKey(b) !== key) : [...prev, bookmark];
      save(next);
      return next;
    });
    return !bookmarks.some((b) => getKey(b) === key);
  }, [bookmarks]);

  const remove = useCallback((key: string) => {
    setBookmarks((prev) => {
      const next = prev.filter((b) => getKey(b) !== key);
      save(next);
      return next;
    });
  }, []);

  const quranBookmarks = bookmarks.filter((b): b is QuranBookmark => b.type === "quran");
  const doaBookmarks = bookmarks.filter((b): b is DoaBookmark => b.type === "doa");
  const hadithBookmarks = bookmarks.filter((b): b is HadithBookmark => b.type === "hadith");

  return { bookmarks, quranBookmarks, doaBookmarks, hadithBookmarks, isBookmarked, toggle, remove, getKey };
}

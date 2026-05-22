"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";

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

const STORAGE_KEY = "islametra_bookmarks";

const TYPE_MAP: Record<BookmarkType, string> = {
  quran: "QURAN",
  doa: "DOA",
  hadith: "HADITH",
};

export function getKey(bookmark: Bookmark): string {
  if (bookmark.type === "quran") return `quran-${bookmark.surahNumber}-${bookmark.ayahNumber}`;
  if (bookmark.type === "doa") return `doa-${bookmark.slug}`;
  return `hadith-${bookmark.kitab}-${bookmark.number}`;
}

function getReferenceId(bookmark: Bookmark): string {
  return getKey(bookmark);
}

function getMetadata(bookmark: Bookmark): Record<string, unknown> {
  return bookmark as unknown as Record<string, unknown>;
}

function rowToBookmark(row: { type: string; referenceId: string; metadata: unknown; createdAt: Date | string }): Bookmark | null {
  const meta = row.metadata as Record<string, unknown>;
  if (!meta) return null;
  if (row.type === "QURAN") return { ...(meta as unknown as QuranBookmark), type: "quran", createdAt: String(row.createdAt) };
  if (row.type === "DOA") return { ...(meta as unknown as DoaBookmark), type: "doa", createdAt: String(row.createdAt) };
  if (row.type === "HADITH") return { ...(meta as unknown as HadithBookmark), type: "hadith", createdAt: String(row.createdAt) };
  return null;
}

function loadLocal(): Bookmark[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
  } catch {
    return [];
  }
}

function saveLocal(bookmarks: Bookmark[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
}

export function useBookmarks() {
  const { isSignedIn, isLoaded } = useAuth();
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      const localBookmarks = loadLocal();

      fetch("/api/bookmarks")
        .then((r) => r.json())
        .then(async (data: { bookmarks: { type: string; referenceId: string; metadata: unknown; createdAt: string }[] }) => {
          const dbBookmarks = (data.bookmarks ?? []).map(rowToBookmark).filter(Boolean) as Bookmark[];
          const dbKeys = new Set(dbBookmarks.map(getKey));

          // Upload local bookmarks that don't exist in DB yet (merge on login)
          const toUpload = localBookmarks.filter((b) => !dbKeys.has(getKey(b)));
          if (toUpload.length > 0) {
            await Promise.allSettled(
              toUpload.map((bookmark) =>
                fetch("/api/bookmarks", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    type: TYPE_MAP[bookmark.type],
                    referenceId: getReferenceId(bookmark),
                    metadata: getMetadata(bookmark),
                  }),
                })
              )
            );
            // Clear localStorage after successful merge
            localStorage.removeItem(STORAGE_KEY);
          }

          // Merge: DB bookmarks + newly uploaded local ones
          const mergedKeys = new Set(dbBookmarks.map(getKey));
          const merged = [
            ...dbBookmarks,
            ...toUpload.filter((b) => !mergedKeys.has(getKey(b))),
          ];
          setBookmarks(merged);
          setSynced(true);
        })
        .catch(() => {
          setBookmarks(loadLocal());
          setSynced(true);
        });
    } else {
      setBookmarks(loadLocal());
      setSynced(true);
    }
  }, [isSignedIn, isLoaded]);

  const isBookmarked = useCallback(
    (key: string) => bookmarks.some((b) => getKey(b) === key),
    [bookmarks]
  );

  const toggle = useCallback(async (bookmark: Bookmark) => {
    const key = getKey(bookmark);
    const exists = bookmarks.some((b) => getKey(b) === key);

    if (isSignedIn) {
      if (exists) {
        await fetch("/api/bookmarks", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: TYPE_MAP[bookmark.type], referenceId: getReferenceId(bookmark) }),
        });
        setBookmarks((prev) => prev.filter((b) => getKey(b) !== key));
      } else {
        await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: TYPE_MAP[bookmark.type],
            referenceId: getReferenceId(bookmark),
            metadata: getMetadata(bookmark),
          }),
        });
        setBookmarks((prev) => [...prev, { ...bookmark, createdAt: new Date().toISOString() }]);
      }
    } else {
      setBookmarks((prev) => {
        const next = exists ? prev.filter((b) => getKey(b) !== key) : [...prev, bookmark];
        saveLocal(next);
        return next;
      });
    }

    return !exists;
  }, [bookmarks, isSignedIn]);

  const remove = useCallback(async (key: string) => {
    const bookmark = bookmarks.find((b) => getKey(b) === key);
    if (!bookmark) return;

    if (isSignedIn) {
      await fetch("/api/bookmarks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: TYPE_MAP[bookmark.type], referenceId: getReferenceId(bookmark) }),
      });
    } else {
      setBookmarks((prev) => {
        const next = prev.filter((b) => getKey(b) !== key);
        saveLocal(next);
        return next;
      });
    }

    setBookmarks((prev) => prev.filter((b) => getKey(b) !== key));
  }, [bookmarks, isSignedIn]);

  const quranBookmarks = bookmarks.filter((b): b is QuranBookmark => b.type === "quran");
  const doaBookmarks = bookmarks.filter((b): b is DoaBookmark => b.type === "doa");
  const hadithBookmarks = bookmarks.filter((b): b is HadithBookmark => b.type === "hadith");

  return { bookmarks, quranBookmarks, doaBookmarks, hadithBookmarks, isBookmarked, toggle, remove, getKey, synced };
}

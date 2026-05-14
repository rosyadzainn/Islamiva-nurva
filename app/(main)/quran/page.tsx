import type { Metadata } from "next";
import { QuranList } from "@/components/quran/quran-list";

export const metadata: Metadata = {
  title: "Al-Quran Online",
  description:
    "Baca Al-Quran online lengkap 114 surah dengan terjemahan bahasa Indonesia, tafsir, dan audio murottal.",
  keywords: ["alquran online", "baca quran", "quran indonesia", "terjemahan quran"],
};

export default function QuranPage() {
  return <QuranList />;
}

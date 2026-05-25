import type { Metadata } from "next";
import { QuranList } from "@/components/quran/quran-list";

export const metadata: Metadata = {
  title: "Al-Quran Online — Islametra",
  description:
    "Baca Al-Quran online lengkap 114 surah dengan terjemahan bahasa Indonesia dan audio murottal.",
  keywords: ["alquran online", "baca quran", "quran indonesia", "terjemahan quran", "quran digital"],
  alternates: { canonical: "/quran" },
  openGraph: {
    title: "Al-Quran Online — Islametra",
    description: "Baca Al-Quran online lengkap 114 surah dengan terjemahan bahasa Indonesia.",
    url: "https://www.islametra.com/quran",
    type: "website",
  },
};

export default function QuranPage() {
  return <QuranList />;
}

import type { Metadata } from "next";
import { HadithModule } from "@/components/hadith/hadith-module";

export const metadata: Metadata = {
  title: "Hadits Shahih — Bukhari, Muslim & Lainnya | Islametra",
  description:
    "Kumpulan hadits shahih dari Bukhari, Muslim, Tirmidzi, Abu Dawud, Nasai, dan Ibnu Majah dengan terjemahan bahasa Indonesia.",
  keywords: ["hadits", "hadith", "bukhari", "muslim", "hadits shahih", "hadits indonesia"],
  alternates: { canonical: "/hadith" },
  openGraph: {
    title: "Hadits Shahih — Islametra",
    description: "Hadits shahih dari 6 kitab: Bukhari, Muslim, Tirmidzi, Abu Dawud, Nasai, dan Ibnu Majah.",
    url: "https://www.islametra.com/hadith",
    type: "website",
  },
};

export default function HadithPage() {
  return <HadithModule />;
}

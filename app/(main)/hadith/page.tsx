import type { Metadata } from "next";
import { HadithModule } from "@/components/hadith/hadith-module";

export const metadata: Metadata = {
  title: "Hadits Lengkap - Bukhari, Muslim, dan lainnya",
  description:
    "Kumpulan hadits shahih dari Bukhari, Muslim, Tirmidzi, Abu Dawud, Nasai, dan Ibnu Majah dengan terjemahan bahasa Indonesia.",
  keywords: ["hadits", "hadith", "bukhari", "muslim", "hadits shahih"],
};

export default function HadithPage() {
  return <HadithModule />;
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SURAH_LIST } from "@/data/quran-data";
import { SurahReader } from "@/components/quran/surah-reader";

interface Props {
  params: Promise<{ surahId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { surahId } = await params;
  const surahNumber = parseInt(surahId);
  const surah = SURAH_LIST.find((s) => s.number === surahNumber);

  if (!surah) {
    return { title: "Surah tidak ditemukan" };
  }

  return {
    title: `${surah.name} - Surah ${surah.number} Al-Quran`,
    description: `Baca Surah ${surah.name} (${surah.nameTranslation}) dengan ${surah.numberOfAyahs} ayat beserta terjemahan dan tafsir.`,
  };
}

export default async function SurahPage({ params }: Props) {
  const { surahId } = await params;
  const surahNumber = parseInt(surahId);

  if (isNaN(surahNumber) || surahNumber < 1 || surahNumber > 114) {
    notFound();
  }

  const surah = SURAH_LIST.find((s) => s.number === surahNumber);
  if (!surah) notFound();

  return <SurahReader surah={surah} />;
}

export async function generateStaticParams() {
  return SURAH_LIST.map((s) => ({ surahId: s.number.toString() }));
}

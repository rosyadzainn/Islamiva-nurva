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
    title: `Surah ${surah.name} (${surah.number}) — Al-Quran Online | Islametra`,
    description: `Baca Surah ${surah.name} (${surah.nameTranslation}) dengan ${surah.numberOfAyahs} ayat beserta terjemahan bahasa Indonesia.`,
    keywords: [`surah ${surah.name.toLowerCase()}`, `surah ke-${surah.number}`, "al-quran online", "baca quran", "terjemahan quran indonesia", "quran digital"],
    alternates: { canonical: `/quran/${surah.number}` },
    openGraph: {
      title: `Surah ${surah.name} — Al-Quran Online`,
      description: `Baca Surah ${surah.name} (${surah.nameTranslation}) · ${surah.numberOfAyahs} ayat · Terjemahan Indonesia`,
      url: `https://www.islametra.com/quran/${surah.number}`,
      type: "article",
    },
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Islametra", item: "https://www.islametra.com" },
      { "@type": "ListItem", position: 2, name: "Al-Quran", item: "https://www.islametra.com/quran" },
      { "@type": "ListItem", position: 3, name: `Surah ${surah.name}`, item: `https://www.islametra.com/quran/${surah.number}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SurahReader surah={surah} />
    </>
  );
}

export async function generateStaticParams() {
  return SURAH_LIST.map((s) => ({ surahId: s.number.toString() }));
}

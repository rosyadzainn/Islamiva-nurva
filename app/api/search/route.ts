import { NextRequest, NextResponse } from "next/server";
import { SURAH_LIST } from "@/data/quran-data";
import { DAILY_DUAS } from "@/data/doa-data";
import { FEATURED_HADITHS } from "@/data/hadith-data";
import { PROPHETS } from "@/data/prophet-stories";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.toLowerCase().trim();

  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const results: Array<{
    type: string;
    title: string;
    subtitle: string;
    url: string;
  }> = [];

  // Search Quran
  SURAH_LIST.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.nameTranslation.toLowerCase().includes(q) ||
      s.number.toString().includes(q)
  )
    .slice(0, 3)
    .forEach((s) =>
      results.push({
        type: "quran",
        title: `${s.name} - Surah ${s.number}`,
        subtitle: `${s.nameTranslation} • ${s.numberOfAyahs} ayat`,
        url: `/quran/${s.number}`,
      })
    );

  // Search Doa
  DAILY_DUAS.filter(
    (d) =>
      d.title.toLowerCase().includes(q) ||
      d.translation.toLowerCase().includes(q)
  )
    .slice(0, 3)
    .forEach((d) =>
      results.push({
        type: "doa",
        title: d.title,
        subtitle: d.category,
        url: `/doa/${d.slug}`,
      })
    );

  // Search Hadith
  FEATURED_HADITHS.filter((h) => h.id_text.toLowerCase().includes(q))
    .slice(0, 2)
    .forEach((h) =>
      results.push({
        type: "hadith",
        title: `Hadits ${h.kitab} No. ${h.number}`,
        subtitle: h.id_text.slice(0, 80) + "...",
        url: `/hadith/${h.kitab.toLowerCase()}`,
      })
    );

  // Search Prophets
  PROPHETS.filter(
    (p) =>
      p.prophetName.toLowerCase().includes(q) ||
      p.title.toLowerCase().includes(q)
  )
    .slice(0, 2)
    .forEach((p) =>
      results.push({
        type: "story",
        title: p.prophetName,
        subtitle: p.title,
        url: `/kisah-nabi/${p.slug}`,
      })
    );

  return NextResponse.json({ results: results.slice(0, 8) });
}

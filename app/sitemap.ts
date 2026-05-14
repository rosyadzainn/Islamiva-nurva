import type { MetadataRoute } from "next";
import { SURAH_LIST } from "@/data/quran-data";
import { PROPHETS } from "@/data/prophet-stories";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://islamiva.id";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    { url: BASE_URL, changeFrequency: "daily" as const, priority: 1 },
    { url: `${BASE_URL}/quran`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${BASE_URL}/doa`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${BASE_URL}/hadith`, changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${BASE_URL}/kisah-nabi`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE_URL}/sejarah`, changeFrequency: "weekly" as const, priority: 0.8 },
    { url: `${BASE_URL}/ai-chat`, changeFrequency: "daily" as const, priority: 0.8 },
  ];

  const surahPages = SURAH_LIST.map((surah) => ({
    url: `${BASE_URL}/quran/${surah.number}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const prophetPages = PROPHETS.map((prophet) => ({
    url: `${BASE_URL}/kisah-nabi/${prophet.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...surahPages, ...prophetPages];
}

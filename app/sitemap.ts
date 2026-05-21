import type { MetadataRoute } from "next";
import { SURAH_LIST } from "@/data/quran-data";
import { DAILY_DUAS } from "@/data/doa-data";
import { PROPHETS } from "@/data/prophet-stories";

const BASE_URL = "https://www.islametra.com";

const SEJARAH_SLUGS = [
  "abu-bakar-ash-shiddiq",
  "umar-bin-khattab",
  "utsman-bin-affan",
  "ali-bin-abi-thalib",
  "dinasti-umayyah",
  "dinasti-abbasiyah",
  "kekhalifahan-utsmani",
  "islam-di-andalusia",
  "imam-al-ghazali",
  "ibnu-sina",
  "al-khawarizmi",
  "ibnu-khaldun",
  "islam-di-indonesia",
  "islam-asia-tenggara",
  "islam-di-afrika",
  "islam-di-eropa",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/quran`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/doa`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/hadith`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/kisah-nabi`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/sejarah`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/kalender`, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE_URL}/tasbih`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/jadwal-sholat`, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/ai-chat`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/zakat`, changeFrequency: "monthly", priority: 0.7 },
  ];

  const quranRoutes: MetadataRoute.Sitemap = SURAH_LIST.map((s) => ({
    url: `${BASE_URL}/quran/${s.number}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const doaRoutes: MetadataRoute.Sitemap = DAILY_DUAS.map((d) => ({
    url: `${BASE_URL}/doa/${d.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const kisahRoutes: MetadataRoute.Sitemap = PROPHETS.map((p) => ({
    url: `${BASE_URL}/kisah-nabi/${p.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const sejarahRoutes: MetadataRoute.Sitemap = SEJARAH_SLUGS.map((slug) => ({
    url: `${BASE_URL}/sejarah/${slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...quranRoutes, ...doaRoutes, ...kisahRoutes, ...sejarahRoutes];
}

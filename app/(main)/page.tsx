import type { Metadata } from "next";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturedSurah } from "@/components/home/featured-surah";
import { DailyDoa } from "@/components/home/daily-doa";
import { FeaturedHadith } from "@/components/home/featured-hadith";
import { ModuleGrid } from "@/components/home/module-grid";
import { AiChatPreview } from "@/components/home/ai-chat-preview";

export const metadata: Metadata = {
  title: "Islametra - Platform Islami Modern",
  description:
    "Baca Al-Quran, doa harian, hadits, kisah nabi, dan sejarah Islam. Tanya melalui AI Chat Islami yang cerdas dan ramah.",
};

export const revalidate = 3600;

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Islametra",
    url: "https://www.islametra.com",
    description: "Platform Islami modern untuk membaca Al-Quran, doa harian, hadits, kisah nabi, sejarah Islam, dan tanya jawab AI Islami.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://www.islametra.com/quran?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <div style={{ backgroundColor: "var(--islametra-bg)" }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HeroSection />
      <ModuleGrid />
      <FeaturedSurah />
      <DailyDoa />
      <FeaturedHadith />
      <AiChatPreview />
    </div>
  );
}

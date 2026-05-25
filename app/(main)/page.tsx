import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { HeroSection } from "@/components/home/hero-section";

const ModuleGrid = dynamic(() => import("@/components/home/module-grid").then(m => ({ default: m.ModuleGrid })));
const FeaturedSurah = dynamic(() => import("@/components/home/featured-surah").then(m => ({ default: m.FeaturedSurah })));
const DailyDoa = dynamic(() => import("@/components/home/daily-doa").then(m => ({ default: m.DailyDoa })));
const FeaturedHadith = dynamic(() => import("@/components/home/featured-hadith").then(m => ({ default: m.FeaturedHadith })));
const AiChatPreview = dynamic(() => import("@/components/home/ai-chat-preview").then(m => ({ default: m.AiChatPreview })));

export const metadata: Metadata = {
  title: "Islametra - Platform Islami Modern",
  description:
    "Baca Al-Quran, doa harian, hadits, kisah nabi, dan sejarah Islam. Tanya melalui AI Chat Islami yang cerdas dan ramah.",
  alternates: { canonical: "/" },
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

import type { Metadata } from "next";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturedSurah } from "@/components/home/featured-surah";
import { DailyDoa } from "@/components/home/daily-doa";
import { FeaturedHadith } from "@/components/home/featured-hadith";
import { ModuleGrid } from "@/components/home/module-grid";
import { AiChatPreview } from "@/components/home/ai-chat-preview";

export const metadata: Metadata = {
  title: "Islamiva - Platform Islami Modern",
  description:
    "Baca Al-Quran, doa harian, hadits, kisah nabi, dan sejarah Islam. Tanya melalui AI Chat Islami yang cerdas dan ramah.",
};

export default function HomePage() {
  return (
    <div style={{ backgroundColor: "var(--islamiva-bg)" }}>
      <HeroSection />
      <ModuleGrid />
      <FeaturedSurah />
      <DailyDoa />
      <FeaturedHadith />
      <AiChatPreview />
    </div>
  );
}

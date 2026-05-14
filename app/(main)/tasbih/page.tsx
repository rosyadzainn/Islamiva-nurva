import type { Metadata } from "next";
import { TasbihModule } from "@/components/tasbih/tasbih-module";

export const metadata: Metadata = {
  title: "Tasbih Digital - Dzikir & Hitungan",
  description:
    "Tasbih digital untuk membantu dzikir harian. Pilih dzikir, tetapkan target, dan pantau progresmu.",
  keywords: ["tasbih", "dzikir", "subhanallah", "alhamdulillah", "allahu akbar", "zikir"],
};

export default function TasbihPage() {
  return <TasbihModule />;
}

import type { Metadata } from "next";
import { ZakatCalculator } from "@/components/zakat/zakat-calculator";

export const metadata: Metadata = {
  title: "Kalkulator Zakat",
  description: "Hitung zakat maal, zakat fitrah, dan zakat profesi dengan mudah dan akurat.",
};

export default function ZakatPage() {
  return <ZakatCalculator />;
}

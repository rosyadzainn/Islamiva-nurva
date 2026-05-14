import type { Metadata } from "next";
import { KisahNabiList } from "@/components/kisah-nabi/kisah-nabi-list";

export const metadata: Metadata = {
  title: "Kisah Para Nabi",
  description:
    "Kumpulan kisah inspiratif para nabi dan rasul Allah SWT. Belajar dari perjuangan dan keimanan para nabi.",
  keywords: ["kisah nabi", "sejarah nabi", "nabi muhammad", "nabi ibrahim"],
};

export default function KisahNabiPage() {
  return <KisahNabiList />;
}

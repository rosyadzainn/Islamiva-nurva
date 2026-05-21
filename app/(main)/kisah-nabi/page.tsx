import type { Metadata } from "next";
import { KisahNabiList } from "@/components/kisah-nabi/kisah-nabi-list";

export const metadata: Metadata = {
  title: "Kisah Para Nabi — 25 Nabi Islam | Islametra",
  description:
    "Kisah lengkap 25 nabi dan rasul dalam Islam: Nabi Adam, Ibrahim, Musa, Isa, Muhammad dan lainnya. Belajar dari perjuangan dan keimanan para nabi.",
  keywords: ["kisah nabi", "25 nabi", "sejarah nabi", "nabi muhammad", "nabi ibrahim", "nabi musa"],
  openGraph: {
    title: "Kisah Para Nabi — Islametra",
    description: "Kisah lengkap 25 nabi dan rasul dalam Islam dengan narasi yang mendalam.",
    url: "https://www.islametra.com/kisah-nabi",
    type: "website",
  },
};

export default function KisahNabiPage() {
  return <KisahNabiList />;
}

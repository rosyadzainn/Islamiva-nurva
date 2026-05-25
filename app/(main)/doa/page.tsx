import type { Metadata } from "next";
import { DoaModule } from "@/components/doa/doa-module";

export const metadata: Metadata = {
  title: "Doa Harian Lengkap — Islametra",
  description:
    "Kumpulan doa harian lengkap dengan tulisan Arab, Latin, dan terjemahan bahasa Indonesia. Doa sebelum tidur, makan, perjalanan, pagi petang.",
  keywords: ["doa harian", "doa islam", "doa sehari-hari", "doa lengkap", "doa arab latin"],
  alternates: { canonical: "/doa" },
  openGraph: {
    title: "Doa Harian Lengkap — Islametra",
    description: "Kumpulan doa harian lengkap dengan tulisan Arab, Latin, dan terjemahan bahasa Indonesia.",
    url: "https://www.islametra.com/doa",
    type: "website",
  },
};

export default function DoaPage() {
  return <DoaModule />;
}

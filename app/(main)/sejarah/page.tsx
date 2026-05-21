import type { Metadata } from "next";
import { SejarahList } from "@/components/sejarah/sejarah-list";

export const metadata: Metadata = {
  title: "Sejarah Islam — Dinasti, Ulama & Peradaban | Islametra",
  description:
    "Pelajari sejarah Islam dari Khulafaur Rasyidin, Dinasti Umayyah, Abbasiyah, Utsmani, hingga tokoh-tokoh ulama besar seperti Al-Ghazali, Ibnu Sina, dan Ibnu Khaldun.",
  keywords: ["sejarah islam", "khulafaur rasyidin", "dinasti islam", "peradaban islam", "ulama islam"],
  openGraph: {
    title: "Sejarah Islam — Islametra",
    description: "Dari Khulafaur Rasyidin hingga tokoh ulama besar: pelajari sejarah peradaban Islam.",
    url: "https://www.islametra.com/sejarah",
    type: "website",
  },
};

export default function SejarahPage() {
  return <SejarahList />;
}

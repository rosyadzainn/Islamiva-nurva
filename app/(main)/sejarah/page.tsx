import type { Metadata } from "next";
import { SejarahList } from "@/components/sejarah/sejarah-list";

export const metadata: Metadata = {
  title: "Sejarah Islam",
  description:
    "Pelajari sejarah Islam dari masa Nabi Muhammad SAW hingga kejayaan peradaban Islam. Khulafaur Rasyidin, dinasti Islam, dan tokoh-tokoh ulama.",
  keywords: ["sejarah islam", "khulafaur rasyidin", "dinasti islam", "peradaban islam"],
};

export default function SejarahPage() {
  return <SejarahList />;
}

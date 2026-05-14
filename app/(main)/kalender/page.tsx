import type { Metadata } from "next";
import { KalenderModule } from "@/components/kalender/kalender-module";

export const metadata: Metadata = {
  title: "Kalender Hijriah - Konversi & Hari Penting Islam",
  description:
    "Cek tanggal Hijriah hari ini, konversi kalender Masehi ke Hijriah, dan temukan hari-hari penting dalam Islam.",
  keywords: [
    "kalender hijriah",
    "hijri calendar",
    "konversi tanggal",
    "hari penting islam",
    "ramadhan",
    "idul fitri",
    "idul adha",
  ],
};

export default function KalenderPage() {
  return <KalenderModule />;
}

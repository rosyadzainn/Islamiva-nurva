import type { Metadata } from "next";
import { JadwalSholatModule } from "@/components/jadwal-sholat/jadwal-sholat-module";

export const metadata: Metadata = {
  title: "Jadwal Sholat - Waktu Sholat Hari Ini",
  description:
    "Cek jadwal waktu sholat hari ini berdasarkan lokasimu. Dilengkapi dengan countdown ke waktu sholat berikutnya.",
  keywords: ["jadwal sholat", "waktu sholat", "subuh", "dzuhur", "ashar", "maghrib", "isya"],
};

export default function JadwalSholatPage() {
  return <JadwalSholatModule />;
}

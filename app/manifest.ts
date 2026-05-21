import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Islametra - Platform Islami Modern",
    short_name: "Islametra",
    description:
      "Platform Islami modern untuk membaca Al-Quran, doa harian, hadits, kisah nabi, sejarah Islam, dan tanya jawab AI Islami.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#080e0a",
    theme_color: "#080e0a",
    categories: ["education", "lifestyle"],
    lang: "id",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
    screenshots: [
      {
        src: "/opengraph-image",
        sizes: "1200x630",
        type: "image/png",
      },
    ],
    shortcuts: [
      {
        name: "Al-Quran",
        url: "/quran",
        description: "Baca Al-Quran",
      },
      {
        name: "Jadwal Sholat",
        url: "/jadwal-sholat",
        description: "Cek jadwal sholat hari ini",
      },
      {
        name: "Doa Harian",
        url: "/doa",
        description: "Doa-doa harian",
      },
      {
        name: "AI Chat",
        url: "/ai-chat",
        description: "Tanya jawab Islami dengan AI",
      },
    ],
  };
}

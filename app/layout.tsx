import type { Metadata, Viewport } from "next";
import { Inter, Poppins } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Islamiva - Platform Islami Modern",
    template: "%s | Islamiva",
  },
  description:
    "Platform Islami modern untuk membaca Al-Quran, doa harian, hadits, kisah nabi, sejarah Islam, dan tanya jawab AI Islami.",
  keywords: [
    "alquran online",
    "doa harian",
    "hadits lengkap",
    "kisah nabi",
    "sejarah islam",
    "quran indonesia",
    "baca quran",
    "doa islam",
    "AI islami",
  ],
  authors: [{ name: "Islamiva" }],
  creator: "Islamiva",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: "Islamiva - Platform Islami Modern",
    description:
      "Platform Islami modern untuk membaca Al-Quran, doa harian, hadits, kisah nabi, sejarah Islam, dan tanya jawab AI Islami.",
    siteName: "Islamiva",
  },
  twitter: {
    card: "summary_large_image",
    title: "Islamiva - Platform Islami Modern",
    description:
      "Platform Islami modern untuk membaca Al-Quran, doa harian, hadits, kisah nabi, sejarah Islam.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#080e0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

const Inner = ({ children }: { children: React.ReactNode }) => (
  <html
    lang="id"
    suppressHydrationWarning
    className={`${inter.variable} ${poppins.variable}`}
  >
    <head>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Scheherazade+New:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
    </head>
    <body className="min-h-screen antialiased">
      <ThemeProvider>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              borderRadius: "12px",
              background: "var(--card)",
              color: "var(--card-foreground)",
              border: "1px solid var(--border-color)",
            },
          }}
        />
      </ThemeProvider>
    </body>
  </html>
);

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const useClerk = clerkKey.startsWith("pk_live_") || clerkKey.startsWith("pk_test_");

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (useClerk) {
    return (
      <ClerkProvider>
        <Inner>{children}</Inner>
      </ClerkProvider>
    );
  }
  return <Inner>{children}</Inner>;
}

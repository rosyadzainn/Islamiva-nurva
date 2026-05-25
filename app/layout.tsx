import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif, Amiri, Scheherazade_New } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { LanguageProvider } from "@/contexts/language-context";
import { Toaster } from "react-hot-toast";
import { GoogleAnalytics } from "@/components/providers/google-analytics";
import { PwaRegister } from "@/components/shared/pwa-register";
import { PresenceTracker } from "@/components/shared/presence-tracker";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

const scheherazade = Scheherazade_New({
  subsets: ["arabic"],
  weight: ["400"],
  variable: "--font-scheherazade",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://www.islametra.com"),
  title: {
    default: "Islametra - Platform Islami Modern",
    template: "%s | Islametra",
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
  authors: [{ name: "Islametra" }],
  creator: "Islametra",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/icon.svg",
    shortcut: "/icon.svg",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: "Islametra - Platform Islami Modern",
    description:
      "Platform Islami modern untuk membaca Al-Quran, doa harian, hadits, kisah nabi, sejarah Islam, dan tanya jawab AI Islami.",
    siteName: "Islametra",
  },
  twitter: {
    card: "summary_large_image",
    title: "Islametra - Platform Islami Modern",
    description:
      "Platform Islami modern untuk membaca Al-Quran, doa harian, hadits, kisah nabi, sejarah Islam.",
  },
  verification: {
    google: "EABhXGM5IWoxjf5uL0HDIMGkXBnbWyk1vtvzFOoWXRc",
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
    className={`${geist.variable} ${geistMono.variable} ${instrumentSerif.variable} ${amiri.variable} ${scheherazade.variable}`}
  >
    <head>
      <link rel="preconnect" href="https://clerk.islametra.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
    </head>
    <body className="min-h-screen antialiased" suppressHydrationWarning>
      <a href="#main-content" className="skip-nav">
        Skip to main content
      </a>
      <GoogleAnalytics />
      <PwaRegister />
      <PresenceTracker />
      <ThemeProvider>
        <LanguageProvider>
        {children}
        </LanguageProvider>
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
      <ClerkProvider
        signInUrl="/sign-in"
        signUpUrl="/sign-up"
        afterSignOutUrl="/"
      >
        <Inner>{children}</Inner>
      </ClerkProvider>
    );
  }
  return <Inner>{children}</Inner>;
}

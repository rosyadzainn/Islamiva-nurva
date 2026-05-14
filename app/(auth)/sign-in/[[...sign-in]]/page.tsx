"use client";

import { useState, useEffect } from "react";
import { SignIn } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { Sparkles } from "lucide-react";

export default function SignInPage() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isLight = mounted && theme === "light";

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--islamiva-bg)",
        padding: "24px 16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 640,
          height: 360,
          background: "radial-gradient(ellipse, oklch(0.62 0.13 155 / 0.10), transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ width: "100%", maxWidth: 420, position: "relative" }}>
        {/* Logo + header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: "linear-gradient(180deg, oklch(0.68 0.13 155) 0%, oklch(0.53 0.12 155) 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              boxShadow: "0 8px 24px -8px oklch(0.62 0.13 155 / 0.5)",
              fontSize: 22,
              color: "#08110b",
              fontWeight: 700,
              fontFamily: "'Amiri', serif",
            }}
          >
            ن
          </div>
          <h1
            style={{
              fontFamily: "'Geist', sans-serif",
              fontWeight: 600,
              fontSize: 22,
              letterSpacing: "-0.02em",
              color: "var(--islamiva-fg)",
              marginBottom: 6,
            }}
          >
            Masuk ke{" "}
            <em
              style={{
                fontFamily: "'Instrument Serif', serif",
                fontStyle: "italic",
                fontWeight: 400,
                color: "var(--islamiva-emerald-soft)",
              }}
            >
              Islamiva
            </em>
          </h1>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11,
              color: "var(--islamiva-fg-dim)",
              fontFamily: "'Geist Mono', monospace",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            <Sparkles size={9} style={{ color: "var(--islamiva-emerald)" }} />
            Platform Islami Modern
          </div>
        </div>

        <SignIn
          appearance={{
            elements: {
              card: "bg-[var(--islamiva-bg-1)] border border-[var(--islamiva-line)] shadow-2xl rounded-2xl",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              formButtonPrimary:
                "bg-emerald-600 hover:bg-emerald-500 text-white font-medium font-[Geist]",
              formFieldInput: isLight
                ? "bg-[rgba(0,0,0,0.04)] border-[var(--islamiva-line)] text-[var(--islamiva-fg)] placeholder:text-[var(--islamiva-fg-dim)]"
                : "bg-[rgba(255,255,255,0.04)] border-[var(--islamiva-line)] text-[var(--islamiva-fg)] placeholder:text-[var(--islamiva-fg-dim)]",
              footerActionLink: "text-emerald-400 hover:text-emerald-300",
            },
          }}
        />
      </div>
    </div>
  );
}

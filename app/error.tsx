"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { useLang } from "@/contexts/language-context";
import { translations } from "@/lib/translations";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { lang } = useLang();
  const te = translations[lang].errorPage;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--islametra-bg)",
        padding: "24px 16px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow — warm amber tint for error state */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          height: 280,
          background: "radial-gradient(ellipse, oklch(0.82 0.08 80 / 0.07), transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <div style={{ textAlign: "center", position: "relative" }}>
        {/* Icon */}
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 20,
            background: "oklch(0.82 0.08 80 / 0.08)",
            border: "1px solid oklch(0.82 0.08 80 / 0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 28px",
          }}
        >
          <AlertTriangle size={32} style={{ color: "oklch(0.82 0.08 80)" }} />
        </div>

        <h1
          style={{
            fontFamily: "'Geist', sans-serif",
            fontWeight: 600,
            fontSize: "clamp(18px, 3vw, 24px)",
            letterSpacing: "-0.02em",
            color: "var(--islametra-fg)",
            marginBottom: 10,
          }}
        >
          {te.title}{" "}
          <em
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: "italic",
              fontWeight: 400,
              color: "oklch(0.88 0.06 80)",
            }}
          >
            {te.titleEm}
          </em>
        </h1>

        <p
          style={{
            fontSize: 14,
            color: "var(--islametra-fg-mute)",
            lineHeight: 1.65,
            maxWidth: 340,
            margin: "0 auto 32px",
            fontFamily: "'Geist', sans-serif",
          }}
        >
          {te.sub}
        </p>

        <button
          onClick={reset}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 22px",
            borderRadius: 10,
            background: "linear-gradient(180deg, oklch(0.68 0.13 155) 0%, oklch(0.53 0.12 155) 100%)",
            color: "#08110b",
            fontSize: 14,
            fontWeight: 600,
            fontFamily: "'Geist', sans-serif",
            border: "none",
            cursor: "pointer",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 16px -6px oklch(0.62 0.13 155 / 0.5)",
            transition: "opacity 0.15s",
          }}
        >
          <RefreshCw size={15} />
          {te.retry}
        </button>
      </div>
    </div>
  );
}

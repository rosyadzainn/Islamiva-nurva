"use client";

import Link from "next/link";
import { BookOpen, ArrowLeft } from "lucide-react";
import { useLang } from "@/contexts/language-context";
import { translations } from "@/lib/translations";

export default function NotFound() {
  const { lang } = useLang();
  const tn = translations[lang].notFound;
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
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          height: 280,
          background: "radial-gradient(ellipse, oklch(0.62 0.13 155 / 0.08), transparent 70%)",
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
            background: "oklch(0.62 0.13 155 / 0.08)",
            border: "1px solid oklch(0.62 0.13 155 / 0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 28px",
          }}
        >
          <BookOpen size={32} style={{ color: "oklch(0.78 0.13 155)" }} />
        </div>

        {/* 404 number */}
        <p
          style={{
            fontFamily: "'Geist', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(64px, 12vw, 96px)",
            letterSpacing: "-0.05em",
            lineHeight: 1,
            color: "var(--islametra-fg)",
            marginBottom: 12,
          }}
        >
          4
          <em
            style={{
              fontFamily: "'Instrument Serif', serif",
              fontStyle: "italic",
              fontWeight: 400,
              color: "var(--islametra-emerald-soft)",
            }}
          >
            0
          </em>
          4
        </p>

        {/* Heading */}
        <h1
          style={{
            fontFamily: "'Geist', sans-serif",
            fontWeight: 500,
            fontSize: "clamp(16px, 2.5vw, 20px)",
            letterSpacing: "-0.01em",
            color: "var(--islametra-fg-soft)",
            marginBottom: 10,
          }}
        >
          {tn.heading}
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
          {tn.sub}
        </p>

        {/* CTA */}
        <Link
          href="/"
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
            textDecoration: "none",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 16px -6px oklch(0.62 0.13 155 / 0.5)",
            transition: "opacity 0.15s",
          }}
        >
          <ArrowLeft size={15} />
          {tn.cta}
        </Link>
      </div>
    </div>
  );
}

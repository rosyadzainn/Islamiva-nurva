"use client";

import { useState } from "react";
import { Copy, CheckCheck } from "lucide-react";
import { toast } from "react-hot-toast";
import { useLang } from "@/contexts/language-context";
import { translations } from "@/lib/translations";

interface Props {
  arabic: string;
  latin: string;
  translation: string;
  source?: string;
}

export function DoaCopyButton({ arabic, latin, translation, source }: Props) {
  const [copied, setCopied] = useState(false);
  const { lang } = useLang();
  const td = translations[lang].doaModule;

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `${arabic}\n\n${latin}\n\n${translation}${source ? `\n\n(${source})` : ""}`
    );
    setCopied(true);
    toast.success(td.toastCopied);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        width: "100%", padding: "12px 20px", borderRadius: 12,
        background: copied ? "oklch(0.62 0.13 155 / 0.1)" : "rgba(255,255,255,0.03)",
        border: copied ? "1px solid oklch(0.62 0.13 155 / 0.3)" : "1px solid var(--islametra-line)",
        color: copied ? "oklch(0.85 0.1 155)" : "var(--islametra-fg-mute)",
        fontSize: 13, fontFamily: "'Geist', sans-serif",
        cursor: "pointer", marginBottom: 8, transition: "all 0.2s",
      }}
    >
      {copied ? <CheckCheck size={14} /> : <Copy size={14} />}
      {copied ? td.copied : td.copy}
    </button>
  );
}

"use client";

import { useState } from "react";
import { Copy, CheckCheck } from "lucide-react";
import { toast } from "react-hot-toast";

interface Props {
  arabic: string;
  latin: string;
  translation: string;
  source?: string;
}

export function DoaCopyButton({ arabic, latin, translation, source }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(
      `${arabic}\n\n${latin}\n\n${translation}${source ? `\n\n(${source})` : ""}`
    );
    setCopied(true);
    toast.success("Doa berhasil disalin!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        width: "100%", padding: "12px 20px", borderRadius: 12,
        background: copied ? "oklch(0.62 0.13 155 / 0.1)" : "rgba(255,255,255,0.03)",
        border: copied ? "1px solid oklch(0.62 0.13 155 / 0.3)" : "1px solid var(--islamiva-line)",
        color: copied ? "oklch(0.85 0.1 155)" : "var(--islamiva-fg-mute)",
        fontSize: 13, fontFamily: "'Geist', sans-serif",
        cursor: "pointer", marginBottom: 8, transition: "all 0.2s",
      }}
    >
      {copied ? <CheckCheck size={14} /> : <Copy size={14} />}
      {copied ? "Tersalin!" : "Salin Doa"}
    </button>
  );
}

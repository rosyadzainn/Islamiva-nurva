"use client";

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const stored = localStorage.getItem("islametra_theme") as "dark" | "light" | null;
    const resolved = stored ?? "dark";
    setTheme(resolved);
    document.documentElement.setAttribute("data-theme", resolved);
  }, []);

  const toggle = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("islametra_theme", next);
  };

  return (
    <button
      onClick={toggle}
      title={theme === "dark" ? "Ganti ke mode terang" : "Ganti ke mode gelap"}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 34,
        height: 34,
        borderRadius: 9,
        border: "1px solid var(--islametra-line)",
        background: "rgba(255,255,255,0.04)",
        color: "var(--islametra-fg-dim)",
        cursor: "pointer",
        transition: "all 0.2s",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.08)";
        e.currentTarget.style.color = "var(--islametra-fg-soft)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        e.currentTarget.style.color = "var(--islametra-fg-dim)";
      }}
    >
      {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}

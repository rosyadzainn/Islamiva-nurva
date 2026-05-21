"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

type Props = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export function AdminNavLink({ href, label, icon: Icon }: Props) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 12px",
        borderRadius: 9,
        textDecoration: "none",
        fontSize: 13,
        fontFamily: "'Geist', sans-serif",
        transition: "background 0.15s, color 0.15s",
        background: active ? "rgba(255,255,255,0.06)" : "transparent",
        color: active ? "var(--islametra-fg-soft)" : "var(--islametra-fg-mute)",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
          (e.currentTarget as HTMLElement).style.color = "var(--islametra-fg-soft)";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          (e.currentTarget as HTMLElement).style.background = "transparent";
          (e.currentTarget as HTMLElement).style.color = "var(--islametra-fg-mute)";
        }
      }}
    >
      <Icon size={15} />
      {label}
    </Link>
  );
}

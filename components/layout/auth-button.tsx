"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { useLang } from "@/contexts/language-context";
import { translations } from "@/lib/translations";
import { LogOut } from "lucide-react";

export function AuthButton({ mobile }: { mobile?: boolean }) {
  const { isSignedIn, isLoaded, user } = useUser();
  const { openUserProfile, signOut } = useClerk();
  const [imgError, setImgError] = useState(false);
  const [loadTimeout, setLoadTimeout] = useState(false);
  const { lang } = useLang();
  const tn = translations[lang].nav;
  const tc = translations[lang].common;

  useEffect(() => {
    if (isLoaded) return;
    const t = setTimeout(() => setLoadTimeout(true), 2500);
    return () => clearTimeout(t);
  }, [isLoaded]);

  const initials = (
    (user?.firstName?.[0] ?? "") + (user?.lastName?.[0] ?? "")
  ).toUpperCase() || user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() || "?";

  if (!isLoaded && !loadTimeout) {
    return mobile ? null : (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 9999,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid var(--islametra-line)",
          flexShrink: 0,
        }}
      />
    );
  }

  if (isSignedIn) {
    const avatar = (
      <button
        onClick={() => openUserProfile()}
        aria-label="Buka profil"
        style={{
          width: mobile ? 40 : 32,
          height: mobile ? 40 : 32,
          borderRadius: "50%",
          overflow: "hidden",
          border: "2px solid oklch(0.62 0.13 155 / 0.35)",
          cursor: "pointer",
          flexShrink: 0,
          padding: 0,
          background: "oklch(0.45 0.14 155)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "border-color 0.15s ease",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "oklch(0.62 0.13 155 / 0.6)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "oklch(0.62 0.13 155 / 0.35)"; }}
      >
        {user?.imageUrl && !imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.imageUrl}
            alt={user?.firstName ?? "Profil"}
            onError={() => setImgError(true)}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <span
            style={{
              fontSize: mobile ? 14 : 12,
              fontWeight: 700,
              color: "#fff",
              fontFamily: "'Geist', sans-serif",
              userSelect: "none",
              lineHeight: 1,
            }}
          >
            {initials}
          </span>
        )}
      </button>
    );

    if (mobile) {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 14px",
            borderRadius: 12,
            background: "oklch(0.62 0.13 155 / 0.08)",
            border: "1px solid oklch(0.62 0.13 155 / 0.2)",
          }}
        >
          {avatar}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "var(--islametra-fg)",
                fontFamily: "'Geist', sans-serif",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] ?? tc.guest}
            </p>
            <p
              style={{
                fontSize: 11,
                color: "oklch(0.78 0.13 155)",
                fontFamily: "'Geist Mono', monospace",
                letterSpacing: "0.02em",
              }}
            >
              ● {tc.loggedIn}
            </p>
          </div>
          <button
            onClick={() => signOut()}
            aria-label="Keluar"
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              border: "1px solid var(--islametra-line)",
              background: "rgba(255,255,255,0.04)",
              color: "var(--islametra-fg-dim)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <LogOut size={13} />
          </button>
        </div>
      );
    }

    return (
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {avatar}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "4px 10px",
            borderRadius: 9999,
            background: "oklch(0.62 0.13 155 / 0.1)",
            border: "1px solid oklch(0.62 0.13 155 / 0.2)",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "oklch(0.78 0.13 155)",
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 11,
              fontFamily: "'Geist', sans-serif",
              fontWeight: 500,
              color: "oklch(0.85 0.1 155)",
              whiteSpace: "nowrap",
            }}
          >
            {user?.firstName ?? tn.signIn}
          </span>
        </div>
      </div>
    );
  }

  if (mobile) {
    return (
      <Link
        href="/sign-in"
        style={{
          display: "block",
          width: "100%",
          padding: "14px",
          borderRadius: 14,
          textAlign: "center",
          fontSize: 15,
          fontWeight: 600,
          fontFamily: "'Geist', sans-serif",
          background:
            "linear-gradient(180deg, oklch(0.7 0.13 155) 0%, oklch(0.55 0.12 155) 100%)",
          color: "#08110b",
          boxShadow:
            "inset 0 1px 0 rgba(255,255,255,0.2), 0 4px 16px -8px oklch(0.62 0.13 155 / 0.5)",
          textDecoration: "none",
        }}
      >
        {tn.signInFull}
      </Link>
    );
  }

  return (
    <Link
      href="/sign-in"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        height: 32,
        padding: "0 14px",
        borderRadius: 8,
        fontSize: 12.5,
        fontWeight: 500,
        fontFamily: "'Geist', sans-serif",
        textDecoration: "none",
        background:
          "linear-gradient(180deg, oklch(0.68 0.13 155) 0%, oklch(0.52 0.12 155) 100%)",
        color: "#08110b",
        boxShadow:
          "inset 0 1px 0 rgba(255,255,255,0.22), 0 4px 16px -8px oklch(0.62 0.13 155 / 0.5)",
        whiteSpace: "nowrap",
      }}
    >
      {tn.signIn}
    </Link>
  );
}

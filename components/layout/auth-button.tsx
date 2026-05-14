"use client";

import Link from "next/link";
import { UserButton, useUser } from "@clerk/nextjs";

export function AuthButton({ mobile }: { mobile?: boolean }) {
  const { isSignedIn, isLoaded, user } = useUser();

  if (!isLoaded) {
    return mobile ? null : (
      <div
        style={{
          width: 30,
          height: 30,
          borderRadius: 9999,
          background: "rgba(255,255,255,0.06)",
          border: "1px solid var(--islamiva-line)",
          flexShrink: 0,
        }}
      />
    );
  }

  if (isSignedIn) {
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
          <UserButton
            appearance={{ elements: { avatarBox: { width: 32, height: 32 } } }}
          />
          <div>
            <p
              style={{
                fontSize: 13,
                fontWeight: 500,
                color: "var(--islamiva-fg)",
                fontFamily: "'Geist', sans-serif",
              }}
            >
              {user?.firstName ?? user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] ?? "Pengguna"}
            </p>
            <p
              style={{
                fontSize: 11,
                color: "oklch(0.78 0.13 155)",
                fontFamily: "'Geist Mono', monospace",
                letterSpacing: "0.02em",
              }}
            >
              ● Sudah masuk
            </p>
          </div>
        </div>
      );
    }

    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "4px 10px 4px 6px",
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
            {user?.firstName ?? "Masuk"}
          </span>
        </div>
        <UserButton
          appearance={{ elements: { avatarBox: { width: 28, height: 28 } } }}
        />
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
        Masuk ke Islamiva
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
      Masuk
    </Link>
  );
}

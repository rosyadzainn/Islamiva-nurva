"use client";

import { useEffect, useRef, useState } from "react";

const HEARTBEAT_INTERVAL = 30_000;

// Session ID lives only for this browser tab — no localStorage persistence.
// This avoids inflated counts from stale localStorage entries across devices.
const TAB_SESSION_ID = typeof crypto !== "undefined" ? crypto.randomUUID() : Math.random().toString(36).slice(2);

export function PresenceTracker() {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  async function heartbeat() {
    try {
      const sessionId = TAB_SESSION_ID;
      const path = window.location.pathname;
      const res = await fetch("/api/presence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, path }),
      });
      if (res.ok) {
        const data = await res.json();
        setCount(data.count ?? 0);
        setVisible(true);
      }
    } catch {
      // silently ignore — non-critical feature
    }
  }

  useEffect(() => {
    heartbeat();
    timerRef.current = setInterval(heartbeat, HEARTBEAT_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  if (!visible || count === 0) return null;

  return (
    <div
      aria-label={`${count} orang sedang online`}
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        gap: 5,
        padding: "3px 9px 3px 7px",
        borderRadius: 99,
        background: "rgba(10,12,11,0.72)",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 2px 12px -4px rgba(0,0,0,0.4)",
        fontSize: 11,
        fontFamily: "'Geist Mono', monospace",
        color: "var(--islametra-fg-mute)",
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: "oklch(0.72 0.18 145)",
          boxShadow: "0 0 6px oklch(0.72 0.18 145 / 0.7)",
          flexShrink: 0,
          animation: "presence-pulse 2s ease-in-out infinite",
        }}
      />
      <span style={{ color: "var(--islametra-fg-soft)" }}>{count}</span>
      <span>online</span>
      <style>{`
        @keyframes presence-pulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 6px oklch(0.72 0.18 145 / 0.7); }
          50% { opacity: 0.6; box-shadow: 0 0 10px oklch(0.72 0.18 145 / 0.4); }
        }
      `}</style>
    </div>
  );
}

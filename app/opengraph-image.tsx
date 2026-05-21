import { ImageResponse } from "next/og";

export const alt = "Islametra - Platform Islami Modern";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#080e0a",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 700,
            height: 400,
            background:
              "radial-gradient(ellipse, rgba(30,120,60,0.18) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Top subtle grid lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Corner decorations */}
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 40,
            width: 60,
            height: 60,
            border: "1px solid rgba(50,180,90,0.2)",
            borderRadius: 12,
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 40,
            right: 40,
            width: 60,
            height: 60,
            border: "1px solid rgba(50,180,90,0.2)",
            borderRadius: 12,
            display: "flex",
          }}
        />

        {/* Logo area */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 20,
          }}
        >
          {/* Logo icon */}
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background:
                "linear-gradient(135deg, rgba(50,180,90,0.3) 0%, rgba(30,120,60,0.15) 100%)",
              border: "1px solid rgba(50,180,90,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
            }}
          >
            ☽
          </div>

          {/* Brand name */}
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: "#ffffff",
              letterSpacing: "-0.04em",
              fontFamily: "sans-serif",
            }}
          >
            Islametra
          </div>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 24,
            color: "rgba(255,255,255,0.45)",
            fontFamily: "sans-serif",
            fontWeight: 400,
            letterSpacing: "0.01em",
            textAlign: "center",
            maxWidth: 620,
            marginBottom: 48,
          }}
        >
          Platform Islami Modern
        </div>

        {/* Feature pills */}
        <div
          style={{
            display: "flex",
            gap: 12,
          }}
        >
          {["Al-Quran", "Doa Harian", "Hadith", "Kisah Nabi", "AI Islami"].map(
            (feature) => (
              <div
                key={feature}
                style={{
                  padding: "8px 18px",
                  borderRadius: 999,
                  background: "rgba(50,180,90,0.1)",
                  border: "1px solid rgba(50,180,90,0.2)",
                  fontSize: 14,
                  color: "rgba(120,220,140,0.9)",
                  fontFamily: "sans-serif",
                  fontWeight: 500,
                }}
              >
                {feature}
              </div>
            )
          )}
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 16,
            color: "rgba(255,255,255,0.2)",
            fontFamily: "sans-serif",
            letterSpacing: "0.08em",
          }}
        >
          www.islametra.com
        </div>
      </div>
    ),
    { ...size }
  );
}

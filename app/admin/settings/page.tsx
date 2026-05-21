import { requireAdmin } from "@/lib/admin-guard";
import { AdminSettingsForm } from "@/components/admin/admin-settings-form";

export const dynamic = "force-dynamic";

async function getSettings(): Promise<Record<string, string>> {
  try {
    const { default: prisma } = await import("@/lib/prisma");
    const rows = await prisma.siteSetting.findMany();
    const settings: Record<string, string> = {
      site_notice: "",
      maintenance_mode: "false",
      featured_article_slug: "",
    };
    for (const row of rows) settings[row.key] = row.value;
    return settings;
  } catch {
    return { site_notice: "", maintenance_mode: "false", featured_article_slug: "" };
  }
}

export default async function AdminSettingsPage() {
  await requireAdmin();
  const settings = await getSettings();

  return (
    <div style={{ padding: 32, maxWidth: 680 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Geist', sans-serif", fontWeight: 600, fontSize: 22, letterSpacing: "-0.02em", color: "var(--islametra-fg)", marginBottom: 4 }}>
          <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400, color: "oklch(0.78 0.13 155)" }}>Pengaturan</em>
        </h1>
        <p style={{ fontSize: 13, color: "var(--islametra-fg-dim)", fontFamily: "'Geist', sans-serif" }}>
          Konfigurasi platform Islametra
        </p>
      </div>

      <AdminSettingsForm initialSettings={settings} />

      {/* System info */}
      <div style={{ marginTop: 32, borderRadius: 14, backgroundColor: "var(--islametra-bg)", border: "1px solid var(--islametra-line)", overflow: "hidden" }}>
        <div style={{ padding: "12px 20px", borderBottom: "1px solid var(--islametra-line)" }}>
          <p style={{ fontSize: 11, fontFamily: "'Geist Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--islametra-fg-dim)" }}>Info Sistem</p>
        </div>
        {[
          { label: "Domain", value: "islametra.com" },
          { label: "Database", value: "PostgreSQL (Neon)" },
          { label: "Auth", value: "Clerk v7" },
          { label: "Framework", value: "Next.js 16 (Turbopack)" },
        ].map((item, i, arr) => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: i < arr.length - 1 ? "1px solid var(--islametra-line)" : "none" }}>
            <span style={{ fontSize: 13, color: "var(--islametra-fg-mute)", fontFamily: "'Geist', sans-serif" }}>{item.label}</span>
            <span style={{ fontSize: 13, fontFamily: "'Geist Mono', monospace", color: "var(--islametra-fg-soft)" }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

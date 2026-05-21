"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { toast } from "react-hot-toast";

interface Props {
  initialSettings: Record<string, string>;
}

export function AdminSettingsForm({ initialSettings }: Props) {
  const [settings, setSettings] = useState(initialSettings);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        toast.success("Pengaturan disimpan!");
      } else {
        toast.error("Gagal menyimpan pengaturan.");
      }
    } catch {
      toast.error("Terjadi kesalahan.");
    } finally {
      setSaving(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px", borderRadius: 10,
    background: "rgba(255,255,255,0.04)", border: "1px solid var(--islametra-line)",
    color: "var(--islametra-fg)", fontFamily: "'Geist', sans-serif", fontSize: 14,
    outline: "none", boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = { fontSize: 12, color: "var(--islametra-fg-dim)", fontFamily: "'Geist', sans-serif", marginBottom: 6, display: "block" };

  return (
    <div style={{ borderRadius: 14, backgroundColor: "var(--islametra-bg)", border: "1px solid var(--islametra-line)", overflow: "hidden", marginBottom: 16 }}>
      <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--islametra-line)" }}>
        <p style={{ fontSize: 11, fontFamily: "'Geist Mono', monospace", letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--islametra-fg-dim)" }}>Pengaturan Situs</p>
      </div>
      <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 18 }}>

        {/* Site Notice */}
        <div>
          <label style={labelStyle}>Notifikasi Banner (kosongkan untuk nonaktifkan)</label>
          <input
            value={settings.site_notice ?? ""}
            onChange={e => setSettings(p => ({ ...p, site_notice: e.target.value }))}
            style={inputStyle}
            placeholder="Contoh: Website sedang dalam pemeliharaan..."
          />
          <p style={{ fontSize: 11, color: "var(--islametra-fg-dim)", fontFamily: "'Geist', sans-serif", marginTop: 4 }}>
            Tampil sebagai banner di bagian atas website untuk semua pengunjung.
          </p>
        </div>

        {/* Featured Article */}
        <div>
          <label style={labelStyle}>Slug Artikel Unggulan</label>
          <input
            value={settings.featured_article_slug ?? ""}
            onChange={e => setSettings(p => ({ ...p, featured_article_slug: e.target.value }))}
            style={inputStyle}
            placeholder="contoh-slug-artikel"
          />
          <p style={{ fontSize: 11, color: "var(--islametra-fg-dim)", fontFamily: "'Geist', sans-serif", marginTop: 4 }}>
            Slug artikel yang ditampilkan sebagai unggulan di halaman utama.
          </p>
        </div>

        {/* Maintenance Mode */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <input
            type="checkbox"
            id="maintenance"
            checked={settings.maintenance_mode === "true"}
            onChange={e => setSettings(p => ({ ...p, maintenance_mode: e.target.checked ? "true" : "false" }))}
            style={{ width: 16, height: 16, cursor: "pointer", accentColor: "oklch(0.62 0.13 155)" }}
          />
          <div>
            <label htmlFor="maintenance" style={{ ...labelStyle, marginBottom: 2, cursor: "pointer" }}>Mode Pemeliharaan</label>
            <p style={{ fontSize: 11, color: "var(--islametra-fg-dim)", fontFamily: "'Geist', sans-serif" }}>
              Ketika aktif, pengunjung akan melihat halaman pemeliharaan.
            </p>
          </div>
        </div>

        <div style={{ paddingTop: 4 }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "10px 20px", borderRadius: 10, border: "none",
              background: saving ? "rgba(255,255,255,0.06)" : "linear-gradient(180deg, oklch(0.7 0.13 155) 0%, oklch(0.55 0.12 155) 100%)",
              color: saving ? "var(--islametra-fg-dim)" : "#08110b",
              fontSize: 13, fontWeight: 600, fontFamily: "'Geist', sans-serif",
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            <Save size={14} />
            {saving ? "Menyimpan..." : "Simpan Pengaturan"}
          </button>
        </div>
      </div>
    </div>
  );
}

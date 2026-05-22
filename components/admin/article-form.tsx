"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, ImageIcon, X } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { RichTextEditor } from "./rich-text-editor";

const CATEGORIES = ["Khulafaur Rasyidin", "Dinasti & Kekhalifahan", "Tokoh & Ulama Islam", "Penyebaran Islam", "Lainnya"];

interface ArticleData {
  id?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  imageUrl?: string;
  category?: string;
  published?: boolean;
  seoTitle?: string;
  seoDesc?: string;
}

export function ArticleForm({ initial }: { initial?: ArticleData }) {
  const router = useRouter();
  const isEdit = !!initial?.id;
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(initial?.imageUrl ?? "");
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    excerpt: initial?.excerpt ?? "",
    content: initial?.content ?? "",
    imageUrl: initial?.imageUrl ?? "",
    category: initial?.category ?? CATEGORIES[0],
    published: initial?.published ?? false,
    seoTitle: initial?.seoTitle ?? "",
    seoDesc: initial?.seoDesc ?? "",
  });

  const handleChange = (field: string, value: string | boolean) => {
    if (field === "title" && typeof value === "string" && !isEdit) {
      setForm(prev => ({ ...prev, title: value, slug: value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") }));
    } else {
      setForm(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleImageUrl = (url: string) => {
    handleChange("imageUrl", url);
    setImagePreview(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.content || form.content === "<p></p>") {
      toast.error("Judul dan konten wajib diisi.");
      return;
    }
    setLoading(true);
    try {
      const url = isEdit ? `/api/admin/articles/${initial!.id}` : "/api/admin/articles";
      const method = isEdit ? "PATCH" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success(isEdit ? "Artikel berhasil diperbarui!" : "Artikel berhasil disimpan!");
        router.push("/admin/articles");
        router.refresh();
      } else {
        const d = await res.json();
        toast.error(d.error ?? "Gagal menyimpan artikel.");
      }
    } catch {
      toast.error("Terjadi kesalahan.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px", borderRadius: 10,
    background: "rgba(255,255,255,0.04)", border: "1px solid var(--islametra-line)",
    color: "var(--islametra-fg)", fontFamily: "'Geist', sans-serif", fontSize: 14,
    outline: "none", boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 12, color: "var(--islametra-fg-dim)", fontFamily: "'Geist', sans-serif", marginBottom: 6, display: "block",
  };

  return (
    <div style={{ padding: 32, maxWidth: 820 }}>
      <Link href="/admin/articles" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "var(--islametra-fg-dim)", fontFamily: "'Geist', sans-serif", marginBottom: 24, textDecoration: "none" }}>
        <ChevronLeft size={15} /> Kembali ke Artikel
      </Link>

      <h1 style={{ fontFamily: "'Geist', sans-serif", fontWeight: 600, fontSize: 22, letterSpacing: "-0.02em", color: "var(--islametra-fg)", marginBottom: 28 }}>
        {isEdit ? (
          <>Edit <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400, color: "oklch(0.78 0.13 155)" }}>Artikel</em></>
        ) : (
          <>Artikel <em style={{ fontFamily: "'Instrument Serif', serif", fontStyle: "italic", fontWeight: 400, color: "oklch(0.78 0.13 155)" }}>Baru</em></>
        )}
      </h1>

      <form onSubmit={handleSubmit}>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

          {/* Title + Slug */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={labelStyle}>Judul *</label>
              <input value={form.title} onChange={e => handleChange("title", e.target.value)} style={inputStyle} placeholder="Judul artikel..." />
            </div>
            <div>
              <label style={labelStyle}>Slug (URL)</label>
              <input value={form.slug} onChange={e => handleChange("slug", e.target.value)} style={inputStyle} placeholder="judul-artikel" />
            </div>
          </div>

          {/* Category + Publish */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div>
              <label style={labelStyle}>Kategori</label>
              <select value={form.category} onChange={e => handleChange("category", e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, paddingTop: 22 }}>
              <input type="checkbox" id="published" checked={form.published} onChange={e => handleChange("published", e.target.checked)}
                style={{ width: 16, height: 16, cursor: "pointer", accentColor: "oklch(0.62 0.13 155)" }} />
              <label htmlFor="published" style={{ ...labelStyle, marginBottom: 0, cursor: "pointer" }}>Publikasikan sekarang</label>
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label style={labelStyle}>Gambar Cover (URL)</label>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <input value={form.imageUrl} onChange={e => handleImageUrl(e.target.value)} style={inputStyle} placeholder="https://contoh.com/gambar.jpg" />
              </div>
              {imagePreview ? (
                <div style={{ position: "relative", flexShrink: 0 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={imagePreview} alt="Preview" style={{ width: 80, height: 56, objectFit: "cover", borderRadius: 8, border: "1px solid var(--islametra-line)" }} onError={() => setImagePreview("")} />
                  <button type="button" aria-label="Hapus gambar" onClick={() => handleImageUrl("")}
                    style={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, borderRadius: "50%", border: "none", background: "oklch(0.65 0.15 25)", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>
                    <X size={10} />
                  </button>
                </div>
              ) : (
                <div style={{ width: 80, height: 56, borderRadius: 8, border: "1px dashed var(--islametra-line)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <ImageIcon size={18} style={{ color: "var(--islametra-fg-dim)" }} />
                </div>
              )}
            </div>
            <p style={{ fontSize: 11, color: "var(--islametra-fg-dim)", fontFamily: "'Geist', sans-serif", marginTop: 5 }}>
              Paste URL gambar dari Cloudinary, Unsplash, atau CDN lainnya.
            </p>
          </div>

          {/* Excerpt */}
          <div>
            <label style={labelStyle}>Ringkasan / Excerpt</label>
            <textarea value={form.excerpt} onChange={e => handleChange("excerpt", e.target.value)}
              style={{ ...inputStyle, minHeight: 72, resize: "vertical" }} placeholder="Ringkasan singkat artikel..." />
          </div>

          {/* Rich Text Content */}
          <div>
            <label style={labelStyle}>Konten *</label>
            <RichTextEditor value={form.content} onChange={(html) => handleChange("content", html)} placeholder="Tulis konten artikel di sini..." />
          </div>

          {/* SEO */}
          <div style={{ padding: "16px 18px", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid var(--islametra-line)" }}>
            <p style={{ fontSize: 11, fontFamily: "'Geist Mono', monospace", color: "var(--islametra-fg-dim)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12 }}>SEO (opsional)</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div>
                <label style={labelStyle}>SEO Title</label>
                <input value={form.seoTitle} onChange={e => handleChange("seoTitle", e.target.value)} style={inputStyle} placeholder="Judul untuk mesin pencari..." />
              </div>
              <div>
                <label style={labelStyle}>SEO Description</label>
                <input value={form.seoDesc} onChange={e => handleChange("seoDesc", e.target.value)} style={inputStyle} placeholder="Deskripsi untuk mesin pencari (max 160 karakter)..." />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
            padding: "11px 24px", borderRadius: 10, border: "none",
            background: loading ? "rgba(255,255,255,0.08)" : "linear-gradient(180deg, oklch(0.7 0.13 155) 0%, oklch(0.55 0.12 155) 100%)",
            color: loading ? "var(--islametra-fg-dim)" : "#08110b",
            fontSize: 14, fontWeight: 600, fontFamily: "'Geist', sans-serif",
            cursor: loading ? "not-allowed" : "pointer",
          }}>
            <Save size={15} />
            {loading ? "Menyimpan..." : isEdit ? "Perbarui Artikel" : "Simpan Artikel"}
          </button>
        </div>
      </form>
    </div>
  );
}

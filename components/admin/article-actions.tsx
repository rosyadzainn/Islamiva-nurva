"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

export function ArticleActions({ id }: { id: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Hapus artikel ini? Tindakan ini tidak bisa dibatalkan.")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Artikel dihapus.");
        router.refresh();
      } else {
        const d = await res.json();
        toast.error(d.error ?? "Gagal menghapus.");
      }
    } catch {
      toast.error("Terjadi kesalahan.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <Link
        href={`/admin/articles/${id}`}
        aria-label="Edit artikel"
        style={{
          width: 30, height: 30, borderRadius: 7, border: "1px solid var(--islametra-line)",
          background: "rgba(255,255,255,0.03)", color: "var(--islametra-fg-dim)",
          display: "flex", alignItems: "center", justifyContent: "center",
          textDecoration: "none", flexShrink: 0,
        }}
      >
        <Pencil size={12} />
      </Link>
      <button
        onClick={handleDelete}
        disabled={deleting}
        aria-label="Hapus artikel"
        style={{
          width: 30, height: 30, borderRadius: 7, border: "1px solid rgba(255,80,80,0.15)",
          background: "rgba(255,80,80,0.06)", color: "rgba(255,100,100,0.7)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: deleting ? "not-allowed" : "pointer", flexShrink: 0,
          opacity: deleting ? 0.5 : 1,
        }}
      >
        <Trash2 size={12} />
      </button>
    </div>
  );
}

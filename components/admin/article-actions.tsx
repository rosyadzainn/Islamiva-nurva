"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Trash2, X } from "lucide-react";
import { toast } from "react-hot-toast";

export function ArticleActions({ id }: { id: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Artikel dihapus.");
        router.refresh();
      } else {
        const d = await res.json();
        toast.error(d.error ?? "Gagal menghapus.");
        setConfirmDelete(false);
      }
    } catch {
      toast.error("Terjadi kesalahan.");
      setConfirmDelete(false);
    } finally {
      setDeleting(false);
    }
  };

  if (confirmDelete) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <button
          onClick={handleDelete}
          disabled={deleting}
          aria-label="Konfirmasi hapus artikel"
          style={{
            padding: "4px 10px", borderRadius: 7, border: "1px solid rgba(255,80,80,0.4)",
            background: "rgba(255,80,80,0.15)", color: "rgba(255,100,100,0.9)",
            fontSize: 11, fontFamily: "'Geist', sans-serif", fontWeight: 600,
            cursor: deleting ? "not-allowed" : "pointer", flexShrink: 0,
            opacity: deleting ? 0.5 : 1, height: 30,
          }}
        >
          {deleting ? "..." : "Yakin?"}
        </button>
        <button
          onClick={() => setConfirmDelete(false)}
          disabled={deleting}
          aria-label="Batal hapus"
          style={{
            width: 30, height: 30, borderRadius: 7, border: "1px solid var(--islametra-line)",
            background: "rgba(255,255,255,0.03)", color: "var(--islametra-fg-dim)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", flexShrink: 0,
          }}
        >
          <X size={12} />
        </button>
      </div>
    );
  }

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
        onClick={() => setConfirmDelete(true)}
        aria-label="Hapus artikel"
        style={{
          width: 30, height: 30, borderRadius: 7, border: "1px solid rgba(255,80,80,0.15)",
          background: "rgba(255,80,80,0.06)", color: "rgba(255,100,100,0.7)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", flexShrink: 0,
        }}
      >
        <Trash2 size={12} />
      </button>
    </div>
  );
}

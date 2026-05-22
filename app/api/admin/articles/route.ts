import { requireAdminApi } from "@/lib/admin-guard";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const result = await requireAdminApi();
  if (result instanceof NextResponse) return result;

  try {
    const body = await req.json();
    const { title, slug, excerpt, content, imageUrl, category, published, seoTitle, seoDesc } = body;

    if (!title || !content || !slug) {
      return NextResponse.json({ error: "Judul, slug, dan konten wajib diisi." }, { status: 400 });
    }

    if (typeof title === "string" && title.length > 300) {
      return NextResponse.json({ error: "Judul terlalu panjang (maks 300 karakter)." }, { status: 400 });
    }
    if (typeof content === "string" && content.length > 500_000) {
      return NextResponse.json({ error: "Konten terlalu besar (maks 500KB)." }, { status: 400 });
    }
    if (typeof slug === "string" && !/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json({ error: "Slug hanya boleh huruf kecil, angka, dan tanda (-)" }, { status: 400 });
    }

    const { default: prisma } = await import("@/lib/prisma");
    const article = await prisma.article.create({
      data: {
        title, slug, excerpt: excerpt || null, content,
        imageUrl: imageUrl || null,
        category, published: !!published,
        seoTitle: seoTitle || null, seoDesc: seoDesc || null,
      },
    });

    return NextResponse.json({ article });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("Unique constraint")) return NextResponse.json({ error: "Slug sudah digunakan." }, { status: 409 });
    return NextResponse.json({ error: "Gagal menyimpan artikel." }, { status: 500 });
  }
}

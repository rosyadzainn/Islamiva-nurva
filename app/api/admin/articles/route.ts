import { requireAdminApi } from "@/lib/admin-guard";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const result = await requireAdminApi();
  if (result instanceof NextResponse) return result;

  try {
    const body = await req.json();
    const { title, slug, excerpt, content, category, published, seoTitle, seoDesc } = body;

    if (!title || !content || !slug) {
      return NextResponse.json({ error: "Judul, slug, dan konten wajib diisi." }, { status: 400 });
    }

    const { default: prisma } = await import("@/lib/prisma");
    const article = await prisma.article.create({
      data: { title, slug, excerpt: excerpt || null, content, category, published: !!published, seoTitle: seoTitle || null, seoDesc: seoDesc || null },
    });

    return NextResponse.json({ article });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    if (msg.includes("Unique constraint")) return NextResponse.json({ error: "Slug sudah digunakan." }, { status: 409 });
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

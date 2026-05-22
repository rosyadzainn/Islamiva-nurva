import { requireAdminApi } from "@/lib/admin-guard";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const result = await requireAdminApi();
  if (result instanceof NextResponse) return result;

  const { id } = await params;
  try {
    const { default: prisma } = await import("@/lib/prisma");
    const article = await prisma.article.findUnique({ where: { id } });
    if (!article) return NextResponse.json({ error: "Artikel tidak ditemukan" }, { status: 404 });
    return NextResponse.json({ article });
  } catch {
    return NextResponse.json({ error: "Gagal mengambil artikel" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const result = await requireAdminApi();
  if (result instanceof NextResponse) return result;

  const { id } = await params;
  try {
    const body = await req.json();
    const { title, slug, excerpt, content, imageUrl, category, published, seoTitle, seoDesc, tags } = body;

    if (title && typeof title === "string" && title.length > 300) {
      return NextResponse.json({ error: "Judul terlalu panjang." }, { status: 400 });
    }
    if (content && typeof content === "string" && content.length > 500_000) {
      return NextResponse.json({ error: "Konten terlalu besar." }, { status: 400 });
    }
    if (slug && typeof slug === "string" && !/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json({ error: "Slug hanya boleh huruf kecil, angka, dan tanda (-)" }, { status: 400 });
    }

    const { default: prisma } = await import("@/lib/prisma");

    const existing = await prisma.article.findUnique({ where: { id }, select: { id: true } });
    if (!existing) return NextResponse.json({ error: "Artikel tidak ditemukan" }, { status: 404 });

    const article = await prisma.article.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(slug !== undefined && { slug }),
        ...(excerpt !== undefined && { excerpt: excerpt || null }),
        ...(content !== undefined && { content }),
        ...(imageUrl !== undefined && { imageUrl: imageUrl || null }),
        ...(category !== undefined && { category }),
        ...(published !== undefined && { published: !!published }),
        ...(seoTitle !== undefined && { seoTitle: seoTitle || null }),
        ...(seoDesc !== undefined && { seoDesc: seoDesc || null }),
        ...(tags !== undefined && { tags }),
      },
    });

    return NextResponse.json({ article });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("Unique constraint")) {
      return NextResponse.json({ error: "Slug sudah digunakan." }, { status: 409 });
    }
    return NextResponse.json({ error: "Gagal memperbarui artikel." }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const result = await requireAdminApi();
  if (result instanceof NextResponse) return result;

  const { id } = await params;
  try {
    const { default: prisma } = await import("@/lib/prisma");
    const existing = await prisma.article.findUnique({ where: { id }, select: { id: true } });
    if (!existing) return NextResponse.json({ error: "Artikel tidak ditemukan" }, { status: 404 });

    await prisma.article.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Gagal menghapus artikel" }, { status: 500 });
  }
}

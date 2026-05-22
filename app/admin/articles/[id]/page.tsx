import { requireAdmin } from "@/lib/admin-guard";
import { notFound } from "next/navigation";
import { ArticleForm } from "@/components/admin/article-form";

export const dynamic = "force-dynamic";

async function getArticle(id: string) {
  try {
    const { default: prisma } = await import("@/lib/prisma");
    return await prisma.article.findUnique({ where: { id } });
  } catch {
    return null;
  }
}

export default async function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const article = await getArticle(id);
  if (!article) notFound();

  return (
    <ArticleForm
      initial={{
        id: article.id,
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt ?? "",
        content: article.content,
        imageUrl: article.imageUrl ?? "",
        category: article.category,
        published: article.published,
        seoTitle: article.seoTitle ?? "",
        seoDesc: article.seoDesc ?? "",
      }}
    />
  );
}

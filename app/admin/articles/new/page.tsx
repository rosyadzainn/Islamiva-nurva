import { requireAdmin } from "@/lib/admin-guard";
import { ArticleForm } from "@/components/admin/article-form";

export default async function NewArticlePage() {
  await requireAdmin();
  return <ArticleForm />;
}

import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-guard";

const DEFAULT_SETTINGS = {
  site_notice: "",
  maintenance_mode: "false",
  featured_article_slug: "",
};

export async function GET() {
  const result = await requireAdminApi();
  if (result instanceof NextResponse) return result;

  const { default: prisma } = await import("@/lib/prisma");
  const rows = await prisma.siteSetting.findMany();

  const settings: Record<string, string> = { ...DEFAULT_SETTINGS };
  for (const row of rows) {
    settings[row.key] = row.value;
  }

  return NextResponse.json({ settings });
}

export async function PATCH(req: NextRequest) {
  const result = await requireAdminApi();
  if (result instanceof NextResponse) return result;

  const body = await req.json() as Record<string, string>;
  const { default: prisma } = await import("@/lib/prisma");

  await Promise.all(
    Object.entries(body).map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        create: { key, value },
        update: { value },
      })
    )
  );

  return NextResponse.json({ ok: true });
}

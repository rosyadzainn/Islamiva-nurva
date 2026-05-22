import { NextRequest, NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-guard";

const DEFAULT_SETTINGS = {
  site_notice: "",
  maintenance_mode: "false",
  featured_article_slug: "",
};

const ALLOWED_KEYS = new Set(Object.keys(DEFAULT_SETTINGS));
const MAX_VALUE_LENGTH = 2000;

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

  const validEntries = Object.entries(body).filter(
    ([key, value]) =>
      ALLOWED_KEYS.has(key) &&
      typeof value === "string" &&
      value.length <= MAX_VALUE_LENGTH
  );

  if (validEntries.length === 0) {
    return NextResponse.json({ error: "No valid settings provided" }, { status: 400 });
  }

  await Promise.all(
    validEntries.map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        create: { key, value },
        update: { value },
      })
    )
  );

  return NextResponse.json({ ok: true });
}

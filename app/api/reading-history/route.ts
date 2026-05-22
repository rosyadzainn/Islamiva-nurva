import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { z } from "zod";

const ALLOWED_HISTORY_TYPES = ["quran", "hadith", "doa", "article"] as const;

const HistorySchema = z.object({
  type: z.enum(ALLOWED_HISTORY_TYPES),
  referenceId: z.string().min(1).max(128),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

async function getDbUser(clerkId: string) {
  const { default: prisma } = await import("@/lib/prisma");
  return prisma.user.findUnique({ where: { clerkId }, select: { id: true } });
}

export async function GET() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { default: prisma } = await import("@/lib/prisma");
  const user = await getDbUser(clerkId);
  if (!user) return NextResponse.json({ history: [] });

  const history = await prisma.readingHistory.findMany({
    where: { userId: user.id },
    orderBy: { lastReadAt: "desc" },
    take: 50,
  });

  return NextResponse.json({ history });
}

export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ ok: false });

  const parsed = HistorySchema.safeParse(await req.json());
  if (!parsed.success) return NextResponse.json({ ok: false });
  const { type, referenceId, metadata } = parsed.data;

  try {
    const { default: prisma } = await import("@/lib/prisma");
    const user = await getDbUser(clerkId);
    if (!user) return NextResponse.json({ ok: false });

    await prisma.readingHistory.upsert({
      where: { userId_type_referenceId: { userId: user.id, type, referenceId } },
      create: { userId: user.id, type, referenceId, metadata: metadata as Prisma.InputJsonValue, lastReadAt: new Date() },
      update: { metadata: metadata as Prisma.InputJsonValue, lastReadAt: new Date() },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}

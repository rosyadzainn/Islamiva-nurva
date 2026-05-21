import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";

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

  const body = await req.json();
  const { type, referenceId, metadata } = body as {
    type: string;
    referenceId: string;
    metadata?: Record<string, unknown>;
  };

  if (!type || !referenceId) return NextResponse.json({ ok: false });

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

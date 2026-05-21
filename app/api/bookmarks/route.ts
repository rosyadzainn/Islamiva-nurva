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
  if (!user) return NextResponse.json({ bookmarks: [] });

  const rows = await prisma.bookmark.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ bookmarks: rows });
}

export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { type, referenceId, metadata } = body as {
    type: string;
    referenceId: string;
    metadata: Record<string, unknown>;
  };

  if (!type || !referenceId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { default: prisma } = await import("@/lib/prisma");
  const user = await getDbUser(clerkId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const bookmark = await prisma.bookmark.upsert({
    where: { userId_type_referenceId: { userId: user.id, type: type as never, referenceId } },
    create: { userId: user.id, type: type as never, referenceId, metadata: metadata as Prisma.InputJsonValue },
    update: { metadata: metadata as Prisma.InputJsonValue },
  });

  return NextResponse.json({ bookmark });
}

export async function DELETE(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { type, referenceId } = body as { type: string; referenceId: string };

  if (!type || !referenceId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { default: prisma } = await import("@/lib/prisma");
  const user = await getDbUser(clerkId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  await prisma.bookmark.deleteMany({
    where: { userId: user.id, type: type as never, referenceId },
  });

  return NextResponse.json({ ok: true });
}

import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { z } from "zod";

const ALLOWED_TYPES = ["QURAN", "DOA", "HADITH", "STORY", "HISTORY"] as const;

const BookmarkSchema = z.object({
  type: z.enum(ALLOWED_TYPES),
  referenceId: z.string().min(1).max(128).regex(/^[\w\-.:/]+$/),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

const DeleteSchema = z.object({
  type: z.enum(ALLOWED_TYPES),
  referenceId: z.string().min(1).max(128),
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

  const parsed = BookmarkSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
  }
  const { type, referenceId, metadata } = parsed.data;

  const { default: prisma } = await import("@/lib/prisma");
  const user = await getDbUser(clerkId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const bookmark = await prisma.bookmark.upsert({
    where: { userId_type_referenceId: { userId: user.id, type, referenceId } },
    create: { userId: user.id, type, referenceId, metadata: (metadata ?? null) as Prisma.InputJsonValue },
    update: { metadata: (metadata ?? null) as Prisma.InputJsonValue },
  });

  return NextResponse.json({ bookmark });
}

export async function DELETE(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = DeleteSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }
  const { type, referenceId } = parsed.data;

  const { default: prisma } = await import("@/lib/prisma");
  const user = await getDbUser(clerkId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  await prisma.bookmark.deleteMany({
    where: { userId: user.id, type, referenceId },
  });

  return NextResponse.json({ ok: true });
}

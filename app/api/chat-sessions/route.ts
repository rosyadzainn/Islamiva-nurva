import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

async function getDbUser(clerkId: string) {
  const { default: prisma } = await import("@/lib/prisma");
  return prisma.user.findUnique({ where: { clerkId }, select: { id: true } });
}

export async function GET() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { default: prisma } = await import("@/lib/prisma");
  const user = await getDbUser(clerkId);
  if (!user) return NextResponse.json({ sessions: [] });

  const sessions = await prisma.chatSession.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    take: 50,
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  return NextResponse.json({ sessions });
}

export async function POST(req: NextRequest) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title } = body as { title?: string };

  const { default: prisma } = await import("@/lib/prisma");
  const user = await getDbUser(clerkId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const session = await prisma.chatSession.create({
    data: { userId: user.id, title: title ?? "Sesi Baru" },
    include: { messages: true },
  });

  return NextResponse.json({ session });
}

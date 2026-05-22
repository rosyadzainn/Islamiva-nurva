import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

async function getDbUser(clerkId: string) {
  const { default: prisma } = await import("@/lib/prisma");
  return prisma.user.findUnique({ where: { clerkId }, select: { id: true } });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { title, messages } = body as {
    title?: string;
    messages?: { role: string; content: string }[];
  };

  const { default: prisma } = await import("@/lib/prisma");
  const user = await getDbUser(clerkId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const session = await prisma.chatSession.findFirst({
    where: { id, userId: user.id },
  });
  if (!session) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (title !== undefined) {
    await prisma.chatSession.update({ where: { id }, data: { title } });
  }

  if (messages && messages.length > 0) {
    const validMessages = messages
      .slice(0, 50) // max 50 messages per batch
      .filter(
        (m) =>
          (m.role === "user" || m.role === "assistant") &&
          typeof m.content === "string" &&
          m.content.length > 0 &&
          m.content.length <= 10000
      );

    if (validMessages.length > 0) {
      await prisma.chatMessage.createMany({
        data: validMessages.map((m) => ({
          sessionId: id,
          role: m.role,
          content: m.content,
        })),
        skipDuplicates: true,
      });
    }
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { userId: clerkId } = await auth();
  if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { default: prisma } = await import("@/lib/prisma");
  const user = await getDbUser(clerkId);
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  await prisma.chatSession.deleteMany({ where: { id, userId: user.id } });
  return NextResponse.json({ ok: true });
}

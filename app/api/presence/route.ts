import { NextRequest } from "next/server";

const TIMEOUT_MS = 2 * 60 * 1000;

export async function POST(req: NextRequest) {
  try {
    const { sessionId, path } = await req.json();
    if (!sessionId || typeof sessionId !== "string" || sessionId.length > 128) {
      return Response.json({ count: 0 });
    }

    const safePath =
      path && typeof path === "string" && path.length <= 512 && /^\/[^\s]*$/.test(path)
        ? path
        : "/";

    const cutoff = new Date(Date.now() - TIMEOUT_MS);
    const { default: prisma } = await import("@/lib/prisma");

    await Promise.all([
      prisma.presence.upsert({
        where: { sessionId },
        create: { sessionId, path: safePath },
        update: { path: safePath, updatedAt: new Date() },
      }),
      prisma.presence.deleteMany({
        where: { updatedAt: { lt: cutoff } },
      }),
    ]);

    const count = await prisma.presence.count({
      where: { updatedAt: { gte: cutoff } },
    });

    return Response.json({ count });
  } catch {
    return Response.json({ count: 0 });
  }
}

export async function GET() {
  try {
    const cutoff = new Date(Date.now() - TIMEOUT_MS);
    const { default: prisma } = await import("@/lib/prisma");
    const count = await prisma.presence.count({
      where: { updatedAt: { gte: cutoff } },
    });
    return Response.json({ count });
  } catch {
    return Response.json({ count: 0 });
  }
}

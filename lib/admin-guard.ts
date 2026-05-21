import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function requireAdmin(): Promise<string> {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { default: prisma } = await import("@/lib/prisma");
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { role: true },
  });

  if (!user || user.role !== "ADMIN") redirect("/");
  return userId;
}

export async function requireAdminApi(): Promise<string | NextResponse> {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { default: prisma } = await import("@/lib/prisma");
  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
    select: { role: true },
  });

  if (!user || user.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return userId;
}

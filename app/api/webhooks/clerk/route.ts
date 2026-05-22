import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { headers } from "next/headers";

type ClerkUserEvent = {
  type: string;
  data: {
    id: string;
    email_addresses: { email_address: string; id: string }[];
    first_name?: string;
    last_name?: string;
    image_url?: string;
    primary_email_address_id?: string;
  };
};

export async function POST(req: NextRequest) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook secret missing" }, { status: 500 });
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const payload = await req.text();
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: ClerkUserEvent;
  try {
    const verifyWithTimeout = Promise.race<ClerkUserEvent>([
      Promise.resolve(wh.verify(payload, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
      }) as ClerkUserEvent),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("timeout")), 5000)),
    ]);
    evt = await verifyWithTimeout;
  } catch {
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  const { type, data } = evt;

  if (type === "user.created" || type === "user.updated") {
    const primaryEmail = data.email_addresses.find(
      (e) => e.id === data.primary_email_address_id
    )?.email_address ?? data.email_addresses[0]?.email_address;

    if (!primaryEmail) {
      return NextResponse.json({ received: true, skipped: "no email" });
    }

    const name = [data.first_name, data.last_name].filter(Boolean).join(" ") || null;

    const { default: prisma } = await import("@/lib/prisma");

    await prisma.user.upsert({
      where: { clerkId: data.id },
      update: { email: primaryEmail, name, imageUrl: data.image_url ?? null },
      create: {
        clerkId: data.id,
        email: primaryEmail,
        name,
        imageUrl: data.image_url ?? null,
      },
    });
  }

  if (type === "user.deleted") {
    const { default: prisma } = await import("@/lib/prisma");
    await prisma.user.deleteMany({ where: { clerkId: data.id } }).catch(() => {});
  }

  return NextResponse.json({ received: true });
}

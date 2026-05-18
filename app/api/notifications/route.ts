// src/app/api/notifications/route.ts
import { NextResponse } from "next/server";

import { getServerAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerAuth();
    if (!session?.user) {return new NextResponse("Unauthorized", { status: 401 });}

    const notifications = await prisma.notification.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 30,
    });

    return NextResponse.json(notifications);
  } catch (error) {
    logger.error("Notifications error:", error);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerAuth();
    if (!session?.user) {return new NextResponse("Unauthorized", { status: 401 });}

    const { markAllRead } = await req.json().catch(() => ({}));

    if (markAllRead) {
      await prisma.notification.updateMany({
        where: { userId: session.user.id, isRead: false },
        data: { isRead: true },
      });
      return NextResponse.json({ success: true });
    }

    return new NextResponse("Bad request", { status: 400 });
  } catch {
    return new NextResponse("Internal server error", { status: 500 });
  }
}

import { logger } from "@/lib/logger";
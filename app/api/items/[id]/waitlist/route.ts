import { NextResponse } from "next/server";

import { getServerAuth } from "@/lib/auth-utils";
import { withProtection, RATE_LIMITS } from "@/lib/security/protection";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/db";
async function _POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerAuth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id: itemId } = await params;

    // Check if item exists and is borrowed
    const item = await prisma.item.findUnique({
      where: { id: itemId },
      include: { loans: { where: { status: "APPROVED" } } },
    });

    if (!item) {
      return new NextResponse("Item not found", { status: 404 });
    }

    if (item.status !== "BORROWED") {
      return new NextResponse("Item is not borrowed", { status: 400 });
    }

    // Check if user is already in waitlist
    const existingEntry = await prisma.waitlistEntry.findUnique({
      where: {
        itemId_userId: {
          itemId,
          userId: session.user.id,
        },
      },
    });

    if (existingEntry) {
      return new NextResponse("Already in waitlist", { status: 400 });
    }

    // Add to waitlist
    const waitlistEntry = await prisma.waitlistEntry.create({
      data: {
        itemId,
        userId: session.user.id,
      },
    });

    return NextResponse.json(waitlistEntry);
  } catch (error) {
    logger.error("[WAITLIST_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

async function _DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerAuth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id: itemId } = await params;

    await prisma.waitlistEntry.delete({
      where: {
        itemId_userId: {
          itemId,
          userId: session.user.id,
        },
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    logger.error("[WAITLIST_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: itemId } = await params;

    const waitlist = await prisma.waitlistEntry.findMany({
      where: { itemId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(waitlist);
  } catch (error) {
    logger.error("[WAITLIST_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export const POST = withProtection(_POST, { scope: "write", limit: 60, windowSeconds: 60 });

export const DELETE = withProtection(_DELETE, { scope: "write", limit: 60, windowSeconds: 60 });

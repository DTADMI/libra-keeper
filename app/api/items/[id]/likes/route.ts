// src/app/api/items/[id]/likes/route.ts
import { NextResponse } from "next/server";

import { getServerAuth } from "@/lib/auth-utils";
import { withProtection, RATE_LIMITS } from "@/lib/security/protection";
import { prisma } from "@/lib/db";
async function _POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerAuth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { id } = await params;

    const existingLike = await prisma.like.findUnique({
      where: {
        itemId_userId: {
          itemId: id,
          userId: session.user.id,
        },
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
      return NextResponse.json({ liked: false });
    }

    await prisma.like.create({
      data: {
        itemId: id,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ liked: true });
  } catch (error) {
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerAuth();
    const { id } = await params;

    const [likesCount, userLike] = await Promise.all([
      prisma.like.count({
        where: { itemId: id },
      }),
      session?.user
        ? prisma.like.findUnique({
            where: {
              itemId_userId: {
                itemId: id,
                userId: session.user.id,
              },
            },
          })
        : null,
    ]);

    return NextResponse.json({
      count: likesCount,
      isLiked: !!userLike,
    });
  } catch (error) {
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export const POST = withProtection(_POST, { scope: "write", limit: 60, windowSeconds: 60 });

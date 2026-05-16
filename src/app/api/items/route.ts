// src/app/api/items/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";

import { getServerAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { withProtection, RATE_LIMITS } from "@/lib/security/protection";
const itemSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  type: z.enum(["BOOK", "MUSIC", "MOVIE", "GAME", "TOY", "CLOTHES", "OTHER"]),
  status: z
    .enum(["AVAILABLE", "BORROWED", "RESERVED", "UNAVAILABLE", "GIVEN_AWAY", "LOST"])
    .optional(),
  coverImage: z.string().url().optional().nullable().or(z.literal("")),
  isbn: z.string().optional().nullable(),
  author: z.string().optional().nullable(),
  publisher: z.string().optional().nullable(),
  publishedAt: z.string().datetime().optional().nullable(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.string(), z.any()).optional().nullable(),
  collectionId: z.string().optional().nullable(),
});

async function _POST(req: Request) {
  try {
    const session = await getServerAuth();
    if (!session.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const body = itemSchema.parse(json);

    const { tags, metadata, collectionId, ...itemData } = body;

    logger.info(`Creating new item: ${body.title}`);

    const item = await prisma.item.create({
      data: {
        ...itemData,
        metadata: metadata || {},
        collectionId: collectionId || null,
        tags: {
          connectOrCreate:
            tags?.map((tag) => ({
              where: { name: tag },
              create: { name: tag },
            })) || [],
        },
      },
      include: {
        tags: true,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    logger.error("Error creating item", error);
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 });
    }
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function GET() {
  try {
    const items = await prisma.item.findMany({
      include: {
        tags: true,
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(items);
  } catch (error) {
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export const POST = withProtection(_POST, { scope: "write", limit: 60, windowSeconds: 60 });

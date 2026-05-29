// src/app/api/items/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";

import { getServerAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { withProtection } from "@/lib/security/protection";
const itemSchema = z.object({
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  type: z.enum(["BOOK", "MUSIC", "MOVIE", "GAME", "TOY", "CLOTHES", "OTHER"]),
  status: z
    .enum(["AVAILABLE", "BORROWED", "RESERVED", "UNAVAILABLE", "GIVEN_AWAY", "LOST"])
    .optional(),
  coverImage: z.string().url().nullable().optional().or(z.literal("")),
  isbn: z.string().nullable().optional(),
  author: z.string().nullable().optional(),
  publisher: z.string().nullable().optional(),
  publishedAt: z.string().datetime().nullable().optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.string(), z.any()).nullable().optional(),
  collectionId: z.string().nullable().optional(),
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

async function _GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const take = Math.min(parseInt(searchParams.get("take") ?? "50", 10), 100);
    const skip = Math.max(parseInt(searchParams.get("skip") ?? "0", 10), 0);

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
      take,
      skip,
    });

    return NextResponse.json(items);
  } catch (error) {
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export const GET = withProtection(_GET, { scope: "api", limit: 100, windowSeconds: 60 });
export const POST = withProtection(_POST, { scope: "write", limit: 60, windowSeconds: 60 });

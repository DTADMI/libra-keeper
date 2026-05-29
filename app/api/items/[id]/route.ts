import { NextResponse } from "next/server";
import { z } from "zod";

import { getServerAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { withProtection } from "@/lib/security/protection";
const itemSchema = z.object({
  title: z.string().min(1),
  description: z.string().nullable().optional(),
  type: z.enum(["BOOK", "MUSIC", "MOVIE", "GAME", "TOY", "CLOTHES", "OTHER"]),
  status: z.enum(["AVAILABLE", "BORROWED", "RESERVED", "UNAVAILABLE", "GIVEN_AWAY", "LOST"]).optional(),
  coverImage: z.string().url().nullable().optional(),
  isbn: z.string().nullable().optional(),
  author: z.string().nullable().optional(),
  publisher: z.string().nullable().optional(),
  publishedAt: z.string().datetime().nullable().optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.string(), z.any()).nullable().optional(),
});

async function _GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerAuth();

    const item = await prisma.item.findUnique({
      where: { id },
      include: {
        tags: true,
        loans: {
          include: {
            user: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        comments: {
          include: {
            user: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: { likes: true },
        },
      },
    });

    if (!item) {
      return new NextResponse("Not Found", { status: 404 });
    }

    return NextResponse.json(item);
  } catch (error) {
    return new NextResponse("Internal server error", { status: 500 });
  }
}

async function _PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerAuth();
    if (!session.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const body = itemSchema.parse(json);

    const { tags, metadata, ...itemData } = body;

    const item = await prisma.item.update({
      where: { id },
      data: {
        ...itemData,
        metadata: metadata || {},
        tags: {
          set: [],
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
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 });
    }
    return new NextResponse("Internal server error", { status: 500 });
  }
}

async function _DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerAuth();
    if (!session.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await prisma.item.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export const GET = withProtection(_GET, { scope: "api", limit: 100, windowSeconds: 60 });
export const PATCH = withProtection(_PATCH, { scope: "write", limit: 60, windowSeconds: 60 });

export const DELETE = withProtection(_DELETE, { scope: "write", limit: 60, windowSeconds: 60 });

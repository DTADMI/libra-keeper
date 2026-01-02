import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

const itemSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  type: z.enum(["BOOK", "MUSIC", "MOVIE", "GAME", "TOY", "OTHER"]),
  status: z.enum(["AVAILABLE", "BORROWED", "GIVEN_AWAY", "LOST"]).optional(),
  coverImage: z.string().url().optional().nullable(),
  isbn: z.string().optional().nullable(),
  author: z.string().optional().nullable(),
  publisher: z.string().optional().nullable(),
  publishedAt: z.string().datetime().optional().nullable(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.string(), z.any()).optional().nullable(),
});

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const item = await prisma.item.findUnique({
      where: { id },
      include: {
        tags: true,
        loans: {
          include: { user: true },
          orderBy: { createdAt: "desc" },
        },
        comments: {
          include: { user: true },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: { likes: true },
        },
      },
    });

    if (!item) {
      return new NextResponse("Not Found", { status: 404 })
    }

    return NextResponse.json(item)
  } catch (error) {
    return new NextResponse("Internal server error", { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const body = itemSchema.parse(json)

    const { tags, metadata, ...itemData } = body

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

    return NextResponse.json(item)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 })
    }
    return new NextResponse("Internal server error", { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    await prisma.item.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return new NextResponse("Internal server error", { status: 500 })
  }
}

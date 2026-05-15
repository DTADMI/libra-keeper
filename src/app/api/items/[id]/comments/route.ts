// src/app/api/items/[id]/comments/route.ts
import { NextResponse } from "next/server"
import { z } from "zod"

import { getServerAuth } from "@/lib/auth-utils"
import { prisma } from "@/lib/db"

const commentSchema = z.object({
  content: z.string().min(1),
});

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerAuth()
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const { content } = commentSchema.parse(json)
    const { id } = await params

    const comment = await prisma.comment.create({
      data: {
        content,
        itemId: id,
        userId: session.user.id,
      },
      include: {
        user: { select: { name: true, image: true } },
        item: { select: { title: true } },
      },
    })

    if (comment.item.title) {
      await prisma.notification.create({
        data: {
          userId: session.user.id,
          type: "COMMENT_POSTED",
          title: "Comment posted",
          body: `You commented on "${comment.item.title}"`,
          link: `/items/${id}`,
        },
      })
    }

    return NextResponse.json(comment)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 })
    }
    return new NextResponse("Internal server error", { status: 500 })
  }
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const comments = await prisma.comment.findMany({
      where: { itemId: id },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(comments)
  } catch (error) {
    return new NextResponse("Internal server error", { status: 500 })
  }
}

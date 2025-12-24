// src/app/api/items/[id]/comments/route.ts
import {NextResponse} from "next/server"
import {getServerSession} from "next-auth"
import {z} from "zod"

import {authOptions} from "@/lib/auth"
import {prisma} from "@/lib/db"

const commentSchema = z.object({
  content: z.string().min(1),
})

export async function POST(
  req: Request,
  {params}: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const { content } = commentSchema.parse(json)
      const {id} = await params

    const comment = await prisma.comment.create({
      data: {
        content,
        itemId: id,
        userId: session.user.id,
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    })

    return NextResponse.json(comment)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 })
    }
    return new NextResponse("Internal server error", { status: 500 })
  }
}

export async function GET(
  req: Request,
  {params}: { params: Promise<{ id: string }> }
) {
  try {
      const {id} = await params

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
    })

    return NextResponse.json(comments)
  } catch (error) {
    return new NextResponse("Internal server error", { status: 500 })
  }
}

// src/app/api/items/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { logger } from "@/lib/logger"

const itemSchema = z.object({
    title: z.string().min(1),
    description: z.string().optional().nullable(),
    type: z.enum(["BOOK", "MUSIC", "MOVIE", "GAME", "TOY", "OTHER"]),
    status: z.enum(["AVAILABLE", "BORROWED", "RESERVED", "UNAVAILABLE", "GIVEN_AWAY", "LOST"]).optional(),
    coverImage: z.string().url().optional().nullable().or(z.literal("")),
    isbn: z.string().optional().nullable(),
    author: z.string().optional().nullable(),
    publisher: z.string().optional().nullable(),
    publishedAt: z.string().datetime().optional().nullable(),
    tags: z.array(z.string()).optional(),
    metadata: z.record(z.any()).optional().nullable(),
})

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const json = await req.json()
        const body = itemSchema.parse(json)

        const { tags, ...itemData } = body

        logger.info(`Creating new item: ${body.title}`)

        const item = await prisma.item.create({
            data: {
                ...itemData,
                tags: {
                    connectOrCreate: tags?.map(tag => ({
                        where: { name: tag },
                        create: { name: tag },
                    })) || [],
                },
            },
            include: {
                tags: true,
            },
        })

        return NextResponse.json(item)
    } catch (error) {
        logger.error("Error creating item", error)
        if (error instanceof z.ZodError) {
            return new NextResponse(JSON.stringify(error.issues), { status: 422 })
        }
        return new NextResponse("Internal server error", { status: 500 })
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
        })

        return NextResponse.json(items)
    } catch (error) {
        return new NextResponse("Internal server error", { status: 500 })
    }
}
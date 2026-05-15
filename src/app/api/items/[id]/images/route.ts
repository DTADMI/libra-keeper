// src/app/api/items/[id]/images/route.ts
import { NextResponse } from "next/server"

import { getServerAuth } from "@/lib/auth-utils"
import { prisma } from "@/lib/db"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const images = await prisma.itemImage.findMany({
      where: { itemId: id },
      orderBy: { position: "asc" },
    })
    return NextResponse.json(images)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerAuth()
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { id: itemId } = await params
    const { url, caption } = await req.json()

    if (!url) return NextResponse.json({ error: "URL required" }, { status: 400 })

    const count = await prisma.itemImage.count({ where: { itemId } })

    const image = await prisma.itemImage.create({
      data: {
        itemId,
        url,
        caption: caption ?? null,
        position: count,
        isPrimary: count === 0,
      },
    })

    return NextResponse.json(image, { status: 201 })
  } catch {
    return new NextResponse("Internal server error", { status: 500 })
  }
}

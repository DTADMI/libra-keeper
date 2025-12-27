// src/app/api/items/[id]/report/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Create a special ItemRequest for a missing item
    const item = await prisma.item.findUnique({
      where: { id },
    });

    if (!item) {
      return new NextResponse("Item not found", { status: 404 })
    }

    const request = await prisma.itemRequest.create({
      data: {
        title: `MISSING: ${item.title}`,
        description: `User ${session.user.name || session.user.email} reported this item as missing.`,
        type: "BORROWED_ITEM", // Reusing this type or we could add 'REPORT'
        status: "PENDING",
        requestedById: session.user.id,
      },
    });

    // Optionally update item status to LOST?
    // Let's wait for admin approval.

    return NextResponse.json(request, { status: 201 })
  } catch (error) {
    return new NextResponse("Internal server error", { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const itemId = params.id

    // Check if item exists and is borrowed
    const item = await prisma.item.findUnique({
      where: { id: itemId },
      include: { loans: { where: { status: "APPROVED" } } },
    });

    if (!item) {
      return new NextResponse("Item not found", { status: 404 })
    }

    if (item.status !== "BORROWED") {
      return new NextResponse("Item is not borrowed", { status: 400 })
    }

    // Check if user is already in waitlist
    const existingEntry = await prisma.waitlistEntry.findUnique({
      where: {
        itemId_userId: {
          itemId,
          userId: session.user.id,
        },
      },
    });

    if (existingEntry) {
      return new NextResponse("Already in waitlist", { status: 400 })
    }

    // Add to waitlist
    const waitlistEntry = await prisma.waitlistEntry.create({
      data: {
        itemId,
        userId: session.user.id,
      },
    });

    return NextResponse.json(waitlistEntry)
  } catch (error) {
    console.error("[WAITLIST_POST]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const itemId = params.id

    await prisma.waitlistEntry.delete({
      where: {
        itemId_userId: {
          itemId,
          userId: session.user.id,
        },
      },
    });

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("[WAITLIST_DELETE]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const itemId = params.id

    const waitlist = await prisma.waitlistEntry.findMany({
      where: { itemId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(waitlist)
  } catch (error) {
    console.error("[WAITLIST_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}

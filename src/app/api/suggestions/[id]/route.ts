// src/app/api/suggestions/[id]/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

const updateSuggestionSchema = z.object({
  status: z.enum(["PENDING", "PROCESSING", "COMPLETED", "REJECTED"]),
})

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const { status } = updateSuggestionSchema.parse(json)

    const request = await prisma.itemRequest.update({
      where: { id: params.id },
      data: {
        status,
        processedById: session.user.id,
      },
    })

    return NextResponse.json(request)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 })
    }
    return new NextResponse("Internal server error", { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const request = await prisma.itemRequest.findUnique({
      where: { id: params.id },
    })

    if (!request) {
      return new NextResponse("Not found", { status: 404 })
    }

    if (request.requestedById !== session.user.id && session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    await prisma.itemRequest.delete({
      where: { id: params.id },
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    return new NextResponse("Internal server error", { status: 500 })
  }
}

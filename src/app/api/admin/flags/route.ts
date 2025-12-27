// src/app/api/admin/flags/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

const flagSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  isEnabled: z.boolean(),
})

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const flags = await prisma.featureFlag.findMany({
      orderBy: { name: "asc" },
    })

    return NextResponse.json(flags)
  } catch (error) {
    return new NextResponse("Internal server error", { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const { name, description, isEnabled } = flagSchema.parse(json)

    const flag = await prisma.featureFlag.upsert({
      where: { name },
      update: { description, isEnabled },
      create: { name, description, isEnabled },
    })

    return NextResponse.json(flag)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 })
    }
    return new NextResponse("Internal server error", { status: 500 })
  }
}

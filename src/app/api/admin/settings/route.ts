// src/app/api/admin/settings/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

const settingSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
  type: z.enum(["STRING", "BOOLEAN", "NUMBER", "JSON"]),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const settings = await prisma.appSettings.findMany({
      orderBy: { key: "asc" },
    });

    return NextResponse.json(settings)
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
    const { key, value, type } = settingSchema.parse(json)

    const setting = await prisma.appSettings.upsert({
      where: { key },
      update: { value, type, updatedBy: session.user.id },
      create: { key, value, type, updatedBy: session.user.id },
    });

    return NextResponse.json(setting)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 })
    }
    return new NextResponse("Internal server error", { status: 500 })
  }
}

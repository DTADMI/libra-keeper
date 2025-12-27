// src/app/api/admin/users/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

const roleSchema = z.object({
  userId: z.string(),
  role: z.enum(["ADMIN", "USER"]),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(users)
  } catch (error) {
    return new NextResponse("Internal server error", { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const { userId, role } = roleSchema.parse(json)

    // Prevent removing own admin status if desired, but for now let's allow it with caution
    // if (userId === session.user.id) {
    //   return new NextResponse("Cannot change your own role", { status: 400 })
    // }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    return NextResponse.json(user)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 })
    }
    return new NextResponse("Internal server error", { status: 500 })
  }
}

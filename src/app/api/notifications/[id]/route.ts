// src/app/api/notifications/[id]/route.ts
import { NextResponse } from "next/server"

import { getServerAuth } from "@/lib/auth-utils"
import { prisma } from "@/lib/db"

export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerAuth()
    if (!session?.user) return new NextResponse("Unauthorized", { status: 401 })

    const { id } = await params

    const notification = await prisma.notification.findUnique({ where: { id } })
    if (!notification || notification.userId !== session.user.id) {
      return new NextResponse("Not found", { status: 404 })
    }

    await prisma.notification.update({ where: { id }, data: { isRead: true } })

    return NextResponse.json({ success: true })
  } catch {
    return new NextResponse("Internal server error", { status: 500 })
  }
}

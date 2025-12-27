// src/app/api/activity/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    // Fetch various activities and combine them
    // For now, let's just fetch latest loans and comments
    const [loans, comments, requests] = await Promise.all([
      prisma.loan.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true } }, item: { select: { title: true } } },
      }),
      prisma.comment.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true } }, item: { select: { title: true } } },
      }),
      prisma.itemRequest.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { requestedBy: { select: { name: true } } },
      }),
    ]);

    const activities = [
      ...loans.map((l) => ({
        id: l.id,
        type: "LOAN",
        user: l.user.name || "User",
        item: l.item.title,
        status: l.status,
        date: l.createdAt,
      })),
      ...comments.map((c) => ({
        id: c.id,
        type: "COMMENT",
        user: c.user.name || "User",
        item: c.item.title,
        date: c.createdAt,
      })),
      ...requests.map((r) => ({
        id: r.id,
        type: "REQUEST",
        user: r.requestedBy.name || "User",
        item: r.title,
        status: r.status,
        date: r.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 10);

    return NextResponse.json(activities)
  } catch (error) {
    return new NextResponse("Internal server error", { status: 500 })
  }
}

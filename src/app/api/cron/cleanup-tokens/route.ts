// src/app/api/cron/cleanup-tokens/route.ts
// Triggered weekly on Sunday at 3:00 AM via Vercel Cron
// Cleans up expired verification tokens and old sessions

import { NextResponse } from "next/server"

import { prisma } from "@/lib/db"

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)

    const deletedSessions = await prisma.session.deleteMany({
      where: { expires: { lt: yesterday } },
    })

    return NextResponse.json({
      success: true,
      deletedSessions: deletedSessions.count,
    })
  } catch (error) {
    console.error("Cleanup cron failed:", error)
    return NextResponse.json({ success: false, error: "Internal error" }, { status: 500 })
  }
}

// src/app/api/cron/email-reminders/route.ts
// Triggered daily at 9:00 AM via Vercel Cron
// Sends due-date reminders for upcoming and overdue loans

import { NextResponse } from "next/server"

import { emailClient } from "@/lib/adapters/email"
import { prisma } from "@/lib/db"

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization")
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  const now = new Date()
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)

  try {
    const upcomingLoans = await prisma.loan.findMany({
      where: {
        status: "APPROVED",
        dueAt: {
          lte: tomorrow,
          gt: now,
        },
      },
      include: { item: true, user: true },
    })

    const overdueLoans = await prisma.loan.findMany({
      where: {
        status: "OVERDUE",
      },
      include: { item: true, user: true },
    })

    const admin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
      select: { email: true },
    })

    const results: string[] = []

    for (const loan of upcomingLoans) {
      if (loan.user.email) {
        await emailClient.send({
          to: loan.user.email,
          subject: `Reminder: "${loan.item.title}" is due tomorrow`,
          text: `Your loan for "${loan.item.title}" is due on ${loan.dueAt?.toLocaleDateString()}. Please return it or request an extension.`,
        })
        results.push(`Reminder sent to ${loan.user.email} for "${loan.item.title}"`)
      }
    }

    for (const loan of overdueLoans) {
      if (loan.user.email) {
        await emailClient.send({
          to: loan.user.email,
          subject: `Overdue: "${loan.item.title}"`,
          text: `Your loan for "${loan.item.title}" is overdue since ${loan.dueAt?.toLocaleDateString()}. Please return it as soon as possible.`,
        })
        results.push(`Overdue notice sent to ${loan.user.email} for "${loan.item.title}"`)
      }
    }

    if (results.length > 0 && admin?.email) {
      await emailClient.send({
        to: admin.email,
        subject: `Daily loan reminder summary — ${results.length} notifications sent`,
        text: results.join("\n"),
      })
    }

    return NextResponse.json({
      success: true,
      upcomingReminders: upcomingLoans.length,
      overdueNotices: overdueLoans.length,
      total: results.length,
    })
  } catch (error) {
    console.error("Email reminder cron failed:", error)
    return NextResponse.json({ success: false, error: "Internal error" }, { status: 500 })
  }
}

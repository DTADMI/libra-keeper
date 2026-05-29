// src/app/api/cron/email-reminders/route.ts
// Triggered daily at 9:00 AM via Vercel Cron
// Sends due-date reminders for upcoming and overdue loans

import { NextResponse } from "next/server";

import { emailClient } from "@/lib/adapters/email";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { dueReminderTemplate, overdueReminderTemplate } from "@/lib/mail/templates";
import { withProtection } from "@/lib/security/protection";

async function _GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

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
    });

    const overdueLoans = await prisma.loan.findMany({
      where: {
        status: "OVERDUE",
      },
      include: { item: true, user: true },
    });

    const results: string[] = [];

    for (const loan of upcomingLoans) {
      if (loan.user.email && loan.user.name && loan.dueAt) {
        const daysRemaining = Math.ceil(
          (loan.dueAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
        );
        const { subject, html } = dueReminderTemplate({
          userName: loan.user.name,
          itemTitle: loan.item.title,
          dueDate: loan.dueAt.toLocaleDateString("en-CA"),
          daysRemaining,
        });
        await emailClient.send({
          to: loan.user.email,
          subject,
          html,
        });
        results.push(`Reminder sent to ${loan.user.email} for "${loan.item.title}"`);
      }
    }

    for (const loan of overdueLoans) {
      if (loan.user.email && loan.user.name && loan.dueAt) {
        const daysOverdue = Math.ceil(
          (now.getTime() - loan.dueAt.getTime()) / (1000 * 60 * 60 * 24),
        );
        const { subject, html } = overdueReminderTemplate({
          userName: loan.user.name,
          itemTitle: loan.item.title,
          dueDate: loan.dueAt.toLocaleDateString("en-CA"),
          daysOverdue,
        });
        await emailClient.send({
          to: loan.user.email,
          subject,
          html,
        });
        results.push(`Overdue notice sent to ${loan.user.email} for "${loan.item.title}"`);
      }
    }

    return NextResponse.json({
      success: true,
      upcomingReminders: upcomingLoans.length,
      overdueNotices: overdueLoans.length,
      total: results.length,
    });
  } catch (error) {
    logger.error("Email reminder cron failed:", error);
    return NextResponse.json({ success: false, error: "Internal error" }, { status: 500 });
  }
}

export const GET = withProtection(_GET, { scope: "api", limit: 30, windowSeconds: 60 });

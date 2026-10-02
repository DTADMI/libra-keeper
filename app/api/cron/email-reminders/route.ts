// src/app/api/cron/email-reminders/route.ts
// Triggered daily at 9:00 AM via Vercel Cron
// Sends due-date reminders for upcoming and overdue loans

import { NextResponse } from "next/server";

import { emailClient } from "@/lib/adapters/email";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { dueReminderTemplate, overdueReminderTemplate } from "@/lib/mail/templates";
import { planLoanReminders } from "@/lib/loan-reminders";
import { withProtection } from "@/lib/security/protection";

async function _GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  try {
    const loans = await prisma.loan.findMany({
      where: {
        OR: [
          { status: "APPROVED", dueAt: { lte: tomorrow, gt: now } },
          { status: "OVERDUE" },
        ],
      },
      include: { item: true, user: true },
    });

    const reminders = planLoanReminders(
      loans.map((loan) => ({
        status: loan.status,
        dueAt: loan.dueAt,
        item: loan.item,
        user: loan.user,
      })),
      now,
      24,
    );

    const results: string[] = [];
    let upcoming = 0;
    let overdue = 0;

    for (const reminder of reminders) {
      const dueDate = reminder.dueAt.toLocaleDateString("en-CA");
      const template =
        reminder.kind === "overdue"
          ? overdueReminderTemplate({
              userName: reminder.userName,
              itemTitle: reminder.itemTitle,
              dueDate,
              daysOverdue: reminder.days,
            })
          : dueReminderTemplate({
              userName: reminder.userName,
              itemTitle: reminder.itemTitle,
              dueDate,
              daysRemaining: reminder.days,
            });

      await emailClient.send({ to: reminder.userEmail, subject: template.subject, html: template.html });
      if (reminder.kind === "overdue") {
        overdue += 1;
        results.push(`Overdue notice sent to ${reminder.userEmail} for "${reminder.itemTitle}"`);
      } else {
        upcoming += 1;
        results.push(`Reminder sent to ${reminder.userEmail} for "${reminder.itemTitle}"`);
      }
    }

    return NextResponse.json({
      success: true,
      upcomingReminders: upcoming,
      overdueNotices: overdue,
      total: results.length,
    });
  } catch (error) {
    logger.error("Email reminder cron failed:", error);
    return NextResponse.json({ success: false, error: "Internal error" }, { status: 500 });
  }
}

export const GET = withProtection(_GET, { scope: "api", limit: 30, windowSeconds: 60 });

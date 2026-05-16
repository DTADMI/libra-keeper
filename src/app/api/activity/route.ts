// src/app/api/activity/route.ts
import { NextResponse } from "next/server";

import { getServerAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerAuth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const [loans, comments, requests] = await Promise.all([
      prisma.loan.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, name: true } },
          item: { select: { id: true, title: true } },
        },
      }),
      prisma.comment.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, name: true } },
          item: { select: { id: true, title: true } },
        },
      }),
      prisma.itemRequest.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { requestedBy: { select: { id: true, name: true } } },
      }),
    ]);

    const activities = [
      ...loans.map((l) => ({
        id: l.id,
        type: "LOAN" as const,
        message:
          l.status === "PENDING"
            ? `${l.user.name || "Someone"} requested to borrow "${l.item.title}"`
            : l.status === "APPROVED"
              ? `"${l.item.title}" was loaned to ${l.user.name || "someone"}`
              : l.status === "RETURNED"
                ? `${l.user.name || "Someone"} returned "${l.item.title}"`
                : l.status === "REJECTED"
                  ? `Loan request for "${l.item.title}" was rejected`
                  : l.status === "OVERDUE"
                    ? `"${l.item.title}" is overdue from ${l.user.name || "someone"}`
                    : `${l.user.name || "Someone"} ${l.status.toLowerCase()} "${l.item.title}"`,
        user: { id: l.user.id, name: l.user.name },
        item: { id: l.item.id, title: l.item.title },
        createdAt: l.createdAt.toISOString(),
      })),
      ...comments.map((c) => ({
        id: c.id,
        type: "COMMENT" as const,
        message: `${c.user.name || "Someone"} commented on "${c.item.title}"`,
        user: { id: c.user.id, name: c.user.name },
        item: { id: c.item.id, title: c.item.title },
        createdAt: c.createdAt.toISOString(),
      })),
      ...requests.map((r) => ({
        id: r.id,
        type: "REQUEST" as const,
        message:
          r.status === "PENDING"
            ? `${r.requestedBy.name || "Someone"} suggested "${r.title}"`
            : `${r.requestedBy.name || "Someone"}'s suggestion "${r.title}" was ${r.status.toLowerCase()}`,
        user: { id: r.requestedBy.id, name: r.requestedBy.name },
        item: { title: r.title },
        createdAt: r.createdAt.toISOString(),
      })),
    ]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 15);

    return NextResponse.json(activities);
  } catch (error) {
    console.error("Activity feed error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

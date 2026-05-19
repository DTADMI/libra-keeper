import { NextResponse } from "next/server";
import { z } from "zod";

import { getServerAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { sendLoanStatusEmail } from "@/lib/mail";
import { RATE_LIMITS,withProtection } from "@/lib/security/protection";
const updateLoanSchema = z.object({
  status: z.enum(["APPROVED", "REJECTED", "RETURNED", "OVERDUE", "LOST", "DAMAGED"]),
  dueAt: z.string().datetime().optional(),
  returnCondition: z.string().optional(),
  returnNotes: z.string().optional(),
});

async function _PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerAuth();
    if (!session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const { status, dueAt, returnCondition, returnNotes } = updateLoanSchema.parse(json);

    const loan = await prisma.loan.findUnique({
      where: { id },
      include: { item: true, user: true },
    });

    if (!loan) {
      return new NextResponse("Loan not found", { status: 404 });
    }

    const isAdmin = session.user.role === "ADMIN";
    const isOwnLoan = loan.userId === session.user.id;
    const isUserReturn = status === "RETURNED" && isOwnLoan && !isAdmin;

    if (!isAdmin && !isUserReturn) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const updateData: Record<string, unknown> = { status };

    if (dueAt) {updateData.dueAt = new Date(dueAt);}
    if (status === "APPROVED") {updateData.approvedAt = new Date();}
    if (status === "RETURNED") {
      updateData.returnedAt = new Date();
      if (returnCondition) {updateData.returnCondition = returnCondition;}
      if (returnNotes) {updateData.returnNotes = returnNotes;}
    }

    const updatedLoan = await prisma.loan.update({
      where: { id },
      data: updateData as Parameters<typeof prisma.loan.update>[0]["data"],
    });

    if (status === "APPROVED") {
      await prisma.item.update({ where: { id: loan.itemId }, data: { status: "BORROWED" } });
    } else if (status === "RETURNED" || status === "LOST" || status === "DAMAGED") {
      const newItemStatus = status === "DAMAGED" ? "UNAVAILABLE" : "AVAILABLE";
      await prisma.item.update({ where: { id: loan.itemId }, data: { status: newItemStatus } });
    }

    if (returnCondition && isAdmin) {
      await prisma.conditionHistory.create({
        data: {
          itemId: loan.itemId,
          loanId: loan.id,
          newCondition: returnCondition,
          notes: returnNotes ?? null,
          changedById: session.user.id,
        },
      });
    }

    if ((status === "APPROVED" || status === "REJECTED") && loan.user.email) {
      await sendLoanStatusEmail(loan.user.email, loan.item.title, status);
    }

    if (isAdmin) {
      await prisma.notification.create({
        data: {
          userId: loan.userId,
          type: `LOAN_${status}`,
          title: `Loan ${status.toLowerCase()}`,
          body:
            status === "APPROVED"
              ? `Your request to borrow "${loan.item.title}" was approved!`
              : status === "REJECTED"
                ? `Your request to borrow "${loan.item.title}" was rejected.`
                : status === "RETURNED"
                  ? `"${loan.item.title}" has been marked as returned.`
                  : `Your loan for "${loan.item.title}" is now ${status.toLowerCase()}.`,
          link: `/items/${loan.itemId}`,
        },
      });
    }

    return NextResponse.json(updatedLoan);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 });
    }
    logger.error("Loan update error:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export const PATCH = withProtection(_PATCH, { scope: "write", limit: 60, windowSeconds: 60 });

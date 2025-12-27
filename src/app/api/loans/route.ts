import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { z } from "zod"
import { sendLoanRequestEmail } from "@/lib/mail"

const loanSchema = z.object({
  itemId: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const json = await req.json()
    const { itemId } = loanSchema.parse(json)

    const item = await prisma.item.findUnique({
      where: { id: itemId },
    })

    if (!item) {
      return new NextResponse("Item not found", { status: 404 })
    }

    if (item.status !== "AVAILABLE") {
      return new NextResponse("Item is not available", { status: 400 })
    }

    const loan = await prisma.loan.create({
      data: {
        itemId,
        userId: session.user.id,
        status: "PENDING",
      },
    })

    // Send email to admin
    const admins = await prisma.user.findMany({
      where: { role: "ADMIN" },
      select: { email: true },
    })

    for (const admin of admins) {
      if (admin.email) {
        await sendLoanRequestEmail(admin.email, session.user.name || "A user", item.title)
      }
    }

    return NextResponse.json(loan, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 })
    }
    return new NextResponse("Internal server error", { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const loans = await prisma.loan.findMany({
      where: session.user.role === "ADMIN" ? {} : { userId: session.user.id },
      include: {
        item: true,
        user: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(loans)
  } catch (error) {
    return new NextResponse("Internal server error", { status: 500 })
  }
}

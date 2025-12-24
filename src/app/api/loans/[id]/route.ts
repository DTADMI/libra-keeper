import {NextResponse} from "next/server"
import {getServerSession} from "next-auth"
import {authOptions} from "@/lib/auth"
import {prisma} from "@/lib/db"
import {z} from "zod"
import {sendLoanStatusEmail} from "@/lib/mail"

const updateLoanSchema = z.object({
    status: z.enum(["APPROVED", "REJECTED", "RETURNED"]),
    dueAt: z.string().datetime().optional(),
})

export async function PATCH(
    req: Request,
    {params}: { params: Promise<{ id: string }> }
) {
    try {
        const {id} = await params
        const session = await getServerSession(authOptions)
        if (!session?.user || session.user.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const json = await req.json()
        const { status, dueAt } = updateLoanSchema.parse(json)

        const loan = await prisma.loan.findUnique({
            where: {id},
            include: { item: true, user: true },
        })

        if (!loan) {
            return new NextResponse("Loan not found", { status: 404 })
        }

        const updatedLoan = await prisma.loan.update({
            where: {id},
            data: {
                status,
                dueAt: dueAt ? new Date(dueAt) : undefined,
                approvedAt: status === "APPROVED" ? new Date() : undefined,
                returnedAt: status === "RETURNED" ? new Date() : undefined,
            },
        })

        // Update item status based on loan status
        if (status === "APPROVED") {
            await prisma.item.update({
                where: { id: loan.itemId },
                data: { status: "BORROWED" },
            })
        } else if (status === "RETURNED") {
            await prisma.item.update({
                where: { id: loan.itemId },
                data: { status: "AVAILABLE" },
            })
        }

        // Send email to user if approved or rejected
        if ((status === "APPROVED" || status === "REJECTED") && loan.user.email) {
            await sendLoanStatusEmail(loan.user.email, loan.item.title, status)
        }

        return NextResponse.json(updatedLoan)
    } catch (error) {
        if (error instanceof z.ZodError) {
            return new NextResponse(JSON.stringify(error.issues), { status: 422 })
        }
        return new NextResponse("Internal server error", { status: 500 })
    }
}

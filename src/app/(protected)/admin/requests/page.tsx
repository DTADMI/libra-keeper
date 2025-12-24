import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RequestActionButtons } from "./request-action-buttons"

export default async function AdminRequestsPage() {
    const session = await getServerSession(authOptions)

    if (session?.user.role !== "ADMIN") {
        redirect("/dashboard")
    }

    const loans = await prisma.loan.findMany({
        where: {
            status: "PENDING"
        },
        include: {
            item: true,
            user: true,
        },
        orderBy: {
            createdAt: "desc"
        }
    })

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Borrowing Requests</h1>
            
            <div className="grid gap-4">
                {loans.map((loan) => (
                    <Card key={loan.id}>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-lg">{loan.item.title}</CardTitle>
                                    <p className="text-sm text-muted-foreground">Requested by: {loan.user.name} ({loan.user.email})</p>
                                </div>
                                <Badge>{loan.status}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center">
                                <p className="text-xs text-muted-foreground">
                                    Requested on: {new Date(loan.createdAt).toLocaleDateString()}
                                </p>
                                <RequestActionButtons loanId={loan.id} />
                            </div>
                        </CardContent>
                    </Card>
                ))}
                
                {loans.length === 0 && (
                    <p className="text-center py-10 text-muted-foreground">No pending requests.</p>
                )}
            </div>
        </div>
    )
}

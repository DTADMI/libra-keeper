import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function MyLoansPage() {
  const session = await getServerSession(authOptions)

  const loans = await prisma.loan.findMany({
    where: {
      userId: session?.user.id,
    },
    include: {
      item: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Borrowed Items</h1>

      <div className="grid gap-4">
        {loans.map((loan) => (
          <Card key={loan.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{loan.item.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{loan.item.author}</p>
                </div>
                <Badge
                  variant={
                    loan.status === "APPROVED"
                      ? "default"
                      : loan.status === "PENDING"
                        ? "secondary"
                        : loan.status === "RETURNED"
                          ? "outline"
                          : "destructive"
                  }
                >
                  {loan.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end">
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Requested: {new Date(loan.createdAt).toLocaleDateString()}</p>
                  {loan.approvedAt && (
                    <p>Approved: {new Date(loan.approvedAt).toLocaleDateString()}</p>
                  )}
                  {loan.dueAt && (
                    <p className="font-medium text-primary">
                      Due: {new Date(loan.dueAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                {loan.status === "APPROVED" && (
                  <p className="text-sm font-medium">Enjoy your item!</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {loans.length === 0 && (
          <p className="text-center py-10 text-muted-foreground">
            You haven&apos;t borrowed any items yet.
          </p>
        )}
      </div>
    </div>
  )
}

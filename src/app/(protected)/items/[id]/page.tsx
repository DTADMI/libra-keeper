import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { BorrowButton } from "./borrow-button"
import { LikeButton } from "./like-button"
import { CommentsSection } from "./comments-section"
import { ReportButton } from "./report-button"
import { WaitlistButton } from "./waitlist-button"

export default async function ItemDetailsPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  const item = await prisma.item.findUnique({
    where: { id: params.id },
    include: {
      tags: true,
      loans: {
        where: {
          status: {
            in: ["PENDING", "APPROVED"],
          },
        },
        include: { user: true },
        orderBy: { createdAt: "desc" },
      },
      waitlist: {
        include: { user: true },
      },
    },
  })

  if (!item) {
    notFound()
  }

  const isAdmin = session?.user.role === "ADMIN"
  const hasActiveLoan = item.loans.length > 0
  const userHasPendingLoan = item.loans.some(
    (loan) => loan.userId === session?.user.id && loan.status === "PENDING",
  )
  const userJoinedWaitlist = item.waitlist.some((entry) => entry.userId === session?.user.id)

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="flex flex-col md:flex-row gap-10">
        <div className="w-full md:w-1/3 max-w-sm">
          {item.coverImage ? (
            <img
              src={item.coverImage}
              alt={item.title}
              className="rounded-lg shadow-lg w-full object-cover aspect-[2/3]"
            />
          ) : (
            <div className="rounded-lg bg-muted flex items-center justify-center aspect-[2/3] text-muted-foreground">
              No Cover Image
            </div>
          )}
        </div>

        <div className="flex-1 space-y-6">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <Badge variant="secondary">{item.type}</Badge>
              <Badge variant={item.status === "AVAILABLE" ? "default" : "destructive"}>
                {item.status}
              </Badge>
            </div>
            <h1 className="text-4xl font-bold">{item.title}</h1>
            <p className="text-xl text-muted-foreground mt-1">{item.author}</p>
            <div className="mt-2 flex items-center gap-4">
              <LikeButton itemId={item.id} />
              <ReportButton itemId={item.id} />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <Badge key={tag.id} variant="outline">
                {tag.name}
              </Badge>
            ))}
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Description</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {item.description || "No description provided."}
            </p>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium">Publisher</p>
              <p className="text-muted-foreground">{item.publisher || "N/A"}</p>
            </div>
            <div>
              <p className="font-medium">ISBN</p>
              <p className="text-muted-foreground">{item.isbn || "N/A"}</p>
            </div>
          </div>

          <div className="pt-6 flex flex-wrap gap-4">
            {item.status === "AVAILABLE" && !isAdmin && (
              <BorrowButton itemId={item.id} disabled={userHasPendingLoan} />
            )}
            {item.status === "BORROWED" &&
              !isAdmin &&
              session?.user.id !== item.loans.find((l) => l.status === "APPROVED")?.userId && (
                <WaitlistButton itemId={item.id} isJoined={userJoinedWaitlist} />
              )}
            {userHasPendingLoan && (
              <p className="text-sm text-muted-foreground italic">
                You have a pending borrow request for this item.
              </p>
            )}
            {isAdmin && (
              <Button asChild variant="outline" size="lg">
                <Link href={`/items/${item.id}/edit`}>Edit Item</Link>
              </Button>
            )}
          </div>

          {item.waitlist.length > 0 && (
            <div className="pt-4">
              <h3 className="text-sm font-medium mb-2">Waitlist ({item.waitlist.length})</h3>
              <div className="flex -space-x-2 overflow-hidden">
                {item.waitlist.map((entry) => (
                  <div
                    key={entry.id}
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-background bg-muted flex items-center justify-center text-[10px]"
                    title={entry.user.name || "User"}
                  >
                    {entry.user.image ? (
                      <img
                        src={entry.user.image}
                        alt={entry.user.name || ""}
                        className="h-full w-full rounded-full"
                      />
                    ) : (
                      <span>{entry.user.name?.charAt(0).toUpperCase() || "U"}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator className="my-10" />

          <CommentsSection itemId={item.id} />
        </div>
      </div>
    </div>
  );
}

import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ItemGallery } from "@/components/gallery"
import { formatDistanceToNow } from "date-fns"
import { getServerAuth } from "@/lib/auth-utils"
import { prisma } from "@/lib/db"

import { BorrowButton } from "./borrow-button"
import { CommentsSection } from "./comments-section"
import { LikeButton } from "./like-button"
import { ReportButton } from "./report-button"
import { WaitlistButton } from "./waitlist-button"

type ItemType = "BOOK" | "MUSIC" | "MOVIE" | "GAME" | "TOY" | "CLOTHES" | "OTHER"

const CREATOR_LABELS: Record<ItemType, string> = {
  BOOK: "Author", MUSIC: "Artist", MOVIE: "Director", GAME: "Developer",
  TOY: "Brand", CLOTHES: "Brand", OTHER: "Creator",
}

const ID_LABELS: Record<ItemType, string> = {
  BOOK: "ISBN", MUSIC: "UPC", MOVIE: "UPC", GAME: "UPC",
  TOY: "Barcode", CLOTHES: "SKU", OTHER: "Identifier",
}

const MAKER_LABELS: Record<ItemType, string> = {
  BOOK: "Publisher", MUSIC: "Label", MOVIE: "Studio", GAME: "Publisher",
  TOY: "Manufacturer", CLOTHES: "Manufacturer", OTHER: "Maker",
}

export default async function ItemDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const session = await getServerAuth()

  const item = await prisma.item.findUnique({
    where: { id },
    include: {
      tags: true,
      loans: {
        include: { user: true },
        orderBy: { createdAt: "desc" },
      },
      waitlist: {
        include: { user: true },
      },
    },
  });

  if (!item) {
    notFound()
  }

  const isAdmin = session?.user?.role === "ADMIN"
  const hasActiveLoan = item.loans.length > 0
  const userHasPendingLoan = item.loans.some(
    (loan) => loan.userId === session?.user?.id && loan.status === "PENDING",
  );
  const userJoinedWaitlist = item.waitlist.some((entry) => entry.userId === session?.user?.id)

  const itemType = item.type as ItemType
  const meta = item.metadata as Record<string, unknown> | null | undefined

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
            {item.author && (
              <p className="text-xl text-muted-foreground mt-1">
                {CREATOR_LABELS[itemType]}: {item.author}
              </p>
            )}
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

          <ItemGallery itemId={item.id} isAdmin={isAdmin} />

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Description</h2>
            <p className="text-muted-foreground whitespace-pre-wrap">
              {item.description || "No description provided."}
            </p>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4 text-sm">
            {item.publisher && (
              <div>
                <p className="font-medium">{MAKER_LABELS[itemType]}</p>
                <p className="text-muted-foreground">{item.publisher}</p>
              </div>
            )}
            {item.isbn && (
              <div>
                <p className="font-medium">{ID_LABELS[itemType]}</p>
                <p className="text-muted-foreground">{item.isbn}</p>
              </div>
            )}

            {meta && typeof meta === "object" && (
              <>
                {(meta.brand as string) && (
                  <div>
                    <p className="font-medium">Brand</p>
                    <p className="text-muted-foreground">{String(meta.brand)}</p>
                  </div>
                )}
                {(meta.size as string) && (
                  <div>
                    <p className="font-medium">Size</p>
                    <p className="text-muted-foreground">{String(meta.size)}</p>
                  </div>
                )}
                {(meta.material as string) && (
                  <div>
                    <p className="font-medium">Material</p>
                    <p className="text-muted-foreground">{String(meta.material)}</p>
                  </div>
                )}
                {(meta.condition as string) && (
                  <div>
                    <p className="font-medium">Condition</p>
                    <p className="text-muted-foreground">{String(meta.condition)}</p>
                  </div>
                )}
                {(meta.ageRange as string) && (
                  <div>
                    <p className="font-medium">Age Range</p>
                    <p className="text-muted-foreground">{String(meta.ageRange)}</p>
                  </div>
                )}
                {(meta.genre as string) && (
                  <div>
                    <p className="font-medium">Genre</p>
                    <p className="text-muted-foreground">{String(meta.genre)}</p>
                  </div>
                )}
                {(meta.platform as string) && (
                  <div>
                    <p className="font-medium">Platform</p>
                    <p className="text-muted-foreground">{String(meta.platform)}</p>
                  </div>
                )}
                {(meta.duration as string) && (
                  <div>
                    <p className="font-medium">Duration</p>
                    <p className="text-muted-foreground">{String(meta.duration)}</p>
                  </div>
                )}
              </>
            )}
          </div>

          <div className="pt-6 flex flex-wrap gap-4">
            {item.status === "AVAILABLE" && !isAdmin && (
              <BorrowButton itemId={item.id} disabled={userHasPendingLoan} />
            )}
            {item.status === "BORROWED" &&
              !isAdmin &&
              session?.user?.id !== item.loans.find((l) => l.status === "APPROVED")?.userId && (
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

          {item.loans.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Loan History</h2>
                <div className="space-y-2">
                  {item.loans.map((loan) => (
                    <div key={loan.id} className="flex items-center justify-between text-sm border-b pb-2">
                      <div>
                        <p className="font-medium">{loan.user.name || "Unknown"}</p>
                        <p className="text-xs text-muted-foreground">
                          {loan.status === "PENDING" && "Requested "}
                          {loan.status === "APPROVED" && "Borrowed "}
                          {loan.status === "RETURNED" && "Returned "}
                          {loan.status === "REJECTED" && "Rejected "}
                          {loan.status === "OVERDUE" && "Overdue since "}
                          {loan.status === "LOST" && "Lost "}
                          {loan.status === "DAMAGED" && "Returned damaged "}
                          {formatDistanceToNow(new Date(loan.createdAt), { addSuffix: true })}
                          {loan.returnedAt && ` · Returned ${formatDistanceToNow(new Date(loan.returnedAt), { addSuffix: true })}`}
                        </p>
                        {loan.returnCondition && (
                          <p className="text-xs text-muted-foreground">
                            Condition: {loan.returnCondition}
                            {loan.returnNotes && ` — ${loan.returnNotes}`}
                          </p>
                        )}
                      </div>
                      <Badge variant="outline" className="text-[10px]">
                        {loan.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          <Separator className="my-10" />

          <CommentsSection itemId={item.id} />
        </div>
      </div>
    </div>
  );
}

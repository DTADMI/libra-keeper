import Link from "next/link";

import { ActivityFeed } from "@/components/activity/activity-feed";
import { DashboardToolbar } from "@/components/dashboard-toolbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { TYPE_SUBTITLE } from "@/lib/labels";

export default async function DashboardPage() {

  type ItemWithTags = {
    id: string
    title: string
    type: string
    author: string | null
    coverImage: string | null
    tags: Array<{ id: string; name: string }>
  }

  const items = (await prisma.item.findMany({
    include: { tags: true },
    orderBy: { createdAt: "desc" },
    take: 20,
  })) as ItemWithTags[];

  return (
    <div className="container mx-auto p-4">
      <DashboardToolbar />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <h2 className="text-xl font-semibold mb-4">Your Library</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item: ItemWithTags) => (
              <Link key={item.id} href={`/items/${item.id}`}>
                <Card className="overflow-hidden hover:shadow-md transition-shadow">
                  {item.coverImage && (
                    <div className="aspect-[2/3] relative">
                      <img
                        src={item.coverImage}
                        alt={item.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                  <CardHeader className="p-4">
                    <div className="flex justify-between items-start gap-2">
                      <CardTitle className="text-lg line-clamp-1">{item.title}</CardTitle>
                      <Badge variant="secondary" className="shrink-0">
                        {item.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {item.author ? `${TYPE_SUBTITLE[item.type] ?? "by"} ${item.author}` : ""}
                    </p>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <div className="flex flex-wrap gap-1">
                      {item.tags.map((tag) => (
                        <Badge key={tag.id} variant="outline" className="text-[10px]">
                          {tag.name}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
            {items.length === 0 && (
              <p className="text-muted-foreground col-span-full text-center py-10">
                No items in the library yet.
              </p>
            )}
          </div>
        </div>
        <div className="lg:col-span-1">
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}

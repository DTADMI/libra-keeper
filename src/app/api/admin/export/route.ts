// src/app/api/admin/export/route.ts
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"

import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const format = searchParams.get("format") || "json"

    const items = await prisma.item.findMany({
      include: { tags: true },
    })

    if (format === "csv") {
      const headers = ["id", "title", "author", "type", "status", "isbn", "publisher", "createdAt"]
      const rows = items.map(item => [
        item.id,
        `"${item.title.replace(/"/g, '""')}"`,
        `"${(item.author || "").replace(/"/g, '""')}"`,
        item.type,
        item.status,
        item.isbn || "",
        `"${(item.publisher || "").replace(/"/g, '""')}"`,
        item.createdAt.toISOString(),
      ])

      const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n")
      
      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="librakeeper-export-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      })
    }

    return NextResponse.json(items, {
      headers: {
        "Content-Disposition": `attachment; filename="librakeeper-export-${new Date().toISOString().split('T')[0]}.json"`,
      },
    })
  } catch (error) {
    return new NextResponse("Internal server error", { status: 500 })
  }
}

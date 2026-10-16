// src/app/api/admin/export/route.ts
import { NextResponse } from "next/server";

import { getServerAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { withProtection } from "@/lib/security/protection";
import { toCsv } from "@/lib/libra-csv";

async function _GET(req: Request) {
  try {
    const session = await getServerAuth();
    if (!session.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format") || "json";

    const items = await prisma.item.findMany({
      include: { tags: true },
    });

    if (format === "csv") {
      const headers = ["id", "title", "author", "type", "status", "isbn", "publisher", "createdAt"];
      const rows = items.map((item) => [
        item.id,
        item.title,
        item.author || "",
        item.type,
        item.status,
        item.isbn || "",
        item.publisher || "",
        item.createdAt.toISOString(),
      ]);

      const csvContent = toCsv(headers, rows);

      return new NextResponse(csvContent, {
        headers: {
          "Content-Type": "text/csv",
          "Content-Disposition": `attachment; filename="librakeeper-export-${new Date().toISOString().split("T")[0]}.csv"`,
        },
      });
    }

    return NextResponse.json(items, {
      headers: {
        "Content-Disposition": `attachment; filename="librakeeper-export-${new Date().toISOString().split("T")[0]}.json"`,
      },
    });
  } catch (error) {
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export const GET = withProtection(_GET, { scope: "admin", limit: 200, windowSeconds: 60 });

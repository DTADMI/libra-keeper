// src/app/api/search/route.ts
import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { withProtection } from "@/lib/security/protection";

async function _GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim() ?? "";

  if (q.length < 2) {
    return NextResponse.json([]);
  }

  try {
    // Use raw SQL for PostgreSQL full-text search via Prisma $queryRaw
    const results = await prisma.$queryRawUnsafe<
      Array<{
        id: string
        title: string
        type: string
        author: string | null
        coverImage: string | null
        rank: number
        likes_count: number
        comments_count: number
      }>
    >(
      `SELECT
        i.id,
        i.title,
        i."type"::text,
        i."author",
        i."coverImage",
        ts_rank(i.search_vector, websearch_to_tsquery('english', $1))::float8 AS rank,
        (SELECT COUNT(*) FROM "Like" l WHERE l."itemId" = i.id)::int AS likes_count,
        (SELECT COUNT(*) FROM "Comment" c WHERE c."itemId" = i.id)::int AS comments_count
      FROM "Item" i
      WHERE i.search_vector @@ websearch_to_tsquery('english', $1)
      ORDER BY rank DESC
      LIMIT 20`,
      q,
    );

    const items = results.map((r) => ({
      id: r.id,
      title: r.title,
      type: r.type,
      author: r.author,
      coverImage: r.coverImage,
      rank: r.rank,
      _count: {
        likes: r.likes_count,
        comments: r.comments_count,
      },
    }));

    return NextResponse.json(items);
  } catch (error) {
    logger.error("Search error:", error);
    return NextResponse.json([], { status: 200 });
  }
}

export const GET = withProtection(_GET, { scope: "api", limit: 100, windowSeconds: 60 });

import { logger } from "@/lib/logger";
// src/app/api/search/route.ts
import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { parseTagsParam, searchTsConfig } from "@/lib/search";
import { withProtection } from "@/lib/security/protection";

async function _GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim() ?? "";
  const tags = parseTagsParam(url.searchParams.get("tags"));
  const collection = url.searchParams.get("collection")?.trim() || null;

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
        headline: string
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
        ts_rank(i.search_vector, websearch_to_tsquery($2::regconfig, $1))::float8 AS rank,
        ts_headline($2::regconfig, i.title, websearch_to_tsquery($2::regconfig, $1), 'StartSel=<mark>, StopSel=</mark>, MaxWords=50, MinWords=10') AS headline,
        (SELECT COUNT(*) FROM "Like" l WHERE l."itemId" = i.id)::int AS likes_count,
        (SELECT COUNT(*) FROM "Comment" c WHERE c."itemId" = i.id)::int AS comments_count
      FROM "Item" i
      WHERE i.search_vector @@ websearch_to_tsquery($2::regconfig, $1)
        AND ($3::text[] IS NULL OR i.id IN (SELECT it."A" FROM "_ItemTags" it JOIN "Tag" t ON t.id = it."B" WHERE t.name = ANY($3::text[])))
        AND ($4::text IS NULL OR i."collectionId" = $4)
      ORDER BY rank DESC
      LIMIT 20`,
      q,
      searchTsConfig(q),
      tags.length > 0 ? tags : null,
      collection,
    );

    const items = results.map((r) => ({
      id: r.id,
      title: r.title,
      type: r.type,
      author: r.author,
      coverImage: r.coverImage,
      rank: r.rank,
      headline: r.headline,
      _count: {
        likes: r.likes_count,
        comments: r.comments_count,
      },
    }));

    return NextResponse.json(items);
  } catch (error) {
    logger.error("Search error:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export const GET = withProtection(_GET, { scope: "api", limit: 100, windowSeconds: 60 });
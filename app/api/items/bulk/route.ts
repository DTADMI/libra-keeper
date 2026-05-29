// src/app/api/items/bulk/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";

import { getServerAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { withProtection } from "@/lib/security/protection";

const bulkItemSchema = z.object({
  title: z.string().min(1),
  type: z.enum(["BOOK", "MUSIC", "MOVIE", "GAME", "TOY", "CLOTHES", "OTHER"]),
  author: z.string().optional(),
  publisher: z.string().optional(),
  isbn: z.string().optional(),
  description: z.string().optional(),
  coverImage: z.string().optional(),
});

const bulkSchema = z.object({
  items: z.array(bulkItemSchema).min(1).max(100),
});

async function handler(req: Request) {
  try {
    const session = await getServerAuth();
    if (!session.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const { items } = bulkSchema.parse(json);

    const results = await prisma.$transaction(
      items.map((item) =>
        prisma.item.create({
          data: {
            title: item.title,
            type: item.type,
            author: item.author || null,
            publisher: item.publisher || null,
            isbn: item.isbn || null,
            description: item.description || null,
            coverImage: item.coverImage || null,
          },
        }),
      ),
    );

    return NextResponse.json({ count: results.length, errors: [] });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { count: 0, errors: error.issues.map((i) => i.message) },
        { status: 422 },
      );
    }
    return NextResponse.json(
      { count: 0, errors: ["Internal server error"] },
      { status: 500 },
    );
  }
}

export const POST = withProtection(handler, { scope: "write", limit: 10, windowSeconds: 60 });

import { NextResponse } from "next/server";
import { z } from "zod";

import { getServerAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { RATE_LIMITS,withProtection } from "@/lib/security/protection";
const collectionSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

async function _POST(req: Request) {
  try {
    const session = await getServerAuth();
    if (!session.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const { name, description } = collectionSchema.parse(json);

    const collection = await prisma.collection.create({
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(collection, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 });
    }
    logger.error("[COLLECTIONS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const collections = await prisma.collection.findMany({
      include: {
        _count: {
          select: { items: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json(collections);
  } catch (error) {
    logger.error("[COLLECTIONS_GET]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export const POST = withProtection(_POST, { scope: "write", limit: 60, windowSeconds: 60 });

// src/app/api/suggestions/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";

import { getServerAuth } from "@/lib/auth-utils";
import { withProtection, RATE_LIMITS } from "@/lib/security/protection";
import { prisma } from "@/lib/db";
const suggestionSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  author: z.string().optional(),
  isbn: z.string().optional(),
  type: z.enum(["BORROWED_ITEM", "SUGGESTION"]),
});

async function _POST(req: Request) {
  try {
    const session = await getServerAuth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const body = suggestionSchema.parse(json);

    const request = await prisma.itemRequest.create({
      data: {
        ...body,
        requestedById: session.user.id,
      },
    });

    return NextResponse.json(request, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 });
    }
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerAuth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const requests = await prisma.itemRequest.findMany({
      where: session.user.role === "ADMIN" ? {} : { requestedById: session.user.id },
      include: {
        requestedBy: {
          select: { name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(requests);
  } catch (error) {
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export const POST = withProtection(_POST, { scope: "write", limit: 60, windowSeconds: 60 });

// src/app/api/items/[id]/report/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";

import { getServerAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { withProtection } from "@/lib/security/protection";

const reportSchema = z.object({
  description: z.string().optional(),
});

async function _POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerAuth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const body = reportSchema.parse(json);

    const item = await prisma.item.findUnique({
      where: { id },
    });

    if (!item) {
      return new NextResponse("Item not found", { status: 404 });
    }

    const request = await prisma.itemRequest.create({
      data: {
        title: `MISSING: ${item.title}`,
        description: body.description
          ?? `User ${session.user.name || session.user.email} reported this item as missing.`,
        type: "BORROWED_ITEM",
        status: "PENDING",
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

export const POST = withProtection(_POST, { scope: "write", limit: 60, windowSeconds: 60 });

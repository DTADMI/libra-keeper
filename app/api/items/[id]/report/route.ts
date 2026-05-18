// src/app/api/items/[id]/report/route.ts
import { NextResponse } from "next/server";

import { getServerAuth } from "@/lib/auth-utils";
import { withProtection, RATE_LIMITS } from "@/lib/security/protection";
import { prisma } from "@/lib/db";
async function _POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerAuth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Create a special ItemRequest for a missing item
    const item = await prisma.item.findUnique({
      where: { id },
    });

    if (!item) {
      return new NextResponse("Item not found", { status: 404 });
    }

    const request = await prisma.itemRequest.create({
      data: {
        title: `MISSING: ${item.title}`,
        description: `User ${session.user.name || session.user.email} reported this item as missing.`,
        type: "BORROWED_ITEM", // Reusing this type or we could add 'REPORT'
        status: "PENDING",
        requestedById: session.user.id,
      },
    });

    // Optionally update item status to LOST?
    // Let's wait for admin approval.

    return NextResponse.json(request, { status: 201 });
  } catch (error) {
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export const POST = withProtection(_POST, { scope: "write", limit: 60, windowSeconds: 60 });

// src/app/api/suggestions/[id]/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";

import { getServerAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { RATE_LIMITS,withProtection } from "@/lib/security/protection";
const updateSuggestionSchema = z.object({
  status: z.enum(["PENDING", "PROCESSING", "COMPLETED", "REJECTED"]),
});

async function _PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerAuth();
    if (!session.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const { status } = updateSuggestionSchema.parse(json);

    const request = await prisma.itemRequest.update({
      where: { id },
      data: {
        status,
        processedById: session.user.id,
      },
    });

    return NextResponse.json(request);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 });
    }
    return new NextResponse("Internal server error", { status: 500 });
  }
}

async function _DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerAuth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const request = await prisma.itemRequest.findUnique({
      where: { id },
    });

    if (!request) {
      return new NextResponse("Not found", { status: 404 });
    }

    if (request.requestedById !== session.user.id && session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await prisma.itemRequest.delete({
      where: { id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export const PATCH = withProtection(_PATCH, { scope: "write", limit: 60, windowSeconds: 60 });

export const DELETE = withProtection(_DELETE, { scope: "write", limit: 60, windowSeconds: 60 });

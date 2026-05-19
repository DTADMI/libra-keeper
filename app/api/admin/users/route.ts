// src/app/api/admin/users/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";

import { getServerAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { withProtection } from "@/lib/security/protection";
const roleSchema = z.object({
  userId: z.string(),
  role: z.enum(["ADMIN", "USER"]),
});

async function _GET() {
  try {
    const session = await getServerAuth();
    if (!session.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    return new NextResponse("Internal server error", { status: 500 });
  }
}

async function _PATCH(req: Request) {
  try {
    const session = await getServerAuth();
    if (!session.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const { userId, role } = roleSchema.parse(json);

    if (userId === session.user.id) {
      return new NextResponse("Cannot change your own role", { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 });
    }
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export const GET = withProtection(_GET, { scope: "admin", limit: 200, windowSeconds: 60 });
export const PATCH = withProtection(_PATCH, { scope: "write", limit: 60, windowSeconds: 60 });

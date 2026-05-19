// src/app/api/admin/settings/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";

import { getServerAuth } from "@/lib/auth-utils";
import { prisma } from "@/lib/db";
import { withProtection } from "@/lib/security/protection";
const settingSchema = z.object({
  key: z.string().min(1),
  value: z.string(),
  type: z.enum(["STRING", "BOOLEAN", "NUMBER", "JSON"]),
});

async function _GET() {
  try {
    const session = await getServerAuth();
    if (!session.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const settings = await prisma.appSettings.findMany({
      orderBy: { key: "asc" },
    });

    return NextResponse.json(settings);
  } catch (error) {
    return new NextResponse("Internal server error", { status: 500 });
  }
}

async function _POST(req: Request) {
  try {
    const session = await getServerAuth();
    if (!session.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const { key, value, type } = settingSchema.parse(json);

    const setting = await prisma.appSettings.upsert({
      where: { key },
      update: { value, type, updatedBy: session.user.id },
      create: { key, value, type, updatedBy: session.user.id },
    });

    return NextResponse.json(setting);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.issues), { status: 422 });
    }
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export const GET = withProtection(_GET, { scope: "admin", limit: 200, windowSeconds: 60 });
export const POST = withProtection(_POST, { scope: "write", limit: 60, windowSeconds: 60 });

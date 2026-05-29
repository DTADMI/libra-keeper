// src/app/api/feature-flags/route.ts
import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { redis } from "@/lib/redis";
import { withProtection } from "@/lib/security/protection";

const CACHE_KEY = "feature-flags:all";
const CACHE_TTL = 30;

async function _GET() {
  try {
    const cached = await redis.get(CACHE_KEY);
    if (cached) {
      return NextResponse.json(JSON.parse(cached));
    }

    const flags = await prisma.featureFlag.findMany({
      orderBy: { name: "asc" },
    });

    await redis.set(CACHE_KEY, JSON.stringify(flags), { ex: CACHE_TTL });

    return NextResponse.json(flags);
  } catch (error) {
    logger.error("Error fetching feature flags:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export const GET = withProtection(_GET, { scope: "api", limit: 100, windowSeconds: 60 });
// src/app/api/health/route.ts
import { NextResponse } from "next/server"

import { prisma } from "@/lib/db"
import { redis } from "@/lib/redis"

export async function GET() {
  const checks: Record<string, string> = {}

  try {
    await prisma.$queryRawUnsafe("SELECT 1")
    checks["database"] = "ok"
  } catch {
    checks["database"] = "unavailable"
  }

  try {
    await redis.get("health-check")
    checks["redis"] = "ok"
  } catch {
    checks["redis"] = "unavailable"
  }

  checks["supabase_url"] = process.env.NEXT_PUBLIC_SUPABASE_URL
    ? "configured"
    : "missing"
  checks["supabase_anon_key"] = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ? "configured"
    : "missing"

  const allOk = Object.values(checks).every((v) => v === "ok" || v === "configured")

  return NextResponse.json(
    { status: allOk ? "healthy" : "degraded", checks },
    { status: allOk ? 200 : 503 },
  )
}

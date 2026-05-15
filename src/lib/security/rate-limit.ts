// lib/security/rate-limit.ts — Sliding window rate limiting via Redis ZSETs
//
// Design: fails open — if Redis is unavailable, requests are allowed.
// Algorithm: ZREMRANGEBYSCORE + ZCARD + ZADD + EXPIRE in atomic pipeline.
// Returns standard X-RateLimit-* and Retry-After headers.

import { NextResponse } from "next/server"
import { redis } from "@/lib/redis"

export interface RateLimitConfig {
  scope: string
  limit: number
  windowSeconds: number
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  limit: number
  retryAfter: number
}

export const RATE_LIMITS = {
  api: { scope: "api", limit: 100, windowSeconds: 60 },
  auth: { scope: "auth", limit: 10, windowSeconds: 60 },
  signup: { scope: "signup", limit: 5, windowSeconds: 300 },
  itemCreate: { scope: "item_create", limit: 10, windowSeconds: 3600 },
  admin: { scope: "admin", limit: 200, windowSeconds: 60 },
} as const satisfies Record<string, RateLimitConfig>

async function slidingWindow(
  config: RateLimitConfig,
  identifier: string,
): Promise<RateLimitResult> {
  const key = `ratelimit:${config.scope}:${identifier}`
  const now = Date.now()
  const windowStart = now - config.windowSeconds * 1000
  const member = `${now}:${Math.random().toString(36).slice(2)}`

  try {
    const pipe = redis.pipeline()
    pipe.zremrangebyscore(key, 0, windowStart)
    pipe.zcard(key)
    pipe.zadd(key, now, member)
    pipe.expire(key, config.windowSeconds + 1)
    const results = await pipe.exec()

    const currentCount = (results[1][1] as number) ?? 0

    const allowed = currentCount < config.limit
    const remaining = Math.max(0, config.limit - currentCount - (allowed ? 1 : 0))

    let retryAfter = 0
    if (!allowed) {
      // Approximate retry-after: window seconds remaining
      retryAfter = config.windowSeconds
    }

    return { allowed, remaining, limit: config.limit, retryAfter }
  } catch {
    // Fail open — rate limit check skipped if Redis is unavailable
    return { allowed: true, remaining: config.limit, limit: config.limit, retryAfter: 0 }
  }
}

function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")
  if (forwarded) return forwarded.split(",")[0].trim()

  const realIp = request.headers.get("x-real-ip")
  if (realIp) return realIp

  const vercelForwarded = request.headers.get("x-vercel-forwarded-for")
  if (vercelForwarded) return vercelForwarded.split(",")[0].trim()

  return "unknown"
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RouteHandler = (req: Request, context: any) => Promise<Response>

export function withRateLimit(
  config: RateLimitConfig,
  getIdentifier?: (req: Request) => string,
): (handler: RouteHandler) => RouteHandler {
  return (handler: RouteHandler): RouteHandler => {
    return async (req: Request, ctx) => {
      const identifier = getIdentifier ? getIdentifier(req) : getClientIP(req)
      const result = await slidingWindow(config, identifier)

      if (!result.allowed) {
        return new NextResponse("Too Many Requests", {
          status: 429,
          headers: {
            "X-RateLimit-Limit": String(result.limit),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Math.ceil(Date.now() / 1000) + result.retryAfter),
            "Retry-After": String(result.retryAfter),
          },
        })
      }

      const response = await handler(req, ctx)
      const headers = new Headers(response.headers)
      headers.set("X-RateLimit-Limit", String(result.limit))
      headers.set("X-RateLimit-Remaining", String(result.remaining))
      headers.set("X-RateLimit-Reset", String(Math.ceil(Date.now() / 1000) + config.windowSeconds))

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      })
    }
  }
}

export async function checkRateLimit(
  config: RateLimitConfig,
  identifier: string,
): Promise<RateLimitResult> {
  return slidingWindow(config, identifier)
}

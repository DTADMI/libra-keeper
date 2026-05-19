// lib/security/protection.ts — Unified rate limiting + CSRF wrapper
// Combines withRateLimit + withCsrf into a single HOF for route handlers.

import { NextResponse } from "next/server";

import { redis } from "@/lib/redis";
import { setCsrfCookie,validateCsrf } from "@/lib/security/csrf";

interface RateLimitConfig {
  scope: string;
  limit: number;
  windowSeconds: number;
}

const RATE_LIMITS = {
  api: { scope: "api", limit: 100, windowSeconds: 60 },
  auth: { scope: "auth", limit: 10, windowSeconds: 60 },
  signup: { scope: "signup", limit: 5, windowSeconds: 300 },
  itemCreate: { scope: "item_create", limit: 10, windowSeconds: 3600 },
  admin: { scope: "admin", limit: 200, windowSeconds: 60 },
  write: { scope: "write", limit: 60, windowSeconds: 60 },
} as const;

async function checkRateLimit(
  config: RateLimitConfig,
  identifier: string,
): Promise<{ allowed: boolean; remaining: number; limit: number; retryAfter: number }> {
  const key = `ratelimit:${config.scope}:${identifier}`;
  const now = Date.now();
  const windowStart = now - config.windowSeconds * 1000;
  const member = `${now}:${Math.random().toString(36).slice(2)}`;

  try {
    const pipe = redis.pipeline();
    pipe.zremrangebyscore(key, 0, windowStart);
    pipe.zcard(key);
    pipe.zadd(key, now, member);
    pipe.expire(key, config.windowSeconds + 1);
    const results = await pipe.exec();

    const count = (results[1][1] as number) ?? 0;
    const allowed = count < config.limit;
    const remaining = Math.max(0, config.limit - count - (allowed ? 1 : 0));

    return { allowed, remaining, limit: config.limit, retryAfter: allowed ? 0 : config.windowSeconds };
  } catch {
    return { allowed: true, remaining: config.limit, limit: config.limit, retryAfter: 0 };
  }
}

function getClientIP(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type RouteHandler = (req: Request, context: any) => Promise<Response>;

export function withProtection(
  handler: RouteHandler,
  config?: Partial<RateLimitConfig>,
): RouteHandler {
  const rateLimit = config?.scope
    ? ({ scope: config.scope, limit: config.limit ?? 100, windowSeconds: config.windowSeconds ?? 60 } as RateLimitConfig)
    : null;

  return async (req: Request, ctx) => {
    // CSRF check for mutations
    if (req.method !== "GET" && req.method !== "HEAD" && req.method !== "OPTIONS") {
      const valid = await validateCsrf(req);
      if (!valid) {
        return new NextResponse("CSRF token missing or invalid", { status: 403 });
      }
    }

    // Rate limiting
    if (rateLimit) {
      const identifier = getClientIP(req);
      const result = await checkRateLimit(rateLimit, identifier);

      if (!result.allowed) {
        return new NextResponse("Too Many Requests", {
          status: 429,
          headers: {
            "X-RateLimit-Limit": String(result.limit),
            "X-RateLimit-Remaining": "0",
            "Retry-After": String(result.retryAfter),
          },
        });
      }

      const response = await handler(req, ctx);
      response.headers.set("X-RateLimit-Limit", String(result.limit));
      response.headers.set("X-RateLimit-Remaining", String(result.remaining));
      return response;
    }

    return handler(req, ctx);
  };
}

export { RATE_LIMITS };

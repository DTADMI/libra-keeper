// lib/security/rate-limit.ts — Sliding window rate limiting
//
// PG is the default via pg-rate-limit.ts.
// Falls back to Redis (ioredis pipeline) when redis_rate_limit flag is enabled.
// Design: fails open — if rate limiter is unavailable, requests are allowed.
// Returns standard X-RateLimit-* and Retry-After headers.

import { NextResponse } from "next/server";

import { redis } from "@/lib/redis";
import { checkPgRateLimit } from "@/lib/security/pg-rate-limit";

let _redisRateLimit: boolean | null = null;
type SupabaseFeatureFlagQuery = {
  select: (columns: string) => SupabaseFeatureFlagQuery;
  eq: (column: string, value: unknown) => SupabaseFeatureFlagQuery;
  maybeSingle: () => Promise<{ data: { enabled: boolean } | null; error?: unknown }>;
};
type SupabaseFeatureFlagClient = {
  from: (table: "feature_flags") => SupabaseFeatureFlagQuery;
};

function featureFlagClient(client: unknown): SupabaseFeatureFlagClient {
  return client as SupabaseFeatureFlagClient;
}

async function shouldUseRedisRateLimit(): Promise<boolean> {
  if (_redisRateLimit !== null) {return _redisRateLimit;}
  if (process.env.REDIS_RATE_LIMIT === "true") { _redisRateLimit = true; return true; }
  try {
    const { createServerClient } = await import("@/lib/supabase/server");
    const supabase = await createServerClient();
    const { data } = await featureFlagClient(supabase).from("feature_flags").select("enabled").eq("name", "redis_rate_limit").maybeSingle();
    _redisRateLimit = data?.enabled === true;
  } catch { _redisRateLimit = false; }
  return _redisRateLimit;
}

export interface RateLimitConfig {
  scope: string;
  limit: number;
  windowSeconds: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  retryAfter: number;
}

export const RATE_LIMITS = {
  api: { scope: "api", limit: 100, windowSeconds: 60 },
  auth: { scope: "auth", limit: 10, windowSeconds: 60 },
  signup: { scope: "signup", limit: 5, windowSeconds: 300 },
  itemCreate: { scope: "item_create", limit: 10, windowSeconds: 3600 },
  admin: { scope: "admin", limit: 200, windowSeconds: 60 },
} as const satisfies Record<string, RateLimitConfig>;

async function slidingWindow(
  config: RateLimitConfig,
  identifier: string,
): Promise<RateLimitResult> {
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

    const currentCount = (results[1][1] as number) ?? 0;

    const allowed = currentCount < config.limit;
    const remaining = Math.max(0, config.limit - currentCount - (allowed ? 1 : 0));

    let retryAfter = 0;
    if (!allowed) {
      // Approximate retry-after: window seconds remaining
      retryAfter = config.windowSeconds;
    }

    return { allowed, remaining, limit: config.limit, retryAfter };
  } catch {
    // Fail open — rate limit check skipped if Redis is unavailable
    return { allowed: true, remaining: config.limit, limit: config.limit, retryAfter: 0 };
  }
}

async function pgSlidingWindow(
  config: RateLimitConfig,
  identifier: string,
): Promise<RateLimitResult> {
  try {
    const pgResult = await checkPgRateLimit(identifier, config.limit, config.windowSeconds, config.scope);
    return {
      allowed: pgResult.allowed,
      remaining: pgResult.remaining,
      limit: config.limit,
      retryAfter: pgResult.allowed ? 0 : config.windowSeconds,
    };
  } catch {
    return { allowed: true, remaining: config.limit, limit: config.limit, retryAfter: 0 };
  }
}

function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {return forwarded.split(",")[0].trim();}

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {return realIp;}

  const vercelForwarded = request.headers.get("x-vercel-forwarded-for");
  if (vercelForwarded) {return vercelForwarded.split(",")[0].trim();}

  return "unknown";
}

type RouteHandler = (req: Request, context: unknown) => Promise<Response>;

export function withRateLimit(
  config: RateLimitConfig,
  getIdentifier?: (req: Request) => string,
): (handler: RouteHandler) => RouteHandler {
  return (handler: RouteHandler): RouteHandler => {
    return async (req: Request, ctx) => {
      const identifier = getIdentifier ? getIdentifier(req) : getClientIP(req);

      // PG is the default
      let result: RateLimitResult;
      if (await shouldUseRedisRateLimit()) {
        result = await slidingWindow(config, identifier);
      } else {
        result = await pgSlidingWindow(config, identifier);
      }

      if (!result.allowed) {
        return new NextResponse("Too Many Requests", {
          status: 429,
          headers: {
            "X-RateLimit-Limit": String(result.limit),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Math.ceil(Date.now() / 1000) + result.retryAfter),
            "Retry-After": String(result.retryAfter),
          },
        });
      }

      const response = await handler(req, ctx);
      const headers = new Headers(response.headers);
      headers.set("X-RateLimit-Limit", String(result.limit));
      headers.set("X-RateLimit-Remaining", String(result.remaining));
      headers.set("X-RateLimit-Reset", String(Math.ceil(Date.now() / 1000) + config.windowSeconds));

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    };
  };
}

export async function checkRateLimit(
  config: RateLimitConfig,
  identifier: string,
): Promise<RateLimitResult> {
  // PG is the default
  if (await shouldUseRedisRateLimit()) {
    return slidingWindow(config, identifier);
  }
  return pgSlidingWindow(config, identifier);
}

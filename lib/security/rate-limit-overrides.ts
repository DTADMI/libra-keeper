// lib/security/rate-limit-overrides.ts
// Admin-managed per-scope rate limit overrides with Redis cache.

import "server-only";

import { prisma } from "@/lib/db";
import { redis } from "@/lib/redis";

interface RateLimitOverride {
  scope: string;
  limit: number;
  windowSeconds: number;
}

const CACHE_TTL = 60;
const CACHE_PREFIX = "rl-override:";

export async function getRateLimitOverrides(): Promise<Map<string, RateLimitOverride>> {
  const overrides = new Map<string, RateLimitOverride>();

  try {
    // Read from AppSettings — overrides stored as JSON in settings
    const settings = await prisma.appSettings.findMany({
      where: {
        key: { startsWith: "rate_limit_override:" },
        type: "JSON",
      },
    });

    for (const setting of settings) {
      const scope = setting.key.replace("rate_limit_override:", "");
      try {
        const override = JSON.parse(setting.value) as RateLimitOverride;
        overrides.set(scope, override);

        // Cache for next time
        await redis.set(`${CACHE_PREFIX}${scope}`, setting.value, { ex: CACHE_TTL });
        await redis.sadd(`${CACHE_PREFIX}keys`, scope);
        await redis.expire(`${CACHE_PREFIX}keys`, CACHE_TTL);
      } catch {
        // Skip malformed overrides
      }
    }
  } catch (error) {
    console.warn("Failed to load rate limit overrides from DB:", error);
  }

  return overrides;
}

export async function getOverride(scope: string): Promise<RateLimitOverride | null> {
  try {
    const cached = await redis.get(`${CACHE_PREFIX}${scope}`);
    if (cached) {return JSON.parse(cached) as RateLimitOverride;}
  } catch {
    // Cache miss
  }

  const overrides = await getRateLimitOverrides();
  return overrides.get(scope) ?? null;
}

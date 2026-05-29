// lib/settings.ts — App settings with Redis caching
// Feature flag logic consolidated into lib/feature-flags.ts (re-exported here for backward compat)

import "server-only";

import { prisma } from "@/lib/db";
import { redis } from "@/lib/redis";

// Re-export from the canonical feature-flags module
export {
  getAllFeatureFlags,
  invalidateFlagCache,
  isFeatureEnabled,
  isFeatureEnabledForUser,
} from "@/lib/feature-flags";

const SETTING_CACHE_PREFIX = "setting:";
const CACHE_TTL = 60;

export async function getSetting(
  key: string,
  defaultValue?: string,
): Promise<string | undefined> {
  try {
    const cached = await redis.get(`${SETTING_CACHE_PREFIX}${key}`);
    if (cached !== null) {return cached;}

    const setting = await prisma.appSettings.findUnique({ where: { key } });
    const value = setting?.value ?? defaultValue;
    if (value !== undefined) {
      await redis.set(`${SETTING_CACHE_PREFIX}${key}`, value, { ex: CACHE_TTL });
    }
    return value;
  } catch {
    return defaultValue;
  }
}

export async function invalidateSettingCache(key: string): Promise<void> {
  try {
    await redis.del(`${SETTING_CACHE_PREFIX}${key}`);
  } catch {
    /* silent */
  }
}

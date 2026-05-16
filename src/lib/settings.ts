// lib/settings.ts — Feature flags and app settings with Redis caching

import { prisma } from "@/lib/db";
import { redis } from "@/lib/redis";

const FF_CACHE_PREFIX = "ff:";
const SETTING_CACHE_PREFIX = "setting:";
const CACHE_TTL = 60;

export async function isFeatureEnabled(name: string): Promise<boolean> {
  try {
    const cached = await redis.get(`${FF_CACHE_PREFIX}${name}`);
    if (cached !== null) {
      return cached === "1";
    }

    const flag = await prisma.featureFlag.findUnique({
      where: { name },
    });

    const enabled = flag?.isEnabled ?? false;
    await redis.set(`${FF_CACHE_PREFIX}${name}`, enabled ? "1" : "0", { ex: CACHE_TTL });

    return enabled;
  } catch (error) {
    console.error(`Error checking feature flag ${name}:`, error);
    return false;
  }
}

export async function getSetting(key: string, defaultValue?: string): Promise<string | undefined> {
  try {
    const cached = await redis.get(`${SETTING_CACHE_PREFIX}${key}`);
    if (cached !== null) {
      return cached;
    }

    const setting = await prisma.appSettings.findUnique({
      where: { key },
    });

    const value = setting?.value ?? defaultValue;
    if (value !== undefined) {
      await redis.set(`${SETTING_CACHE_PREFIX}${key}`, value, { ex: CACHE_TTL });
    }

    return value;
  } catch (error) {
    console.error(`Error getting setting ${key}:`, error);
    return defaultValue;
  }
}

export async function invalidateFlagCache(name: string): Promise<void> {
  try {
    await redis.del(`${FF_CACHE_PREFIX}${name}`);
    await redis.del("feature-flags:all");
  } catch {
    // Silent — cache will expire naturally
  }
}

export async function invalidateSettingCache(key: string): Promise<void> {
  try {
    await redis.del(`${SETTING_CACHE_PREFIX}${key}`);
  } catch {
    // Silent
  }
}

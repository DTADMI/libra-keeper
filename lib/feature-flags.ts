// lib/feature-flags.ts — Enhanced feature flag system
// Types: boolean, percentage, user_list
// Storage: Redis (primary) → DB (fallback) → defaults
//
// Usage:
//   Server:  import { isFeatureEnabled } from "@/lib/feature-flags"
//   Client:  import { useFeatureFlag } from "@/hooks/use-feature-flags"

import { prisma } from "@/lib/db";
import { redis } from "@/lib/redis";

export type FlagType = "boolean" | "percentage" | "user_list";

export interface FeatureFlag {
  name: string;
  description?: string;
  type: FlagType;
  enabled: boolean;
  percentage?: number;
  userIds?: string[];
}

const CACHE_KEY = "feature-flags:all";
const CACHE_TTL = 30;

export const DEFAULT_FEATURE_FLAGS: FeatureFlag[] = [
  {
    name: "dark_mode",
    description: "Enable dark mode toggle",
    type: "boolean",
    enabled: true,
  },
  {
    name: "barcode_scanner",
    description: "Enable barcode/ISBN scanning for item entry",
    type: "boolean",
    enabled: true,
  },
  {
    name: "waitlist",
    description: "Enable waitlist for borrowed items",
    type: "boolean",
    enabled: true,
  },
  {
    name: "suggestions",
    description: "Enable item suggestion submissions",
    type: "boolean",
    enabled: true,
  },
  {
    name: "messaging",
    description: "Enable in-app messaging between users",
    type: "boolean",
    enabled: true,
  },
  {
    name: "activity_feed",
    description: "Enable activity feed on dashboard",
    type: "boolean",
    enabled: true,
  },
  {
    name: "calendar_view",
    description: "Enable calendar view for loans",
    type: "boolean",
    enabled: true,
  },
  {
    name: "data_export",
    description: "Enable data export for admins",
    type: "boolean",
    enabled: true,
  },
  {
    name: "ai_metadata_lookup",
    description: "Auto-populate item fields from ISBN lookup (experimental)",
    type: "percentage",
    enabled: false,
    percentage: 0,
  },
  {
    name: "full_text_search",
    description: "Enable full-text search via PostgreSQL tsvector",
    type: "boolean",
    enabled: true,
  },
  {
    name: "bulk_import",
    description: "Enable CSV/Goodreads bulk import",
    type: "boolean",
    enabled: true,
  },
  {
    name: "email_reminders",
    description: "Send automated due-date email reminders",
    type: "boolean",
    enabled: true,
  },
  {
    name: "public_collection",
    description: "Allow public (unauthenticated) browsing of the collection",
    type: "boolean",
    enabled: false,
  },
];

async function loadFlagsFromDB(): Promise<FeatureFlag[]> {
  const dbFlags = await prisma.featureFlag.findMany();
  return dbFlags.map((f) => ({
    name: f.name,
    description: f.description ?? undefined,
    type: "boolean" as FlagType,
    enabled: f.isEnabled,
  }));
}

async function getAllFlags(): Promise<FeatureFlag[]> {
  try {
    const cached = await redis.get(CACHE_KEY);
    if (cached) {
      const parsed: FeatureFlag[] = JSON.parse(cached);
      if (parsed.length > 0) {return parsed;}
    }
  } catch {
    /* cache miss */
  }

  try {
    const dbFlags = await loadFlagsFromDB();
    if (dbFlags.length > 0) {
      const merged = DEFAULT_FEATURE_FLAGS.map((d) => {
        const db = dbFlags.find((f) => f.name === d.name);
        return db ? { ...d, enabled: db.enabled } : d;
      });
      await redis.set(CACHE_KEY, JSON.stringify(merged), { ex: CACHE_TTL });
      return merged;
    }
  } catch {
    /* DB unavailable */
  }

  await redis.set(CACHE_KEY, JSON.stringify(DEFAULT_FEATURE_FLAGS), { ex: CACHE_TTL });
  return DEFAULT_FEATURE_FLAGS;
}

function evaluateFlag(flag: FeatureFlag, userId?: string): boolean {
  if (!flag.enabled) {return false;}

  switch (flag.type) {
    case "boolean":
      return true;
    case "percentage":
      return (flag.percentage ?? 0) >= 100;
    case "user_list":
      return userId ? (flag.userIds ?? []).includes(userId) : false;
    default:
      return false;
  }
}

export async function isFeatureEnabled(name: string, userId?: string): Promise<boolean> {
  const flags = await getAllFlags();
  const flag = flags.find((f) => f.name === name);
  if (!flag) {return false;}
  return evaluateFlag(flag, userId);
}

export async function isFeatureEnabledForUser(name: string, userId: string): Promise<boolean> {
  return isFeatureEnabled(name, userId);
}

export async function getAllFeatureFlags(): Promise<FeatureFlag[]> {
  return getAllFlags();
}

export async function invalidateFlagCache(name: string): Promise<void> {
  try {
    await redis.del(CACHE_KEY);
    await redis.del(`ff:${name}`);
  } catch {
    /* silent */
  }
}

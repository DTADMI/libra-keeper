import { redis } from "@/lib/redis";
import { createServerClient } from "@/lib/supabase/server";

const CACHE_DEFAULT_TTL = 300;

let _redisCacheEnabled: boolean | null = null;

type SupabaseTableQuery<T> = {
  select: (columns: string) => SupabaseTableQuery<T>;
  eq: (column: string, value: unknown) => SupabaseTableQuery<T>;
  gt: (column: string, value: unknown) => SupabaseTableQuery<T>;
  like: (column: string, value: unknown) => SupabaseTableQuery<T>;
  maybeSingle: () => Promise<{ data: T | null; error?: unknown }>;
  upsert: (values: Record<string, unknown>, options?: Record<string, unknown>) => PromiseLike<unknown>;
  delete: () => SupabaseTableQuery<T>;
};

type SupabaseTableClient = {
  from: <T>(table: string) => SupabaseTableQuery<T>;
};

type FeatureFlagRow = { enabled: boolean };
type AppCacheRow = { value: unknown };

function tableClient(client: unknown): SupabaseTableClient {
  return client as SupabaseTableClient;
}

async function shouldUseRedisCache(): Promise<boolean> {
  if (_redisCacheEnabled !== null) {return _redisCacheEnabled;}
  if (process.env.REDIS_CACHE === "true") { _redisCacheEnabled = true; return true; }
  try {
    const supabase = await createServerClient();
    const { data } = await tableClient(supabase).from<FeatureFlagRow>("feature_flags")
      .select("enabled").eq("name", "redis_cache").maybeSingle();
    _redisCacheEnabled = data?.enabled === true;
  } catch { _redisCacheEnabled = false; }
  return _redisCacheEnabled;
}

export async function pgGetCached<T>(key: string): Promise<T | null> {
  try {
    // L1: Redis (if enabled)
    if (redis && await shouldUseRedisCache()) {
      const cached = await redis.get(`cache:${key}`);
      if (cached !== null) {return JSON.parse(cached) as T;}
    }

    // L2: PostgreSQL (source of truth)
    const supabase = await createServerClient();
    const { data } = await tableClient(supabase).from<AppCacheRow>("app_cache")
      .select("value").eq("key", key)
      .gt("expires_at", new Date().toISOString()).maybeSingle();
    if (!data) {return null;}
    const result = data.value as T;

    // Warm L1
    if (redis && await shouldUseRedisCache()) {
      redis.set(`cache:${key}`, JSON.stringify(result), { ex: 30 }).catch(() => {});
    }

    return result;
  } catch { return null; }
}

export async function pgSetCached<T>(key: string, value: T, ttlSeconds = CACHE_DEFAULT_TTL): Promise<void> {
  try {
    const supabase = await createServerClient();
    await tableClient(supabase).from<AppCacheRow>("app_cache").upsert({
      key, value: JSON.parse(JSON.stringify(value)),
      expires_at: new Date(Date.now() + ttlSeconds * 1000).toISOString(),
    }, { onConflict: "key" });

    if (redis && await shouldUseRedisCache()) {
      redis.set(`cache:${key}`, JSON.stringify(value), { ex: Math.min(ttlSeconds, 60) }).catch(() => {});
    }
  } catch (err) { console.error("[pg-cache] set error:", err); }
}

export async function pgDeleteCached(key: string): Promise<void> {
  try {
    const supabase = await createServerClient();
    await tableClient(supabase).from<AppCacheRow>("app_cache").delete().eq("key", key);

    if (redis && await shouldUseRedisCache()) {
      redis.del(`cache:${key}`).catch(() => {});
    }
  } catch (err) { console.error("[pg-cache] delete error:", err); }
}

export async function pgInvalidatePattern(pattern: string): Promise<void> {
  try {
    const supabase = await createServerClient();
    await tableClient(supabase).from<AppCacheRow>("app_cache").delete().like("key", `${pattern}%`);
  } catch (err) { console.error("[pg-cache] invalidate error:", err); }
}

// lib/redis.ts — Multi-tier Redis adapter with memory fallback
//
// Architecture:
//   Production/Preview (VERCEL_ENV) → @upstash/redis via KV_REST_API_URL + KV_REST_API_TOKEN
//   Local development                → ioredis via REDIS_URL
//   Build phase / all-mode fallback   → in-memory Map
//
// All modes always available. Failures cascade to memory.

import { Redis } from "@upstash/redis";
import type { default as IoredisType } from "ioredis";

export interface RedisClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string, opts?: { ex?: number }): Promise<"OK" | null>;
  del(key: string): Promise<number>;
  incr(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<number>;
  zremrangebyscore(key: string, min: number, max: number): Promise<number>;
  zcard(key: string): Promise<number>;
  zadd(key: string, score: number, member: string): Promise<number>;
  sadd(key: string, member: string): Promise<number>;
  sismember(key: string, member: string): Promise<number>;
  srem(key: string, member: string): Promise<number>;
  scard(key: string): Promise<number>;
  pipeline(): Pipeline;
}

export interface Pipeline {
  zremrangebyscore(key: string, min: number, max: number): Pipeline;
  zcard(key: string): Pipeline;
  zadd(key: string, score: number, member: string): Pipeline;
  expire(key: string, seconds: number): Pipeline;
  exec(): Promise<Array<[Error | null, unknown]>>;
}

// ---------------------------------------------------------------------------
// MemoryRedis — In-memory Map fallback (build phase, safety net)
// ---------------------------------------------------------------------------

class MemoryPipeline implements Pipeline {
  private commands: Array<() => unknown> = [];

  constructor(private client: MemoryRedis) {}

  zremrangebyscore(key: string, min: number, max: number): Pipeline {
    this.commands.push(() => this.client.zremrangebyscore(key, min, max));
    return this;
  }
  zcard(key: string): Pipeline {
    this.commands.push(() => this.client.zcard(key));
    return this;
  }
  zadd(key: string, score: number, member: string): Pipeline {
    this.commands.push(() => this.client.zadd(key, score, member));
    return this;
  }
  expire(key: string, seconds: number): Pipeline {
    this.commands.push(() => this.client.expire(key, seconds));
    return this;
  }
  async exec(): Promise<Array<[Error | null, unknown]>> {
    const results: Array<[Error | null, unknown]> = [];
    for (const cmd of this.commands) {
      try {
        results.push([null, await cmd()]);
      } catch (e) {
        results.push([e as Error, null]);
      }
    }
    return results;
  }
}

class MemoryRedis implements RedisClient {
  private store = new Map<string, string>();
  private sets = new Map<string, Set<string>>();
  private sortedSets = new Map<string, Map<string, number>>();
  private expirations = new Map<string, number>();

  private isExpired(key: string): boolean {
    const expiry = this.expirations.get(key);
    return expiry !== undefined && expiry < Date.now();
  }

  private checkExpiry(key: string): void {
    if (this.isExpired(key)) {
      this.store.delete(key);
      this.sets.delete(key);
      this.sortedSets.delete(key);
      this.expirations.delete(key);
    }
  }

  async get(key: string): Promise<string | null> {
    this.checkExpiry(key);
    return this.store.get(key) ?? null;
  }

  async set(key: string, value: string, opts?: { ex?: number }): Promise<"OK" | null> {
    this.store.set(key, value);
    if (opts?.ex) {
      this.expirations.set(key, Date.now() + opts.ex * 1000);
    }
    return "OK";
  }

  async del(key: string): Promise<number> {
    this.store.delete(key);
    this.sets.delete(key);
    this.sortedSets.delete(key);
    this.expirations.delete(key);
    return 1;
  }

  async incr(key: string): Promise<number> {
    this.checkExpiry(key);
    const val = parseInt(this.store.get(key) ?? "0", 10) + 1;
    this.store.set(key, String(val));
    return val;
  }

  async expire(key: string, seconds: number): Promise<number> {
    this.expirations.set(key, Date.now() + seconds * 1000);
    return 1;
  }

  async zremrangebyscore(key: string, min: number, max: number): Promise<number> {
    this.checkExpiry(key);
    const zset = this.sortedSets.get(key);
    if (!zset) {return 0;}
    let removed = 0;
    for (const [member, score] of zset) {
      if (score >= min && score <= max) {
        zset.delete(member);
        removed++;
      }
    }
    return removed;
  }

  async zcard(key: string): Promise<number> {
    this.checkExpiry(key);
    return this.sortedSets.get(key)?.size ?? 0;
  }

  async zadd(key: string, score: number, member: string): Promise<number> {
    let zset = this.sortedSets.get(key);
    if (!zset) {
      zset = new Map();
      this.sortedSets.set(key, zset);
    }
    const existed = zset.has(member);
    zset.set(member, score);
    return existed ? 0 : 1;
  }

  async sadd(key: string, member: string): Promise<number> {
    this.checkExpiry(key);
    let set = this.sets.get(key);
    if (!set) {
      set = new Set();
      this.sets.set(key, set);
    }
    if (set.has(member)) {return 0;}
    set.add(member);
    return 1;
  }

  async sismember(key: string, member: string): Promise<number> {
    this.checkExpiry(key);
    return this.sets.get(key)?.has(member) ? 1 : 0;
  }

  async srem(key: string, member: string): Promise<number> {
    this.checkExpiry(key);
    const set = this.sets.get(key);
    if (!set) {return 0;}
    return set.delete(member) ? 1 : 0;
  }

  async scard(key: string): Promise<number> {
    this.checkExpiry(key);
    return this.sets.get(key)?.size ?? 0;
  }

  pipeline(): Pipeline {
    return new MemoryPipeline(this);
  }
}

// ---------------------------------------------------------------------------
// IoredisAdapter — Wraps ioredis for local development
// ---------------------------------------------------------------------------

class IoredisPipeline implements Pipeline {
  constructor(private pipe: ReturnType<IoredisType["pipeline"]>) {}

  zremrangebyscore(key: string, min: number, max: number): Pipeline {
    void this.pipe.zremrangebyscore(key, min, max);
    return this;
  }
  zcard(key: string): Pipeline {
    void this.pipe.zcard(key);
    return this;
  }
  zadd(key: string, score: number, member: string): Pipeline {
    void this.pipe.zadd(key, score, member);
    return this;
  }
  expire(key: string, seconds: number): Pipeline {
    void this.pipe.expire(key, seconds);
    return this;
  }
  async exec(): Promise<Array<[Error | null, unknown]>> {
    return this.pipe.exec() as unknown as Promise<Array<[Error | null, unknown]>>;
  }
}

class IoredisAdapter implements RedisClient {
  private client: IoredisType | null = null;
  private fallback = new MemoryRedis();

  constructor() {
    if (process.env.REDIS_URL) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const RedisConstructor = require("ioredis") as typeof import("ioredis").default;
        this.client = new RedisConstructor(process.env.REDIS_URL);
      } catch {
        this.client = null;
      }
    }
  }

  private c(): RedisClient {
    return this.client ? this : this.fallback;
  }

  async get(key: string): Promise<string | null> {
    if (!this.client) {return this.fallback.get(key);}
    try {
      return await this.client.get(key);
    } catch {
      return this.fallback.get(key);
    }
  }

  async set(key: string, value: string, opts?: { ex?: number }): Promise<"OK" | null> {
    if (!this.client) {return this.fallback.set(key, value, opts);}
    try {
      const result = opts?.ex
        ? await this.client.set(key, value, "EX", opts.ex)
        : await this.client.set(key, value);
      return result === "OK" ? "OK" : null;
    } catch {
      return this.fallback.set(key, value, opts);
    }
  }

  async del(key: string): Promise<number> {
    if (!this.client) {return this.fallback.del(key);}
    try {
      return await this.client.del(key);
    } catch {
      return this.fallback.del(key);
    }
  }

  async incr(key: string): Promise<number> {
    if (!this.client) {return this.fallback.incr(key);}
    try {
      return await this.client.incr(key);
    } catch {
      return this.fallback.incr(key);
    }
  }

  async expire(key: string, seconds: number): Promise<number> {
    if (!this.client) {return this.fallback.expire(key, seconds);}
    try {
      return await this.client.expire(key, seconds);
    } catch {
      return this.fallback.expire(key, seconds);
    }
  }

  async zremrangebyscore(key: string, min: number, max: number): Promise<number> {
    if (!this.client) {return this.fallback.zremrangebyscore(key, min, max);}
    try {
      return await this.client.zremrangebyscore(key, min, max);
    } catch {
      return this.fallback.zremrangebyscore(key, min, max);
    }
  }

  async zcard(key: string): Promise<number> {
    if (!this.client) {return this.fallback.zcard(key);}
    try {
      return await this.client.zcard(key);
    } catch {
      return this.fallback.zcard(key);
    }
  }

  async zadd(key: string, score: number, member: string): Promise<number> {
    if (!this.client) {return this.fallback.zadd(key, score, member);}
    try {
      return await this.client.zadd(key, score, member);
    } catch {
      return this.fallback.zadd(key, score, member);
    }
  }

  async sadd(key: string, member: string): Promise<number> {
    if (!this.client) {return this.fallback.sadd(key, member);}
    try {
      return await this.client.sadd(key, member);
    } catch {
      return this.fallback.sadd(key, member);
    }
  }

  async sismember(key: string, member: string): Promise<number> {
    if (!this.client) {return this.fallback.sismember(key, member);}
    try {
      return await this.client.sismember(key, member);
    } catch {
      return this.fallback.sismember(key, member);
    }
  }

  async srem(key: string, member: string): Promise<number> {
    if (!this.client) {return this.fallback.srem(key, member);}
    try {
      return await this.client.srem(key, member);
    } catch {
      return this.fallback.srem(key, member);
    }
  }

  async scard(key: string): Promise<number> {
    if (!this.client) {return this.fallback.scard(key);}
    try {
      return await this.client.scard(key);
    } catch {
      return this.fallback.scard(key);
    }
  }

  pipeline(): Pipeline {
    if (!this.client) {return this.fallback.pipeline();}
    try {
      return new IoredisPipeline(this.client.pipeline());
    } catch {
      return this.fallback.pipeline();
    }
  }
}

// ---------------------------------------------------------------------------
// UpstashRedisAdapter — Wraps @upstash/redis for production
// ---------------------------------------------------------------------------

class UpstashPipeline implements Pipeline {
  private commands: Array<() => Promise<unknown>> = [];

  constructor(private redis: Redis) {}

  zremrangebyscore(key: string, min: number, max: number): Pipeline {
    this.commands.push(() => this.redis.zremrangebyscore(key, min, max));
    return this;
  }
  zcard(key: string): Pipeline {
    this.commands.push(() => this.redis.zcard(key));
    return this;
  }
  zadd(key: string, score: number, member: string): Pipeline {
    this.commands.push(() => this.redis.zadd(key, { score, member }));
    return this;
  }
  expire(key: string, seconds: number): Pipeline {
    this.commands.push(() => this.redis.expire(key, seconds));
    return this;
  }
  async exec(): Promise<Array<[Error | null, unknown]>> {
    const results: Array<[Error | null, unknown]> = [];
    for (const cmd of this.commands) {
      try {
        results.push([null, await cmd()]);
      } catch (e) {
        results.push([e as Error, null]);
      }
    }
    return results;
  }
}

class UpstashRedisAdapter implements RedisClient {
  private redis: Redis;
  private fallback = new MemoryRedis();

  constructor(url: string, token: string) {
    this.redis = new Redis({ url, token, enableAutoPipelining: true });
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.redis.get<string>(key);
    } catch {
      return this.fallback.get(key);
    }
  }

  async set(key: string, value: string, opts?: { ex?: number }): Promise<"OK" | null> {
    try {
      const setOpts: Record<string, unknown> = {};
      if (opts?.ex) {setOpts.ex = opts.ex;}
      const result = await this.redis.set(key, value, setOpts as never);
      return result === "OK" ? "OK" : null;
    } catch {
      return this.fallback.set(key, value, opts);
    }
  }

  async del(key: string): Promise<number> {
    try {
      return await this.redis.del(key);
    } catch {
      return this.fallback.del(key);
    }
  }

  async incr(key: string): Promise<number> {
    try {
      return await this.redis.incr(key);
    } catch {
      return this.fallback.incr(key);
    }
  }

  async expire(key: string, seconds: number): Promise<number> {
    try {
      return await this.redis.expire(key, seconds);
    } catch {
      return this.fallback.expire(key, seconds);
    }
  }

  async zremrangebyscore(key: string, min: number, max: number): Promise<number> {
    try {
      return await this.redis.zremrangebyscore(key, min, max);
    } catch {
      return this.fallback.zremrangebyscore(key, min, max);
    }
  }

  async zcard(key: string): Promise<number> {
    try {
      return await this.redis.zcard(key);
    } catch {
      return this.fallback.zcard(key);
    }
  }

  async zadd(key: string, score: number, member: string): Promise<number> {
    try {
      const result = await this.redis.zadd(key, { score, member });
      return result ?? 0;
    } catch {
      return this.fallback.zadd(key, score, member);
    }
  }

  async sadd(key: string, member: string): Promise<number> {
    try {
      return await this.redis.sadd(key, member);
    } catch {
      return this.fallback.sadd(key, member);
    }
  }

  async sismember(key: string, member: string): Promise<number> {
    try {
      return await this.redis.sismember(key, member);
    } catch {
      return this.fallback.sismember(key, member);
    }
  }

  async srem(key: string, member: string): Promise<number> {
    try {
      return await this.redis.srem(key, member);
    } catch {
      return this.fallback.srem(key, member);
    }
  }

  async scard(key: string): Promise<number> {
    try {
      return await this.redis.scard(key);
    } catch {
      return this.fallback.scard(key);
    }
  }

  pipeline(): Pipeline {
    try {
      return new UpstashPipeline(this.redis);
    } catch {
      return this.fallback.pipeline();
    }
  }
}

// ---------------------------------------------------------------------------
// Auto-selector
// ---------------------------------------------------------------------------

function createRedisClient(): RedisClient {
  const kvUrl = process.env.KV_REST_API_URL;
  const kvToken = process.env.KV_REST_API_TOKEN;

  if (kvUrl && kvToken) {
    return new UpstashRedisAdapter(kvUrl, kvToken);
  }

  if (process.env.REDIS_URL) {
    return new IoredisAdapter();
  }

  return new MemoryRedis();
}

export const redis: RedisClient = createRedisClient();

let _pgRateLimit: boolean | null = null;
export async function shouldUsePgRateLimit(): Promise<boolean> {
  if (_pgRateLimit !== null) return _pgRateLimit;
  if (process.env.PG_RATE_LIMIT === "true") { _pgRateLimit = true; return true; }
  try {
    const { createServerClient } = await import("@/lib/supabase/server");
    const supabase = await createServerClient();
    const { data } = await (supabase as any).from("feature_flags").select("enabled").eq("name", "pg_rate_limit").maybeSingle();
    _pgRateLimit = data?.enabled === true;
  } catch { _pgRateLimit = false; }
  return _pgRateLimit;
}

jest.mock("@/lib/redis", () => ({
  redis: {
    pipeline: jest.fn().mockReturnValue({
      zremrangebyscore: jest.fn().mockReturnThis(),
      zcard: jest.fn().mockReturnThis(),
      zadd: jest.fn().mockReturnThis(),
      expire: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([
        [null, 0],
        [null, 5],
        [null, 1],
        [null, 1],
      ]),
    }),
    scard: jest.fn().mockResolvedValue(0),
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue("OK"),
    sadd: jest.fn().mockResolvedValue(1),
  },
}));

import { checkRateLimit, RATE_LIMITS, withRateLimit } from "@/lib/security/rate-limit";

describe("rate-limit", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("RATE_LIMITS", () => {
    test("has configured keys", () => {
      expect(RATE_LIMITS.api.limit).toBe(100);
      expect(RATE_LIMITS.auth.limit).toBe(10);
      expect(RATE_LIMITS.signup.limit).toBe(5);
      expect(RATE_LIMITS.itemCreate.limit).toBe(10);
      expect(RATE_LIMITS.admin.limit).toBe(200);
    });
  });

  describe("checkRateLimit", () => {
    test("returns allowed when under limit", async () => {
      const result = await checkRateLimit(
        { scope: "test", limit: 10, windowSeconds: 60 },
        "127.0.0.1",
      );
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(4);
      expect(result.limit).toBe(10);
    });

    test("returns not allowed when at limit", async () => {
      const { redis } = require("@/lib/redis");
      redis.pipeline.mockReturnValue({
        zremrangebyscore: jest.fn().mockReturnThis(),
        zcard: jest.fn().mockReturnThis(),
        zadd: jest.fn().mockReturnThis(),
        expire: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([
          [null, 0],
          [null, 10],
          [null, 1],
          [null, 1],
        ]),
      });

      const result = await checkRateLimit(
        { scope: "test", limit: 10, windowSeconds: 60 },
        "127.0.0.1",
      );
      expect(result.allowed).toBe(false);
      expect(result.retryAfter).toBe(60);
    });

    test("fails open on Redis error", async () => {
      const { redis } = require("@/lib/redis");
      redis.pipeline.mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error("Redis down")),
      });

      const result = await checkRateLimit(
        { scope: "test", limit: 10, windowSeconds: 60 },
        "127.0.0.1",
      );
      expect(result.allowed).toBe(true);
    });
  });

  describe("withRateLimit", () => {
    test("allows request under limit", async () => {
      const handler = jest.fn().mockResolvedValue(new Response("ok"));
      const wrapped = withRateLimit({ scope: "test", limit: 10, windowSeconds: 60 })(handler);
      const req = new Request("http://localhost/api/test");
      const ctx = { params: Promise.resolve({}) };
      const res = await wrapped(req, ctx);
      expect(res.status).toBe(200);
      expect(res.headers.get("X-RateLimit-Limit")).toBe("10");
    });

    test("blocks request over limit", async () => {
      const { redis } = require("@/lib/redis");
      redis.pipeline.mockReturnValue({
        zremrangebyscore: jest.fn().mockReturnThis(),
        zcard: jest.fn().mockReturnThis(),
        zadd: jest.fn().mockReturnThis(),
        expire: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([
          [null, 0],
          [null, 100],
          [null, 1],
          [null, 1],
        ]),
      });

      const handler = jest.fn();
      const wrapped = withRateLimit({ scope: "test", limit: 100, windowSeconds: 60 })(handler);
      const req = new Request("http://localhost/api/test");
      const ctx = { params: Promise.resolve({}) };
      const res = await wrapped(req, ctx);
      expect(res.status).toBe(429);
      expect(handler).not.toHaveBeenCalled();
    });

    test("uses custom identifier function", async () => {
      const handler = jest.fn().mockResolvedValue(new Response("ok"));
      const getIdentifier = jest.fn().mockReturnValue("custom-id");
      const wrapped = withRateLimit({ scope: "test", limit: 10, windowSeconds: 60 }, getIdentifier)(handler);
      const req = new Request("http://localhost/api/test");
      const ctx = { params: Promise.resolve({}) };
      await wrapped(req, ctx);
      expect(getIdentifier).toHaveBeenCalledWith(req);
    });
  });
});

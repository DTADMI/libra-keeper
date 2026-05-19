import { validateCsrf } from "@/lib/security/csrf";
import { RATE_LIMITS, withProtection } from "@/lib/security/protection";

jest.mock("@/lib/security/csrf", () => ({
  validateCsrf: jest.fn(),
}));

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
  },
}));

describe("withProtection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("RATE_LIMITS has expected keys", () => {
    expect(RATE_LIMITS).toHaveProperty("api");
    expect(RATE_LIMITS).toHaveProperty("auth");
    expect(RATE_LIMITS).toHaveProperty("signup");
    expect(RATE_LIMITS).toHaveProperty("itemCreate");
    expect(RATE_LIMITS).toHaveProperty("admin");
    expect(RATE_LIMITS).toHaveProperty("write");
  });

  test("allows GET requests without CSRF check", async () => {
    const handler = jest.fn().mockResolvedValue(new Response("ok"));
    const wrapped = withProtection(handler, { scope: "api", limit: 100, windowSeconds: 60 });
    const req = new Request("http://localhost/api/test", { method: "GET" });
    const ctx = { params: Promise.resolve({}) };
    const res = await wrapped(req, ctx);
    expect(res.status).toBe(200);
    expect(validateCsrf).not.toHaveBeenCalled();
    expect(handler).toHaveBeenCalled();
  });

  test("blocks POST with invalid CSRF", async () => {
    (validateCsrf as jest.Mock).mockResolvedValue(false);
    const handler = jest.fn();
    const wrapped = withProtection(handler, { scope: "api", limit: 100, windowSeconds: 60 });
    const req = new Request("http://localhost/api/test", { method: "POST" });
    const ctx = { params: Promise.resolve({}) };
    const res = await wrapped(req, ctx);
    expect(res.status).toBe(403);
    expect(handler).not.toHaveBeenCalled();
  });

  test("allows POST with valid CSRF and adds rate limit headers", async () => {
    (validateCsrf as jest.Mock).mockResolvedValue(true);
    const handler = jest.fn().mockResolvedValue(new Response("ok"));
    const wrapped = withProtection(handler, { scope: "api", limit: 100, windowSeconds: 60 });
    const req = new Request("http://localhost/api/test", { method: "POST" });
    const ctx = { params: Promise.resolve({}) };
    const res = await wrapped(req, ctx);
    expect(res.status).toBe(200);
    expect(res.headers.get("X-RateLimit-Limit")).toBe("100");
    expect(res.headers.get("X-RateLimit-Remaining")).toBeDefined();
  });

  test("blocks request when rate limit exceeded", async () => {
    const { redis } = require("@/lib/redis");
    redis.pipeline.mockReturnValue({
      zremrangebyscore: jest.fn().mockReturnThis(),
      zcard: jest.fn().mockReturnThis(),
      zadd: jest.fn().mockReturnThis(),
      expire: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([
        [null, 0],
        [null, 100], // count = 100, at limit
        [null, 1],
        [null, 1],
      ]),
    });
    (validateCsrf as jest.Mock).mockResolvedValue(true);
    const handler = jest.fn();
    const wrapped = withProtection(handler, { scope: "api", limit: 100, windowSeconds: 60 });
    const req = new Request("http://localhost/api/test", { method: "POST" });
    const ctx = { params: Promise.resolve({}) };
    const res = await wrapped(req, ctx);
    expect(res.status).toBe(429);
    expect(res.headers.get("Retry-After")).toBe("60");
    expect(handler).not.toHaveBeenCalled();
  });

  test("passes through without rate limit config", async () => {
    const handler = jest.fn().mockResolvedValue(new Response("ok"));
    const wrapped = withProtection(handler);
    const req = new Request("http://localhost/api/test", { method: "POST" });
    const ctx = { params: Promise.resolve({}) };
    // CSRF still checked, rate limit skipped
    (validateCsrf as jest.Mock).mockResolvedValue(true);
    const res = await wrapped(req, ctx);
    expect(res.status).toBe(200);
    expect(res.headers.get("X-RateLimit-Limit")).toBeNull();
  });
});

jest.mock("@/lib/db", () => ({
  prisma: {
    appSettings: {
      findMany: jest.fn(),
    },
  },
}));

jest.mock("@/lib/redis", () => ({
  redis: {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue("OK"),
    scard: jest.fn().mockResolvedValue(0),
    sadd: jest.fn().mockResolvedValue(1),
  },
}));

import { getRateLimitOverrides } from "@/lib/security/rate-limit-overrides";

describe("rate-limit-overrides", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns empty map when no overrides exist", async () => {
    const overrides = await getRateLimitOverrides();
    expect(overrides.size).toBe(0);
  });

  test("returns empty map on Redis error", async () => {
    const { redis } = require("@/lib/redis");
    redis.scard.mockRejectedValue(new Error("Redis down"));
    const overrides = await getRateLimitOverrides();
    expect(overrides.size).toBe(0);
  });
});

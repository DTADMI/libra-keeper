// src/__tests__/api-routes.test.ts
// Smoke tests for critical API routes
import { GET as healthGet } from "@/app/api/health/route";
import { GET as featureFlagsGet } from "@/app/api/feature-flags/route";
import { GET as activityGet } from "@/app/api/activity/route";

jest.mock("@/lib/security/protection", () => ({
  withProtection: (handler: Function) => handler,
  RATE_LIMITS: {},
}));

jest.mock("@/lib/db", () => ({
  prisma: {
    $queryRawUnsafe: jest.fn().mockResolvedValue([{ 1: 1 }]),
    featureFlag: { findMany: jest.fn().mockResolvedValue([]) },
    loan: { findMany: jest.fn().mockResolvedValue([]) },
    comment: { findMany: jest.fn().mockResolvedValue([]) },
    itemRequest: { findMany: jest.fn().mockResolvedValue([]) },
  },
}));

jest.mock("@/lib/redis", () => ({
  redis: {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue("OK"),
    pipeline: jest.fn().mockReturnValue({
      zremrangebyscore: jest.fn().mockReturnThis(),
      zcard: jest.fn().mockReturnThis(),
      zadd: jest.fn().mockReturnThis(),
      expire: jest.fn().mockReturnThis(),
      exec: jest.fn().mockResolvedValue([[null, 0], [null, 0], [null, 1]]),
    }),
  },
}));

jest.mock("@/lib/auth-utils", () => ({
  getServerAuth: jest.fn().mockResolvedValue({ user: { id: "user-1", role: "USER" } }),
}));

describe("API Route Smoke Tests", () => {
  beforeEach(() => jest.clearAllMocks());

  const ctx = { params: Promise.resolve({}) };

  test("GET /api/health returns status", async () => {
    const req = new Request("http://localhost/api/health");
    const response = await healthGet(req, ctx);
    const body = await response.json();
    expect(body).toHaveProperty("status");
    expect(body).toHaveProperty("checks");
    expect(body.checks).toHaveProperty("database");
  });

  test("GET /api/feature-flags returns array", async () => {
    const req = new Request("http://localhost/api/feature-flags");
    const response = await featureFlagsGet(req, ctx);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
  });

  test("GET /api/activity returns array", async () => {
    const req = new Request("http://localhost/api/activity");
    const response = await activityGet(req, ctx);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBe(true);
  });
});

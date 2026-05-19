jest.mock("@/lib/db", () => ({
  prisma: {
    featureFlag: {
      findMany: jest.fn().mockResolvedValue([]),
      findUnique: jest.fn(),
    },
  },
}));

jest.mock("@/lib/redis", () => ({
  redis: {
    get: jest.fn().mockResolvedValue(null),
    set: jest.fn().mockResolvedValue("OK"),
    del: jest.fn().mockResolvedValue(1),
  },
}));

import {
  getAllFeatureFlags,
  invalidateFlagCache,
  isFeatureEnabled,
  isFeatureEnabledForUser,
} from "@/lib/feature-flags";

describe("feature-flags", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("isFeatureEnabled", () => {
    test("returns false for unknown flag", async () => {
      const result = await isFeatureEnabled("nonexistent-flag");
      expect(result).toBe(false);
    });
  });

  describe("isFeatureEnabledForUser", () => {
    test("returns false for unknown flag", async () => {
      const result = await isFeatureEnabledForUser("nonexistent-flag", "user-1");
      expect(result).toBe(false);
    });
  });

  describe("getAllFeatureFlags", () => {
    test("returns array", async () => {
      const flags = await getAllFeatureFlags();
      expect(Array.isArray(flags)).toBe(true);
    });
  });

  describe("invalidateFlagCache", () => {
    test("resolves without error", async () => {
      await expect(invalidateFlagCache("test-flag")).resolves.toBeUndefined();
    });
  });
});

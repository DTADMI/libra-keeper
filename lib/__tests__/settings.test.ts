jest.mock("@/lib/db", () => ({
  prisma: {
    appSettings: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock("@/lib/redis", () => ({
  redis: {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
  },
}));

jest.mock("@/lib/feature-flags", () => ({
  isFeatureEnabled: jest.fn().mockResolvedValue(true),
  isFeatureEnabledForUser: jest.fn().mockResolvedValue(true),
  getAllFeatureFlags: jest.fn().mockResolvedValue([]),
  invalidateFlagCache: jest.fn(),
}));

import { getSetting, invalidateSettingCache } from "@/lib/settings";
import { redis } from "@/lib/redis";
import { prisma } from "@/lib/db";

const r = redis as unknown as { get: jest.Mock; set: jest.Mock; del: jest.Mock };
const p = prisma as unknown as { appSettings: { findUnique: jest.Mock } };

describe("settings", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getSetting", () => {
    test("returns cached value when available", async () => {
      r.get.mockResolvedValue("cached-value");
      const value = await getSetting("test-key");
      expect(value).toBe("cached-value");
      expect(p.appSettings.findUnique).not.toHaveBeenCalled();
    });

    test("fetches from DB when not cached", async () => {
      r.get.mockResolvedValue(null);
      p.appSettings.findUnique.mockResolvedValue({ key: "test-key", value: "db-value" });
      const value = await getSetting("test-key");
      expect(value).toBe("db-value");
      expect(r.set).toHaveBeenCalledWith("setting:test-key", "db-value", { ex: 60 });
    });

    test("returns default value when not in DB", async () => {
      r.get.mockResolvedValue(null);
      p.appSettings.findUnique.mockResolvedValue(null);
      const value = await getSetting("test-key", "default");
      expect(value).toBe("default");
    });

    test("returns default value on error", async () => {
      r.get.mockRejectedValue(new Error("Redis error"));
      const value = await getSetting("test-key", "fallback");
      expect(value).toBe("fallback");
    });
  });

  describe("invalidateSettingCache", () => {
    test("deletes cache key", async () => {
      await invalidateSettingCache("test-key");
      expect(r.del).toHaveBeenCalledWith("setting:test-key");
    });

    test("silently handles errors", async () => {
      r.del.mockRejectedValue(new Error("Redis error"));
      await expect(invalidateSettingCache("test-key")).resolves.toBeUndefined();
    });
  });
});

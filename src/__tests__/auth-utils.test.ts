// src/__tests__/auth-utils.test.ts
// Mock authOptions before importing lib/auth-utils
jest.mock("@/lib/auth", () => ({
  authOptions: {},
}));

import { getServerSession } from "next-auth"

import { getCurrentUser, requireAdmin, requireAuth } from "@/lib/auth-utils"

// Mock next-auth
jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

describe("auth-utils", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  });

  describe("getCurrentUser", () => {
    it("should return user if session exists", async () => {
      const mockUser = { id: "1", name: "Test User" };
      (getServerSession as jest.Mock).mockResolvedValue({ user: mockUser })

      const user = await getCurrentUser()
      expect(user).toEqual(mockUser)
    });

    it("should return undefined if no session exists", async () => {
      (getServerSession as jest.Mock).mockResolvedValue(null)

      const user = await getCurrentUser()
      expect(user).toBeUndefined()
    });
  });

  describe("requireAuth", () => {
    it("should return user if authenticated", async () => {
      const mockUser = { id: "1", name: "Test User" };
      (getServerSession as jest.Mock).mockResolvedValue({ user: mockUser })

      const user = await requireAuth()
      expect(user).toEqual(mockUser)
    });

    it("should throw error if not authenticated", async () => {
      (getServerSession as jest.Mock).mockResolvedValue(null)

      await expect(requireAuth()).rejects.toThrow("Not authenticated")
    });
  });

  describe("requireAdmin", () => {
    it("should return user if admin", async () => {
      const mockUser = { id: "1", name: "Admin", role: "ADMIN" };
      (getServerSession as jest.Mock).mockResolvedValue({ user: mockUser })

      const user = await requireAdmin()
      expect(user).toEqual(mockUser)
    });

    it("should throw error if not admin", async () => {
      const mockUser = { id: "1", name: "User", role: "USER" };
      (getServerSession as jest.Mock).mockResolvedValue({ user: mockUser })

      await expect(requireAdmin()).rejects.toThrow("Not authorized")
    });
  });
});

// Auth utility tests — unit tests for requireAuth/requireAdmin wrappers

jest.mock("@/lib/supabase/server", () => ({
  createServerClient: jest.fn(),
}))

import { createServerClient } from "@/lib/supabase/server"
import { requireAuth, requireAdmin } from "@/lib/auth-utils"

describe("auth-utils", () => {
  beforeEach(() => {
    jest.clearAllMocks()
  });

  function mockAuth(user: { id: string; email: string; name: string | null; role: string; image: string | null } | null) {
    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: user ? {
            user: {
              id: user.id,
              email: user.email,
              user_metadata: { name: user.name, avatar_url: user.image },
            },
          } : { user: null },
        }),
      },
      from: jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            maybeSingle: jest.fn().mockResolvedValue({
              data: user ? { role: user.role } : null,
            }),
          }),
        }),
      }),
    }
    ;(createServerClient as jest.Mock).mockResolvedValue(mockSupabase)
  }

  describe("requireAuth", () => {
    it("should return user if authenticated", async () => {
      const mockUser = { id: "1", email: "test@test.com", name: "Test User", role: "USER", image: null }
      mockAuth(mockUser)

      const user = await requireAuth()
      expect(user).toEqual(mockUser)
    });

    it("should throw error if not authenticated", async () => {
      mockAuth(null)

      await expect(requireAuth()).rejects.toThrow("Not authenticated")
    });
  });

  describe("requireAdmin", () => {
    it("should return user if admin", async () => {
      const mockUser = { id: "1", email: "admin@test.com", name: "Admin", role: "ADMIN", image: null }
      mockAuth(mockUser)

      const user = await requireAdmin()
      expect(user).toEqual(mockUser)
    });

    it("should throw error if not admin", async () => {
      const mockUser = { id: "1", email: "user@test.com", name: "User", role: "USER", image: null }
      mockAuth(mockUser)

      await expect(requireAdmin()).rejects.toThrow("Not authorized")
    });
  });
});

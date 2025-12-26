// src/__tests__/auth.test.ts
jest.mock("next-auth/providers/credentials", () => {
  return jest.fn((options) => ({
    id: "credentials",
    name: "Credentials",
    type: "credentials",
    authorize: options.authorize,
  }))
})

jest.mock("next-auth/providers/google", () => {
  return jest.fn(() => ({
    id: "google",
    name: "Google",
    type: "oauth",
  }))
})

jest.mock("@auth/prisma-adapter", () => ({
  PrismaAdapter: jest.fn(),
}))

jest.mock("../lib/db", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}))

import { prisma } from "../lib/db"
import { authOptions } from "../lib/auth"
import { compare } from "bcryptjs"

jest.mock("bcryptjs", () => ({
  compare: jest.fn(),
}))

describe("authOptions", () => {
  describe("authorize", () => {
    it("should throw error if email or password missing", async () => {
      const provider = authOptions.providers.find(p => p.id === "credentials") as any
      const authorize = provider.authorize

      await expect(authorize({
        email: "",
        password: "",
      }, {} as any)).rejects.toThrow("Email and password are required")
      await expect(authorize(null, {} as any)).rejects.toThrow("Email and password are required")
    })

    it("should throw error if user not found", async () => {
      const provider = authOptions.providers.find(p => p.id === "credentials") as any
      const authorize = provider.authorize;
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null)

      await expect(authorize({
        email: "test@example.com",
        password: "password",
      }, {} as any)).rejects.toThrow("No user found with this email")
    })

    it("should throw error if user has no password", async () => {
      const provider = authOptions.providers.find(p => p.id === "credentials") as any
      const authorize = provider.authorize;
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: "1",
        email: "test@example.com",
        password: null,
      } as any)

      await expect(authorize({
        email: "test@example.com",
        password: "password",
      }, {} as any)).rejects.toThrow("No user found with this email")
    })

    it("should throw error if password invalid", async () => {
      const provider = authOptions.providers.find(p => p.id === "credentials") as any
      const authorize = provider.authorize;
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: "1",
        email: "test@example.com",
        password: "hashed",
      } as any);
      (compare as jest.Mock).mockResolvedValue(false)

      await expect(authorize({
        email: "test@example.com",
        password: "wrong",
      }, {} as any)).rejects.toThrow("Invalid password")
    })

    it("should return user object if credentials are valid", async () => {
      const provider = authOptions.providers.find(p => p.id === "credentials") as any
      const authorize = provider.authorize
      const mockUser = { id: "1", email: "test@example.com", password: "hashed", name: "Test User", role: "USER" };
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser as any);
      (compare as jest.Mock).mockResolvedValue(true)

      const user = await authorize({ email: "test@example.com", password: "password" }, {} as any)
      expect(user).toEqual({
        id: "1",
        email: "test@example.com",
        name: "Test User",
        role: "USER",
      })
    })
  })

  describe("callbacks", () => {
    it("session callback should add id and role to session user", async () => {
      const session = { user: { name: "Test" } } as any
      const token = { id: "1", role: "ADMIN" } as any
      const result = await (authOptions.callbacks as any).session({ session, token })
      expect(result.user.id).toBe("1")
      expect(result.user.role).toBe("ADMIN")
    })

    it("jwt callback should add id and role to token", async () => {
      const token = {} as any
      const user = { id: "1", role: "ADMIN" } as any
      const result = await (authOptions.callbacks as any).jwt({ token, user })
      expect(result.id).toBe("1")
      expect(result.role).toBe("ADMIN")
    })
  })
})

import { randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getCsrfHeader, setCsrfCookie, validateCsrf, withCsrf } from "@/lib/security/csrf";

jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}));

// Do NOT mock next/server — csrf.ts uses new NextResponse which needs the real class

describe("csrf", () => {
  let mockCookieStore: { set: jest.Mock; get: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();
    mockCookieStore = {
      set: jest.fn(),
      get: jest.fn().mockReturnValue(undefined),
    };
    (cookies as jest.Mock).mockResolvedValue(mockCookieStore);
  });

  describe("setCsrfCookie", () => {
    test("generates a 64-char hex token and sets cookie", async () => {
      const token = await setCsrfCookie();
      expect(token).toHaveLength(64);
      expect(/^[0-9a-f]+$/.test(token)).toBe(true);
      expect(mockCookieStore.set).toHaveBeenCalledWith(
        "csrf-token",
        token,
        expect.objectContaining({
          httpOnly: false,
          sameSite: "strict",
          path: "/",
          maxAge: 3600,
        }),
      );
    });
  });

  describe("validateCsrf", () => {
    test("returns false if cookie token missing", async () => {
      mockCookieStore.get.mockReturnValue(undefined);
      const req = new Request("http://localhost/api/test", {
        headers: { "x-csrf-token": "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890" },
        method: "POST",
      });
      const valid = await validateCsrf(req);
      expect(valid).toBe(false);
    });

    test("returns false if header token missing", async () => {
      mockCookieStore.get.mockReturnValue({ value: "abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890" });
      const req = new Request("http://localhost/api/test", { method: "POST" });
      const valid = await validateCsrf(req);
      expect(valid).toBe(false);
    });

    test("returns false if token length is wrong", async () => {
      mockCookieStore.get.mockReturnValue({ value: "short" });
      const req = new Request("http://localhost/api/test", {
        headers: { "x-csrf-token": "short" },
        method: "POST",
      });
      const valid = await validateCsrf(req);
      expect(valid).toBe(false);
    });

    test("returns true for matching tokens", async () => {
      const token = randomBytes(32).toString("hex");
      mockCookieStore.get.mockReturnValue({ value: token });
      const req = new Request("http://localhost/api/test", {
        headers: { "x-csrf-token": token },
        method: "POST",
      });
      const valid = await validateCsrf(req);
      expect(valid).toBe(true);
    });

    test("returns false for non-matching tokens", async () => {
      const token = randomBytes(32).toString("hex");
      const otherToken = randomBytes(32).toString("hex");
      mockCookieStore.get.mockReturnValue({ value: token });
      const req = new Request("http://localhost/api/test", {
        headers: { "x-csrf-token": otherToken },
        method: "POST",
      });
      const valid = await validateCsrf(req);
      expect(valid).toBe(false);
    });
  });

  describe("getCsrfHeader", () => {
    test("returns existing token from cookie", async () => {
      const existingToken = randomBytes(32).toString("hex");
      mockCookieStore.get.mockReturnValue({ value: existingToken });
      const header = await getCsrfHeader();
      expect(header).toEqual({ "x-csrf-token": existingToken });
      expect(mockCookieStore.set).not.toHaveBeenCalled();
    });

    test("generates new token if none exists", async () => {
      mockCookieStore.get.mockReturnValue(undefined);
      const header = await getCsrfHeader();
      expect(header).toHaveProperty("x-csrf-token");
      expect(header["x-csrf-token"]).toHaveLength(64);
      expect(mockCookieStore.set).toHaveBeenCalled();
    });
  });

  describe("withCsrf", () => {
    test("allows GET requests without CSRF", async () => {
      const handler = jest.fn().mockResolvedValue(new Response("ok"));
      const wrapped = withCsrf(handler);
      const req = new Request("http://localhost/api/test", { method: "GET" });
      const ctx = { params: Promise.resolve({}) };
      const res = await wrapped(req, ctx);
      expect(res.status).toBe(200);
      expect(handler).toHaveBeenCalledWith(req, ctx);
    });

    test("allows HEAD requests without CSRF", async () => {
      const handler = jest.fn().mockResolvedValue(new Response("ok"));
      const wrapped = withCsrf(handler);
      const req = new Request("http://localhost/api/test", { method: "HEAD" });
      const ctx = { params: Promise.resolve({}) };
      const res = await wrapped(req, ctx);
      expect(res.status).toBe(200);
    });

    test("allows OPTIONS requests without CSRF", async () => {
      const handler = jest.fn().mockResolvedValue(new Response("ok"));
      const wrapped = withCsrf(handler);
      const req = new Request("http://localhost/api/test", { method: "OPTIONS" });
      const ctx = { params: Promise.resolve({}) };
      const res = await wrapped(req, ctx);
      expect(res.status).toBe(200);
    });

    test("blocks POST without valid CSRF", async () => {
      const handler = jest.fn();
      const wrapped = withCsrf(handler);
      const req = new Request("http://localhost/api/test", { method: "POST" });
      const ctx = { params: Promise.resolve({}) };
      const res = await wrapped(req, ctx);
      expect(res.status).toBe(403);
      expect(handler).not.toHaveBeenCalled();
    });

    test("passes POST with valid CSRF", async () => {
      const handler = jest.fn().mockResolvedValue(new Response("ok"));
      const token = randomBytes(32).toString("hex");
      mockCookieStore.get.mockReturnValue({ value: token });
      const wrapped = withCsrf(handler);
      const req = new Request("http://localhost/api/test", {
        method: "POST",
        headers: { "x-csrf-token": token },
      });
      const ctx = { params: Promise.resolve({}) };
      const res = await wrapped(req, ctx);
      expect(res.status).toBe(200);
      expect(handler).toHaveBeenCalledWith(req, ctx);
    });
  });
});

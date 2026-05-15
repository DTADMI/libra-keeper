// lib/security/csrf.ts — CSRF token generation and validation
// Double-submit cookie pattern for API mutation endpoints.

import { createHash, randomBytes } from "crypto"
import { cookies } from "next/headers"

const CSRF_COOKIE = "csrf-token"
const CSRF_HEADER = "x-csrf-token"
const TOKEN_LENGTH = 32

function generateToken(): string {
  return randomBytes(TOKEN_LENGTH).toString("hex")
}

export async function setCsrfCookie(): Promise<string> {
  const token = generateToken()
  const cookieStore = await cookies()
  cookieStore.set(CSRF_COOKIE, token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 3600,
  })
  return token
}

export async function validateCsrf(request: Request): Promise<boolean> {
  const cookieStore = await cookies()
  const cookieToken = cookieStore.get(CSRF_COOKIE)?.value
  const headerToken = request.headers.get(CSRF_HEADER)

  if (!cookieToken || !headerToken) return false
  if (cookieToken.length !== TOKEN_LENGTH * 2) return false

  return cookieToken === headerToken
}

export async function getCsrfHeader(): Promise<Record<string, string>> {
  const cookieStore = await cookies()
  let token = cookieStore.get(CSRF_COOKIE)?.value

  if (!token) {
    token = await setCsrfCookie()
  }

  return { [CSRF_HEADER]: token }
}

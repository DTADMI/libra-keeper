import { NextResponse, type NextRequest } from "next/server"

import { createMiddlewareClient } from "@/lib/supabase/middleware"
import { RATE_LIMITS, checkRateLimit } from "@/lib/security/rate-limit"

const protectedPaths = ["/dashboard", "/admin", "/items", "/loans", "/calendar", "/messages", "/profile", "/suggestions"]
const authPaths = ["/auth/signin", "/auth/register"]

export async function proxy(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createMiddlewareClient(request, response)

  const url = new URL(request.url)
  const path = url.pathname

  const isProtected = protectedPaths.some((p) => path.startsWith(p))
  const isAuthPage = authPaths.some((p) => path.startsWith(p))

  if (isProtected || isAuthPage) {
    const { data } = await supabase.auth.getUser()

    if (isProtected && !data.user) {
      const signInUrl = new URL("/auth/signin", request.url)
      signInUrl.searchParams.set("redirect", path)
      return NextResponse.redirect(signInUrl)
    }

    if (isAuthPage && data.user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .maybeSingle()

      const dest = profile?.role === "ADMIN" ? "/dashboard" : "/dashboard"
      return NextResponse.redirect(new URL(dest, request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    "/((?!api|_next|_vercel|static|public|favicon\\.ico|.*\\..*).*)",
  ],
}

import { type NextRequest, NextResponse } from "next/server";

import { createMiddlewareClient } from "@/lib/supabase/middleware";

const protectedPaths = [
  "/dashboard", "/admin", "/items", "/loans",
  "/calendar", "/messages", "/profile", "/suggestions",
];
const authPaths = ["/auth/signin", "/auth/register"];

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createMiddlewareClient(request, response);

  const url = new URL(request.url);
  const path = url.pathname;

  const isProtected = protectedPaths.some((p) => path.startsWith(p));
  const isAuthPage = authPaths.some((p) => path.startsWith(p));

  if (isProtected || isAuthPage) {
    const { data } = await supabase.auth.getUser();

    if (isProtected && !data.user) {
      const signInUrl = new URL("/auth/signin", request.url);
      signInUrl.searchParams.set("redirect", path);
      return NextResponse.redirect(signInUrl);
    }

    if (isAuthPage && data.user) {
      const dest = "/dashboard";
      return NextResponse.redirect(new URL(dest, request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|static|public|favicon\\.ico|.*\\..*).*)"],
};

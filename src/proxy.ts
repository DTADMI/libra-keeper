import createMiddleware from "next-intl/middleware"
import { locales } from "./i18n"

export default createMiddleware({
  // Supported locales for the application
  locales: [...locales],

  // Default locale to use when none is specified
  defaultLocale: "en",

  // Only use the default locale for the root URL
  localePrefix: "as-needed",

  // Configure pathnames for internationalized routing
  // pathnames: {
  //   '/': '/',
  //   '/about': '/about',
  //   // Add more paths as needed
  // },
});

export const config = {
  // Match all request paths except for:
  // - API routes
  // - Static files (images, fonts, etc.)
  // - Public folder files
  // - Next.js internals (e.g., _next, _vercel)
  matcher: [
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};

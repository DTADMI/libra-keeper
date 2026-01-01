// src/app/page.tsx
import { redirect } from "next/navigation"
import { locales } from "@/i18n"

// This page will redirect to the default locale
// The root path (/) will redirect to /en or the default locale
export default function RootPage() {
  // This will only be hit if the middleware didn't redirect
  // So we'll redirect to the default locale
  const defaultLocale = locales[0] || "en"
  redirect(`/${defaultLocale}`)

  // This won't be rendered, but it's here to make TypeScript happy
  return null
}

// This tells Next.js that this is a dynamic route
export const dynamic = "force-dynamic"

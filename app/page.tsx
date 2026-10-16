// [PPR] route bloquante par defaut ; conversion incrementale
export const instant = false;

// src/app/page.tsx
import { redirect } from "next/navigation";

import { SUPPORTED_LOCALES } from "@/lib/i18n";

// Root path (/) redirects to default locale (/fr per cross-project rules).
// force-dynamic is justified because this page performs a locale redirect
// and must never be statically cached at build time.
export default function RootPage() {
  const defaultLocale = SUPPORTED_LOCALES[0] || "fr";
  redirect(`/${defaultLocale}`);
}

// [PPR] neutralise (incompatible cacheComponents) : export const dynamic = "force-dynamic";

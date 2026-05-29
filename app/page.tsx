// src/app/page.tsx
import { redirect } from "next/navigation";

import { locales } from "@/i18n";

// Root path (/) redirects to default locale (/fr per cross-project rules).
// force-dynamic is justified because this page performs a locale redirect
// and must never be statically cached at build time.
export default function RootPage() {
  const defaultLocale = locales[0] || "fr";
  redirect(`/${defaultLocale}`);
}

export const dynamic = "force-dynamic";

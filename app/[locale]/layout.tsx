// src/app/[locale]/layout.tsx
import { notFound } from "next/navigation";
import { ReactNode } from "react";

import I18nServerProvider from "@/lib/i18n/server-provider";
import { SUPPORTED_LOCALES, defaultLocale } from "@/lib/i18n/config";

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((l) => ({ locale: l.code }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Validate that the incoming locale is supported
  if (!SUPPORTED_LOCALES.some((l) => l.code === locale)) {
    notFound();
  }

  return (
    <I18nServerProvider>
      {children}
    </I18nServerProvider>
  );
}

export const dynamicParams = false;
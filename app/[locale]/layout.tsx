// src/app/[locale]/layout.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ReactNode } from "react";

import I18nServerProvider from "@/lib/i18n/server-provider";
import { SUPPORTED_LOCALES, defaultLocale } from "@/lib/i18n/config";

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((l) => ({ locale: l.code }));
}

const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://librakeeper.app").replace(/\/+$/, "");

// La page d'accueil localisee declare un canonical par langue et des alternates
// hreflang (URLs distinctes par langue) : sans cela, toutes les langues
// pointaient vers le titre de l'accueil sans signal de version linguistique.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "LibraKeeper - Your Personal Library Manager",
    description: "Manage your personal library and track borrowed items",
    metadataBase: new URL(appUrl),
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(SUPPORTED_LOCALES.map((l) => [l.code, `/${l.code}`])),
    },
  };
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
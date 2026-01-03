// src/app/[locale]/layout.tsx
import { notFound } from "next/navigation"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { ReactNode } from "react"

import { locales } from "@/i18n"

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
                                             children,
                                             params,
                                           }: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as string)) {
    notFound()
  }

  let messages
  try {
    messages = await getMessages()
  } catch (error) {
    notFound()
  }

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
    >
      {children}
    </NextIntlClientProvider>
  );
}

export const dynamicParams = false

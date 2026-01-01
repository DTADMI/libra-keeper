// src/app/[locale]/layout.tsx
"use client"

import { NextIntlClientProvider } from "next-intl"
import { notFound } from "next/navigation"
import { locales } from "@/i18n"
import { getMessages } from "next-intl/server"
import { ReactNode } from "react"

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

interface LocaleLayoutProps {
  children: ReactNode;
  params: { locale: string };
}

export default async function LocaleLayout({
                                             children,
                                             params,
                                           }: LocaleLayoutProps) {
  const { locale } = params

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
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
      onError={(error) => {
        if (process.env.NODE_ENV === "development") {
          console.error(error)
        }
      }}
      getMessageFallback={({ namespace, key }) => `[${namespace}.${key}]`}
    >
      {children}
    </NextIntlClientProvider>
  )
}

export const dynamicParams = false
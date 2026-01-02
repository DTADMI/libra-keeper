// next-intl.config.ts
import { notFound } from "next/navigation"
import { getRequestConfig } from "next-intl/server"

// Define the list of supported locales
export const locales = ["en"] as const

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as string)) {
    notFound()
  }

  return {
    messages: (await import(`./src/i18n/messages/${locale}.json`)).default,
    // You can add other i18n options here
  };
});

// Re-export the locale type for type safety
export type Locale = (typeof locales)[number];

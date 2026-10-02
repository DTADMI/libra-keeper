// src/app/layout.tsx
import "./globals.css";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { ReactNode } from "react";

import I18nServerProvider from "@/lib/i18n/server-provider";

import { AppProviders } from "@/components/providers/app-providers";
import { PWAInstallPrompt } from "@/components/pwa/install-prompt";
import { ServiceWorkerRegistration } from "@/components/pwa/service-worker-registration";

const inter = Inter({ subsets: ["latin"] });

const appUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://librakeeper.app").replace(/\/+$/, "");

/** Donnees structurees Schema.org : identifient l'editeur et le site pour les moteurs. */
const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${appUrl}/#organization`,
      name: "Nebula Forge Digital Studio",
      url: appUrl,
    },
    {
      "@type": "WebSite",
      "@id": `${appUrl}/#website`,
      url: appUrl,
      name: "LibraKeeper",
      inLanguage: ["en-CA", "fr-CA"],
      publisher: { "@id": `${appUrl}/#organization` },
    },
  ],
};

export const metadata = {
  metadataBase: new URL(appUrl),
  title: "LibraKeeper - Your Personal Library Manager",
  description: "Manage your personal library and track borrowed items",
  alternates: {
    canonical: "/",
    languages: { "en-CA": "/", "fr-CA": "/", "x-default": "/" },
  },
  openGraph: {
    type: "website" as const,
    siteName: "LibraKeeper",
    title: "LibraKeeper - Your Personal Library Manager",
    description: "Manage your personal library and track borrowed items",
    url: appUrl,
  },
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const headersList = await headers();
  const acceptLanguage = headersList.get("accept-language") ?? "fr";
  const lang = acceptLanguage.startsWith("en") ? "en" : "fr";

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
        />
        <ServiceWorkerRegistration />
        <PWAInstallPrompt />
        <I18nServerProvider>
          <AppProviders>
            {children}
          </AppProviders>
        </I18nServerProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

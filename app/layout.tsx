// src/app/layout.tsx
import "./globals.css";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { ReactNode } from "react";

import { AppProviders } from "@/components/providers/app-providers";
import { PWAInstallPrompt } from "@/components/pwa/install-prompt";
import { ServiceWorkerRegistration } from "@/components/pwa/service-worker-registration";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "LibraKeeper - Your Personal Library Manager",
  description: "Manage your personal library and track borrowed items",
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
  const acceptLanguage = headersList.get("accept-language") ?? "en";
  const lang = acceptLanguage.startsWith("fr") ? "fr" : "en";

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={inter.className}>
        <ServiceWorkerRegistration />
        <PWAInstallPrompt />
        <AppProviders>
          {children}
        </AppProviders>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

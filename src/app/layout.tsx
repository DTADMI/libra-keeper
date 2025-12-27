// src/app/layout.tsx
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
    title: "LibraKeeper - Your Personal Library Manager",
    description: "Manage your personal library and track borrowed items",
    manifest: "/manifest.json",
    themeColor: "#000000",
    viewport: "width=device-width, initial-scale=1, maximum-scale=1",
}

export default async function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    const messages = await getMessages()

    return (
        <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                {children}
                <Toaster position="top-center" />
            </ThemeProvider>
        </NextIntlClientProvider>
        </body>
        </html>
    )
}
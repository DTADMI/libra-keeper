"use client";

import { ErrorBoundary } from "@/components/error-boundary";
import { QueryProvider } from "@/components/providers/query-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { FeatureFlagsProvider } from "@/hooks/use-feature-flags";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryProvider>
        <FeatureFlagsProvider>
          <ErrorBoundary>
            {children}
          </ErrorBoundary>
        </FeatureFlagsProvider>
      </QueryProvider>
      <Toaster position="top-center" />
    </ThemeProvider>
  );
}

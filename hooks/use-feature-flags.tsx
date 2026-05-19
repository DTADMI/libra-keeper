// hooks/use-feature-flags.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useMemo } from "react";

import { apiClient } from "@/lib/api-client";

interface FeatureFlag {
  id: string
  name: string
  description: string | null
  isEnabled: boolean
}

interface FeatureFlagsContextValue {
  flags: Map<string, FeatureFlag>
  loading: boolean
  error: Error | null
}

const FeatureFlagsContext = createContext<FeatureFlagsContextValue>({
  flags: new Map(),
  loading: true,
  error: null,
});

export function FeatureFlagsProvider({ children }: { children: React.ReactNode }) {
  const { data, error, isLoading } = useQuery({
    queryKey: ["feature-flags"],
    queryFn: () => apiClient<FeatureFlag[]>("/api/feature-flags"),
    staleTime: 30_000,
    placeholderData: [],
  });

  const value = useMemo<FeatureFlagsContextValue>(() => {
    const flags = new Map<string, FeatureFlag>();
    if (data) {
      for (const flag of data) {
        flags.set(flag.name, flag);
      }
    }
    return { flags, loading: isLoading, error: error ?? null };
  }, [data, error, isLoading]);

  return (
    <FeatureFlagsContext.Provider value={value}>
      {children}
    </FeatureFlagsContext.Provider>
  );
}

export function useFeatureFlags(): FeatureFlagsContextValue {
  return useContext(FeatureFlagsContext);
}

export function useFeatureFlag(name: string): {
  enabled: boolean
  loading: boolean
  flag: FeatureFlag | undefined
} {
  const { flags, loading } = useFeatureFlags();
  const flag = flags.get(name);
  return {
    enabled: flag?.isEnabled ?? false,
    loading,
    flag,
  };
}

export function FeatureGate({
  flag,
  children,
  fallback,
}: {
  flag: string
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  const { enabled } = useFeatureFlag(flag);
  if (!enabled) {return fallback ?? null;}
  return <>{children}</>;
}

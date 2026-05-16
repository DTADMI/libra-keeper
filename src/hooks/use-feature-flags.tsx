"use client";

import { createContext, useContext, useMemo } from "react";
import useSWR from "swr";

interface FeatureFlag {
  id: string
  name: string
  description: string | null
  isEnabled: boolean
  type?: string
  value?: unknown
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

const fetcher = async (url: string): Promise<FeatureFlag[]> => {
  const res = await fetch(url);
  if (!res.ok) {throw new Error("Failed to fetch feature flags");}
  return res.json();
};

export function FeatureFlagsProvider({ children }: { children: React.ReactNode }) {
  const { data, error, isLoading } = useSWR<FeatureFlag[]>(
    "/api/feature-flags",
    fetcher,
    {
      dedupingInterval: 30000,
      revalidateOnFocus: false,
      revalidateOnMount: true,
      fallbackData: [],
    },
  );

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
  const { data, error, isLoading } = useSWR<FeatureFlag[]>(
    "/api/feature-flags",
    fetcher,
    {
      dedupingInterval: 30000,
      revalidateOnFocus: false,
      fallbackData: [],
    },
  );

  const flag = data?.find((f) => f.name === name);

  return {
    enabled: flag?.isEnabled ?? false,
    loading: isLoading && !data,
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

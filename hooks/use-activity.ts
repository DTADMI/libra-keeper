// hooks/use-activity.ts
"use client";

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";

interface Activity {
  id: string
  type: string
  message: string
  createdAt: string
  user?: { id: string; name: string | null }
  item?: { id: string; title: string }
}

export function useActivity() {
  return useQuery({
    queryKey: ["activity"],
    queryFn: () => apiClient<Activity[]>("/api/activity"),
    staleTime: 15_000,
  });
}

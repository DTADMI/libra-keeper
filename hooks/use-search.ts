// hooks/use-search.ts
"use client";

import { useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";

interface SearchResult {
  id: string;
  title: string;
  type: string;
  author: string | null;
  coverImage: string | null;
  rank: number;
  headline: string;
  _count: { likes: number; comments: number };
}

export function useSearch(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => apiClient<SearchResult[]>(`/api/search?q=${encodeURIComponent(query)}`),
    enabled: query.length >= 2,
    staleTime: 10_000,
  });
}

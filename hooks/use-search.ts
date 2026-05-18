"use client";

import { useQuery } from "@tanstack/react-query";

interface SearchResult {
  id: string;
  title: string;
  type: string;
  author: string | null;
  coverImage: string | null;
  rank: number;
  _count: { likes: number; comments: number };
}

async function fetchJSON<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {throw new Error(`Search failed: ${res.status}`);}
  return res.json();
}

export function useSearch(query: string) {
  return useQuery({
    queryKey: ["search", query],
    queryFn: () => fetchJSON<SearchResult[]>(`/api/search?q=${encodeURIComponent(query)}`),
    enabled: query.length >= 2,
    staleTime: 10000,
  });
}

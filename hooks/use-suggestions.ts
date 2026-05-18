"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface Suggestion {
  id: string;
  title: string;
  description: string | null;
  type: string;
  status: string;
  author: string | null;
  isbn: string | null;
  createdAt: string;
}

async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {throw new Error(`Request failed: ${res.status}`);}
  return res.json();
}

export function useSuggestions() {
  return useQuery({
    queryKey: ["suggestions"],
    queryFn: () => fetchJSON<Suggestion[]>("/api/suggestions"),
  });
}

export function useCreateSuggestion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      title: string;
      description?: string;
      type: string;
      author?: string;
      isbn?: string;
    }) =>
      fetchJSON<Suggestion>("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["suggestions"] });
    },
  });
}

export function useWaitlist(itemId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (action: "join" | "leave") =>
      fetchJSON<{ success: boolean }>(`/api/items/${itemId}/waitlist`, {
        method: action === "join" ? "POST" : "DELETE",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["item", itemId] });
    },
  });
}

// hooks/use-suggestions.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";

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

export function useSuggestions() {
  return useQuery({
    queryKey: ["suggestions"],
    queryFn: () => apiClient<Suggestion[]>("/api/suggestions"),
    staleTime: 30_000,
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
      apiClient<Suggestion>("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }),
    onError: (_err) => {
      queryClient.invalidateQueries({ queryKey: ["suggestions"] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["suggestions"] });
    },
  });
}

export function useWaitlist(itemId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (action: "join" | "leave") =>
      apiClient<{ success: boolean }>(`/api/items/${itemId}/waitlist`, {
        method: action === "join" ? "POST" : "DELETE",
      }),
    onError: (_err) => {
      queryClient.invalidateQueries({ queryKey: ["item", itemId] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["item", itemId] });
    },
  });
}

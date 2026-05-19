// hooks/use-items.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";

interface Item {
  id: string
  title: string
  type: string
  status: string
  coverImage: string | null
  author: string | null
  description: string | null
  tags: Array<{ id: string; name: string }>
  _count?: { likes: number; comments: number }
}

interface LikesState {
  count: number
  isLiked: boolean
}

interface Comment {
  id: string
  content: string
  itemId: string
  userId: string
  createdAt: string
  user: { name: string | null; image: string | null }
}

export function useItems() {
  return useQuery({
    queryKey: ["items"],
    queryFn: () => apiClient<Item[]>("/api/items"),
    staleTime: 30_000,
  });
}

export function useItem(itemId: string) {
  return useQuery({
    queryKey: ["item", itemId],
    queryFn: () => apiClient<Item>(`/api/items/${itemId}`),
    enabled: !!itemId,
    staleTime: 30_000,
  });
}

export function useLikes(itemId: string) {
  return useQuery({
    queryKey: ["likes", itemId],
    queryFn: () => apiClient<LikesState>(`/api/items/${itemId}/likes`),
    enabled: !!itemId,
    staleTime: 10_000,
  });
}

export function useToggleLike(itemId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      apiClient<{ liked: boolean }>(`/api/items/${itemId}/likes`, {
        method: "POST",
      }),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["likes", itemId] });
      const previous = queryClient.getQueryData<LikesState>(["likes", itemId]);
      if (previous) {
        queryClient.setQueryData<LikesState>(["likes", itemId], {
          count: previous.isLiked ? previous.count - 1 : previous.count + 1,
          isLiked: !previous.isLiked,
        });
      }
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["likes", itemId], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["likes", itemId] });
    },
  });
}

export function useComments(itemId: string) {
  return useQuery({
    queryKey: ["comments", itemId],
    queryFn: () => apiClient<Comment[]>(`/api/items/${itemId}/comments`),
    enabled: !!itemId,
    staleTime: 10_000,
  });
}

export function useAddComment(itemId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) =>
      apiClient<Comment>(`/api/items/${itemId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      }),
    onMutate: async (content) => {
      await queryClient.cancelQueries({ queryKey: ["comments", itemId] });
      const previous = queryClient.getQueryData<Comment[]>(["comments", itemId]);
      const optimistic: Comment = {
        id: "temp-" + Date.now(),
        content,
        itemId,
        userId: "",
        createdAt: new Date().toISOString(),
        user: { name: null, image: null },
      };
      queryClient.setQueryData<Comment[]>(["comments", itemId], (old) =>
        old ? [optimistic, ...old] : [optimistic],
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["comments", itemId], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", itemId] });
    },
  });
}

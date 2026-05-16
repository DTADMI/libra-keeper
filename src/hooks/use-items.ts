"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) {throw new Error(`Request failed: ${res.status}`);}
  return res.json();
}

export function useItems() {
  return useQuery({
    queryKey: ["items"],
    queryFn: () => fetchJSON<Item[]>("/api/items"),
  });
}

export function useItem(itemId: string) {
  return useQuery({
    queryKey: ["item", itemId],
    queryFn: () => fetchJSON<Item>(`/api/items/${itemId}`),
    enabled: !!itemId,
  });
}

export function useLikes(itemId: string) {
  return useQuery({
    queryKey: ["likes", itemId],
    queryFn: () => fetchJSON<LikesState>(`/api/items/${itemId}/likes`),
    enabled: !!itemId,
  });
}

export function useToggleLike(itemId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      fetchJSON<{ liked: boolean }>(`/api/items/${itemId}/likes`, {
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
    queryFn: () => fetchJSON<Comment[]>(`/api/items/${itemId}/comments`),
    enabled: !!itemId,
  });
}

export function useAddComment(itemId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) =>
      fetchJSON<Comment>(`/api/items/${itemId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      }),
    onSuccess: (newComment) => {
      queryClient.setQueryData<Comment[]>(["comments", itemId], (old) =>
        old ? [newComment, ...old] : [newComment],
      );
    },
  });
}

// hooks/use-item-images.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";

export interface ItemImage {
  id: string
  itemId: string
  url: string
  position: number
  caption: string | null
  isPrimary: boolean
  createdAt: string
}

export function useItemImages(itemId: string) {
  return useQuery({
    queryKey: ["item-images", itemId],
    queryFn: () => apiClient<ItemImage[]>(`/api/items/${itemId}/images`),
    enabled: !!itemId,
    staleTime: 30_000,
  });
}

export function useUploadImage(itemId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      if (!uploadRes.ok) {throw new Error("Upload failed");}
      const { url } = await uploadRes.json();

      return apiClient<ItemImage>(`/api/items/${itemId}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, caption: file.name }),
      });
    },
    onError: (_err) => {
      queryClient.invalidateQueries({ queryKey: ["item-images", itemId] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["item-images", itemId] });
      queryClient.invalidateQueries({ queryKey: ["item", itemId] });
    },
  });
}

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
    queryFn: async () => {
      const res = await fetch(`/api/items/${itemId}/images`);
      if (!res.ok) {throw new Error("Failed to load images");}
      return res.json() as Promise<ItemImage[]>;
    },
    enabled: !!itemId,
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

      const res = await fetch(`/api/items/${itemId}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, caption: file.name }),
      });
      if (!res.ok) {throw new Error("Failed to save image");}
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["item-images", itemId] });
      queryClient.invalidateQueries({ queryKey: ["item", itemId] });
    },
  });
}

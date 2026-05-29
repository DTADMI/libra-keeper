// hooks/use-messages.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";

interface Conversation {
  user: { id: string; name: string | null; image: string | null }
  lastMessage: string
  createdAt: string
  unread: boolean
}

interface Message {
  id: string
  content: string
  senderId: string
  createdAt: string
  sender: { name: string | null; image: string | null }
  metadata?: { voiceUrl?: string; duration?: number }
}

export function useConversations() {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: () => apiClient<Conversation[]>("/api/messages"),
    staleTime: 10_000,
  });
}

export function useMessages(userId: string | null) {
  return useQuery({
    queryKey: ["messages", userId],
    queryFn: () =>
      apiClient<Message[]>(`/api/messages?userId=${encodeURIComponent(userId!)}`),
    enabled: !!userId,
    staleTime: 5_000,
  });
}

export function useSendMessage(receiverId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (content: string) =>
      apiClient<Message>("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId, content }),
      }),
    onMutate: async (content) => {
      await queryClient.cancelQueries({ queryKey: ["messages", receiverId] });
      const previous = queryClient.getQueryData<Message[]>(["messages", receiverId]);
      const optimistic: Message = {
        id: "temp-" + Date.now(),
        content,
        senderId: "",
        createdAt: new Date().toISOString(),
        sender: { name: null, image: null },
      };
      queryClient.setQueryData<Message[]>(["messages", receiverId], (old) =>
        old ? [...old, optimistic] : [optimistic],
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["messages", receiverId], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", receiverId] });
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}

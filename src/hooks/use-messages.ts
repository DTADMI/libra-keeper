"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

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
}

async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init)
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json()
}

export function useConversations() {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: () => fetchJSON<Conversation[]>("/api/messages"),
  })
}

export function useMessages(userId: string | null) {
  return useQuery({
    queryKey: ["messages", userId],
    queryFn: () =>
      fetchJSON<Message[]>(`/api/messages?userId=${encodeURIComponent(userId!)}`),
    enabled: !!userId,
  })
}

export function useSendMessage(receiverId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (content: string) =>
      fetchJSON<Message>("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId, content }),
      }),
    onMutate: async (content) => {
      await queryClient.cancelQueries({ queryKey: ["messages", receiverId] })
      const previous = queryClient.getQueryData<Message[]>(["messages", receiverId])
      const optimistic: Message = {
        id: "temp-" + Date.now(),
        content,
        senderId: "",
        createdAt: new Date().toISOString(),
        sender: { name: null, image: null },
      }
      queryClient.setQueryData<Message[]>(["messages", receiverId], (old) =>
        old ? [...old, optimistic] : [optimistic],
      )
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["messages", receiverId], context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", receiverId] })
      queryClient.invalidateQueries({ queryKey: ["conversations"] })
    },
  })
}

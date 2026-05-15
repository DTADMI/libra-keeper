"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

interface Notification {
  id: string
  userId: string
  type: string
  title: string
  body: string
  link: string | null
  isRead: boolean
  createdAt: string
}

async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init)
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json()
}

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: () => fetchJSON<Notification[]>("/api/notifications"),
    refetchInterval: 30000,
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      fetchJSON<{ success: boolean }>(`/api/notifications/${id}`, { method: "PATCH" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
}

export function useMarkAllRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      fetchJSON<{ success: boolean }>("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAllRead: true }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] })
    },
  })
}

export function useUnreadCount() {
  const { data = [] } = useNotifications()
  return data.filter((n) => !n.isRead).length
}

"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

interface Loan {
  id: string
  itemId: string
  userId: string
  status: string
  requestedAt: string
  approvedAt: string | null
  dueAt: string | null
  returnedAt: string | null
  item?: { id: string; title: string; coverImage: string | null }
  user?: { id: string; name: string | null; image: string | null }
}

async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init)
  if (!res.ok) throw new Error(`Request failed: ${res.status}`)
  return res.json()
}

export function useMyLoans() {
  return useQuery({
    queryKey: ["loans"],
    queryFn: () => fetchJSON<Loan[]>("/api/loans"),
  })
}

export function useBorrowItem(itemId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      fetchJSON<Loan>("/api/loans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loans"] })
      queryClient.invalidateQueries({ queryKey: ["item", itemId] })
    },
  })
}

export function useUpdateLoan(loanId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (status: string) =>
      fetchJSON<Loan>(`/api/loans/${loanId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["loans"] })
    },
  })
}

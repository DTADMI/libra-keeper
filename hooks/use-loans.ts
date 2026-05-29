// hooks/use-loans.ts
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/lib/api-client";

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

interface AdminLoan {
  id: string
  itemId: string
  userId: string
  status: string
  createdAt: string
  item: { title: string }
  user: { name: string | null; email: string }
}

export function useMyLoans() {
  return useQuery({
    queryKey: ["loans"],
    queryFn: () => apiClient<Loan[]>("/api/loans"),
    staleTime: 30_000,
  });
}

export function useAdminLoans() {
  return useQuery({
    queryKey: ["admin", "loans"],
    queryFn: () => apiClient<AdminLoan[]>("/api/loans?admin=true&status=PENDING"),
    staleTime: 15_000,
  });
}

export function useBorrowItem(itemId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      apiClient<Loan>("/api/loans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId }),
      }),
    onError: (_err) => {
      queryClient.invalidateQueries({ queryKey: ["item", itemId] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["loans"] });
      queryClient.invalidateQueries({ queryKey: ["item", itemId] });
    },
  });
}

export function useUpdateLoan(loanId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status: string) =>
      apiClient<Loan>(`/api/loans/${loanId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      }),
    onError: (_err) => {
      queryClient.invalidateQueries({ queryKey: ["loans"] });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["loans"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "loans"] });
    },
  });
}

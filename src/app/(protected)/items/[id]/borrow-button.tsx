// src/app/(protected)/items/[id]/borrow-button.tsx
"use client"

import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { useBorrowItem } from "@/hooks/use-loans"

interface BorrowButtonProps {
  itemId: string;
  disabled?: boolean;
}

export function BorrowButton({ itemId, disabled }: BorrowButtonProps) {
  const borrowItem = useBorrowItem(itemId)

  function onBorrow() {
    borrowItem.mutate(undefined, {
      onSuccess: () => {
        toast.success("Borrow request sent successfully")
      },
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : "Failed to send borrow request")
      },
    })
  }

  return (
    <Button onClick={onBorrow} disabled={borrowItem.isPending || disabled} size="lg">
      {borrowItem.isPending ? "Sending Request..." : "Request to Borrow"}
    </Button>
  );
}

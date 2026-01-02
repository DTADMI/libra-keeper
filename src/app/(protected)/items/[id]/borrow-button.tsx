// src/app/(protected)/items/[id]/borrow-button.tsx
"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

interface BorrowButtonProps {
  itemId: string;
  disabled?: boolean;
}

export function BorrowButton({ itemId, disabled }: BorrowButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function onBorrow() {
    setIsLoading(true)
    try {
      const response = await fetch("/api/loans", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId }),
      });

      if (!response.ok) {
        const error = await response.text()
        throw new Error(error)
      }

      toast.success("Borrow request sent successfully")
      router.refresh()
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to send borrow request")
      } else {
        toast.error("An unknown error occurred")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={onBorrow} disabled={isLoading || disabled} size="lg">
      {isLoading ? "Sending Request..." : "Request to Borrow"}
    </Button>
  );
}

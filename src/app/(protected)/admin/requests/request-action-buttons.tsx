"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface RequestActionButtonsProps {
  loanId: string;
}

export function RequestActionButtons({ loanId }: RequestActionButtonsProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  async function handleAction(status: "APPROVED" | "REJECTED") {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/loans/${loanId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) {
        throw new Error("Failed to update request")
      }

      toast.success(`Request ${status.toLowerCase()} successfully`)
      router.refresh()
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="outline"
        className="text-destructive hover:bg-destructive/10"
        onClick={() => handleAction("REJECTED")}
        disabled={isLoading}
      >
        Reject
      </Button>
      <Button size="sm" onClick={() => handleAction("APPROVED")} disabled={isLoading}>
        Approve
      </Button>
    </div>
  )
}

// src/app/(protected)/items/[id]/report-button.tsx
"use client"

import { useState } from "react"
import { toast } from "sonner"

import { Icons } from "@/components/icons"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface ReportButtonProps {
  itemId: string;
}

export function ReportButton({ itemId }: ReportButtonProps) {
  const [reason, setReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  async function onReport() {
    if (!reason.trim()) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/items/${itemId}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        throw new Error("Failed to send report")
      }

      toast.success("Report sent to admin")
      setIsOpen(false)
      setReason("")
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else if (typeof error === "string") {
        toast.error(error || "Failed to send report")
      } else {
        toast.error("An unexpected error occurred")
      }
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
          <Icons.alertCircle className="h-4 w-4 mr-2" />
          Report Issue
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Report an issue with this item</AlertDialogTitle>
          <AlertDialogDescription>
            Please describe the issue (e.g., item is damaged, lost, or information is incorrect).
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <Textarea
            placeholder="Describe the issue..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              onReport()
            }}
            disabled={isLoading || !reason.trim()}
          >
            {isLoading ? "Sending..." : "Send Report"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

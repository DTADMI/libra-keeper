// src/app/(protected)/items/[id]/report-button.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
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

interface ReportButtonProps {
  itemId: string
}

export function ReportButton({ itemId }: ReportButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  async function onReport() {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/items/${itemId}/report`, {
        method: "POST",
      })

      if (response.ok) {
        toast.success("Item reported as missing. Admin will review.")
      } else {
        throw new Error("Failed to report item")
      }
    } catch (error) {
      toast.error("Failed to report item")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
          Report Missing
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will report the item as missing to the administrator.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onReport} disabled={isLoading}>
            {isLoading ? "Reporting..." : "Report"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

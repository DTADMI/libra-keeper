// src/app/(protected)/items/[id]/like-button.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/icons"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface LikeButtonProps {
  itemId: string
}

export function LikeButton({ itemId }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [count, setCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchLikes()
  }, [itemId])

  async function fetchLikes() {
    try {
      const response = await fetch(`/api/items/${itemId}/likes`)
      if (response.ok) {
        const data = await response.json()
        setIsLiked(data.isLiked)
        setCount(data.count)
      }
    } catch (error) {
      console.error("Failed to fetch likes", error)
    } finally {
      setIsLoading(false)
    }
  }

  async function toggleLike() {
    if (isLoading) return

    try {
      const response = await fetch(`/api/items/${itemId}/likes`, {
        method: "POST",
      })

      if (response.ok) {
        const data = await response.json()
        setIsLiked(data.liked)
        setCount((prev) => (data.liked ? prev + 1 : prev - 1))
      }
    } catch (error) {
      toast.error("Failed to update like")
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "flex items-center gap-2",
        isLiked && "text-red-500 hover:text-red-600"
      )}
      onClick={toggleLike}
      disabled={isLoading}
    >
      <Icons.heart className={cn("h-5 w-5", isLiked && "fill-current")} />
      <span>{count}</span>
    </Button>
  )
}

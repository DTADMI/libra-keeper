// src/app/(protected)/items/[id]/like-button.tsx
"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"

import { Icons } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface LikeButtonProps {
  itemId: string;
}

export function LikeButton({ itemId }: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [likesCount, setLikesCount] = useState(0)

  useEffect(() => {
    fetch(`/api/items/${itemId}/likes`)
      .then((res) => res.json())
      .then((data) => {
        setIsLiked(data.isLiked)
        setLikesCount(data.count)
      })
      .catch(() => {
      });
  }, [itemId]);

  async function onLike() {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/items/${itemId}/likes`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to update like")
      }

      const data = await response.json()
      setIsLiked(data.isLiked)
      setLikesCount(data.count)
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else if (typeof error === "string") {
        toast.error(error || "Failed to update like")
      } else {
        toast.error("An unexpected error occurred")
      }
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onLike}
      disabled={isLoading}
      className={cn("gap-2", isLiked && "text-red-500 border-red-200 bg-red-50")}
    >
      <Icons.heart className={cn("h-4 w-4", isLiked && "fill-current")} />
      <span>{likesCount}</span>
    </Button>
  );
}

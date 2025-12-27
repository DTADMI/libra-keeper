"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Loader2, UserMinus, UserPlus } from "lucide-react"

interface WaitlistButtonProps {
  itemId: string;
  isJoined: boolean;
}

export function WaitlistButton({ itemId, isJoined }: WaitlistButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleToggleWaitlist = async () => {
    setIsLoading(true)
    try {
      const method = isJoined ? "DELETE" : "POST"
      const response = await fetch(`/api/items/${itemId}/waitlist`, {
        method,
      });

      if (!response.ok) {
        throw new Error("Failed to update waitlist")
      }

      toast.success(isJoined ? "Left the waitlist" : "Joined the waitlist")
      router.refresh()
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  };

  return (
    <Button
      onClick={handleToggleWaitlist}
      disabled={isLoading}
      variant={isJoined ? "outline" : "secondary"}
      size="lg"
      className="flex items-center gap-2"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isJoined ? (
        <UserMinus className="h-4 w-4" />
      ) : (
        <UserPlus className="h-4 w-4" />
      )}
      {isJoined ? "Leave Waitlist" : "Join Waitlist"}
    </Button>
  );
}

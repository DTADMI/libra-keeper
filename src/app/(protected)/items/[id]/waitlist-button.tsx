"use client"

import { Loader2, UserMinus, UserPlus } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { useWaitlist } from "@/hooks/use-suggestions"

interface WaitlistButtonProps {
  itemId: string;
  isJoined: boolean;
}

export function WaitlistButton({ itemId, isJoined }: WaitlistButtonProps) {
  const waitlist = useWaitlist(itemId)

  const handleToggleWaitlist = () => {
    waitlist.mutate(isJoined ? "leave" : "join", {
      onSuccess: () => {
        toast.success(isJoined ? "Left the waitlist" : "Joined the waitlist")
      },
      onError: () => {
        toast.error("Something went wrong")
      },
    })
  }

  return (
    <Button
      onClick={handleToggleWaitlist}
      disabled={waitlist.isPending}
      variant={isJoined ? "outline" : "secondary"}
      size="lg"
      className="flex items-center gap-2"
    >
      {waitlist.isPending ? (
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

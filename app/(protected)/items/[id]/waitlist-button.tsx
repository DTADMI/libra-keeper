"use client";

import { Loader2, UserMinus, UserPlus } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useWaitlist } from "@/hooks/use-suggestions";

interface WaitlistButtonProps {
  itemId: string;
  isJoined: boolean;
}

export function WaitlistButton({ itemId, isJoined }: WaitlistButtonProps) {
  const { t } = useI18n();
  const waitlist = useWaitlist(itemId);

  const handleToggleWaitlist = () => {
    waitlist.mutate(isJoined ? "leave" : "join", {
      onSuccess: () => {
        toast.success(isJoined ? t("Items.leftWaitlist") : t("Items.joinedWaitlist"));
      },
      onError: () => {
        toast.error(t("Items.waitlistFailed"));
      },
    });
  };

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
      {isJoined ? t("Items.leaveWaitlist") : t("Items.joinWaitlist")}
    </Button>
  );
}

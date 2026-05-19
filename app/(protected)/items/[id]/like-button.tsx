// src/app/(protected)/items/[id]/like-button.tsx
"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { useLikes, useToggleLike } from "@/hooks/use-items";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  itemId: string;
}

export function LikeButton({ itemId }: LikeButtonProps) {
  const t = useTranslations("Items");
  const { data, isLoading: isQueryLoading } = useLikes(itemId);
  const toggleLike = useToggleLike(itemId);

  function onLike() {
    toggleLike.mutate(undefined, {
      onError: (error) => {
        toast.error(error instanceof Error ? error.message : t("reportFailed"));
      },
    });
  }

  const isLiked = data?.isLiked ?? false;
  const likesCount = data?.count ?? 0;

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onLike}
      disabled={toggleLike.isPending || isQueryLoading}
      className={cn("gap-2", isLiked && "text-red-500 border-red-200 bg-red-50")}
    >
      <Icons.heart className={cn("h-4 w-4", isLiked && "fill-current")} />
      <span>{likesCount}</span>
    </Button>
  );
}

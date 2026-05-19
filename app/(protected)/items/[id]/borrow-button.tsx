// src/app/(protected)/items/[id]/borrow-button.tsx
"use client";

import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useBorrowItem } from "@/hooks/use-loans";

interface BorrowButtonProps {
  itemId: string;
  disabled?: boolean;
}

export function BorrowButton({ itemId, disabled }: BorrowButtonProps) {
  const t = useTranslations("Items");
  const borrowItem = useBorrowItem(itemId);

  function onBorrow() {
    borrowItem.mutate(undefined, {
      onSuccess: () => {
        toast.success(t("requestSent"));
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : t("requestFailed")
        );
      },
    });
  }

  return (
    <Button onClick={onBorrow} disabled={borrowItem.isPending || disabled} size="lg">
      {borrowItem.isPending ? t("sendingRequest") : t("requestBorrow")}
    </Button>
  );
}

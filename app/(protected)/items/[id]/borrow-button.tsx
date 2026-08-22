// src/app/(protected)/items/[id]/borrow-button.tsx
"use client";

import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useBorrowItem } from "@/hooks/use-loans";

interface BorrowButtonProps {
  itemId: string;
  disabled?: boolean;
}

export function BorrowButton({ itemId, disabled }: BorrowButtonProps) {
  const { t } = useI18n();
  const borrowItem = useBorrowItem(itemId);

  function onBorrow() {
    borrowItem.mutate(undefined, {
      onSuccess: () => {
        toast.success(t("Items.requestSent"));
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : t("Items.requestFailed")
        );
      },
    });
  }

  return (
    <Button onClick={onBorrow} disabled={borrowItem.isPending || disabled} size="lg">
      {borrowItem.isPending ? t("Items.sendingRequest") : t("Items.requestBorrow")}
    </Button>
  );
}

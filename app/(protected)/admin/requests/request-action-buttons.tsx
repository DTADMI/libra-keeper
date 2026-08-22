"use client";

import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useUpdateLoan } from "@/hooks/use-loans";

interface RequestActionButtonsProps {
  loanId: string;
}

export function RequestActionButtons({ loanId }: RequestActionButtonsProps) {
  const { t } = useI18n();
  // tc (Common) merged — use t("Common.key")
  const router = useRouter();
  const updateLoan = useUpdateLoan(loanId);

  function handleAction(status: "APPROVED" | "REJECTED") {
    updateLoan.mutate(status, {
      onSuccess: () => {
        toast.success(status === "APPROVED" ? t("Loans.approved") : t("Loans.rejected"));
        router.refresh();
      },
      onError: () => {
        toast.error(t("Common.error"));
      },
    });
  }

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        variant="outline"
        className="text-destructive hover:bg-destructive/10"
        onClick={() => handleAction("REJECTED")}
        disabled={updateLoan.isPending}
      >
        {t("Loans.reject")}
      </Button>
      <Button size="sm" onClick={() => handleAction("APPROVED")} disabled={updateLoan.isPending}>
        {t("Loans.approve")}
      </Button>
    </div>
  );
}

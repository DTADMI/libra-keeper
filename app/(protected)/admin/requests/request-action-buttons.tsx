"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useUpdateLoan } from "@/hooks/use-loans";

interface RequestActionButtonsProps {
  loanId: string;
}

export function RequestActionButtons({ loanId }: RequestActionButtonsProps) {
  const t = useTranslations("Loans");
  const tc = useTranslations("Common");
  const router = useRouter();
  const updateLoan = useUpdateLoan(loanId);

  function handleAction(status: "APPROVED" | "REJECTED") {
    updateLoan.mutate(status, {
      onSuccess: () => {
        toast.success(status === "APPROVED" ? t("approved") : t("rejected"));
        router.refresh();
      },
      onError: () => {
        toast.error(tc("error"));
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
        {t("reject")}
      </Button>
      <Button size="sm" onClick={() => handleAction("APPROVED")} disabled={updateLoan.isPending}>
        {t("approve")}
      </Button>
    </div>
  );
}

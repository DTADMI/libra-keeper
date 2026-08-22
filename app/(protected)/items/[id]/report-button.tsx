// src/app/(protected)/items/[id]/report-button.tsx
"use client";

import { useI18n } from "@/lib/i18n";
import { useState } from "react";
import { toast } from "sonner";

import { Icons } from "@/components/icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useReportItem } from "@/hooks/use-items";

interface ReportButtonProps {
  itemId: string;
}

export function ReportButton({ itemId }: ReportButtonProps) {
  const { t } = useI18n();
  // tc (Common) merged — use t("Common.key")
  const reportItem = useReportItem(itemId);
  const [reason, setReason] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  function onReport() {
    if (!reason.trim()) {
      return;
    }

    reportItem.mutate(reason.trim(), {
      onSuccess: () => {
        toast.success(t("Items.reportSubmitted"));
        setIsOpen(false);
        setReason("");
      },
      onError: (error) => {
        toast.error(
          error instanceof Error ? error.message : t("Items.reportFailed")
        );
      },
    });
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
          <Icons.alertCircle className="h-4 w-4 mr-2" />
          {t("Items.reportMissing")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("Items.reportMissing")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("Items.description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <Textarea
            placeholder={t("Items.reportReason")}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={reportItem.isPending}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={reportItem.isPending}>
            {t("Common.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onReport();
            }}
            disabled={reportItem.isPending || !reason.trim()}
          >
            {reportItem.isPending ? t("Common.loading") : t("Common.submit")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

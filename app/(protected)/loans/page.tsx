"use client";

import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyLoans } from "@/hooks/use-loans";

const statusBadgeVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  APPROVED: "default",
  PENDING: "secondary",
  RETURNED: "outline",
  REJECTED: "destructive",
  OVERDUE: "destructive",
  LOST: "destructive",
  DAMAGED: "destructive",
};

export default function MyLoansPage() {
  const t = useTranslations("Loans");
  const { data: loans = [], isLoading, error } = useMyLoans();

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <Skeleton className="h-8 w-48" />
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-6 space-y-2">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-3 w-1/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-destructive text-center py-8">{t("loadingFailed") || "Failed to load loans."}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{t("title")}</h1>

      <div className="grid gap-4">
        {loans.map((loan) => (
          <Card key={loan.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{loan.item?.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">{loan.item?.title || ""}</p>
                </div>
                <Badge variant={statusBadgeVariant[loan.status] ?? "secondary"}>
                  {t(`statuses.${loan.status}`)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end">
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>{t("requestedAt")}: {new Date(loan.requestedAt).toLocaleDateString()}</p>
                  {loan.approvedAt && (
                    <p>{t("approvedAt") || "Approved"}: {new Date(loan.approvedAt).toLocaleDateString()}</p>
                  )}
                  {loan.dueAt && (
                    <p className="font-medium text-primary">
                      {t("dueDate")}: {new Date(loan.dueAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                {loan.status === "APPROVED" && (
                  <p className="text-sm font-medium">{t("enjoy") || "Enjoy your item!"}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {loans.length === 0 && (
          <p className="text-center py-10 text-muted-foreground">{t("noLoans")}</p>
        )}
      </div>
    </div>
  );
}

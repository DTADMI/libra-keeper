"use client";

import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAdminLoans } from "@/hooks/use-loans";
import { useSession } from "@/hooks/use-session";

import { RequestActionButtons } from "./request-action-buttons";

export default function AdminRequestsPage() {
  const t = useTranslations("Admin");
  const { data: session } = useSession();
  const { data: loans = [], isLoading, error } = useAdminLoans();

  if (session?.user?.role !== "ADMIN") {
    return (
      <div className="container mx-auto p-4">
        <p className="text-muted-foreground">{t("unauthorized")}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{t("requests")}</h1>

      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6 space-y-3">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
                <div className="flex gap-2">
                  <Skeleton className="h-9 w-20" />
                  <Skeleton className="h-9 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {error && (
        <p className="text-destructive text-center py-8">{t("loadingFailed")}</p>
      )}

      {!isLoading && !error && (
        <div className="grid gap-4">
          {loans.map((loan) => (
            <Card key={loan.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{loan.item.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {t("requestedBy")} {loan.user.name} ({loan.user.email})
                    </p>
                  </div>
                  <Badge>{loan.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">
                    {t("requestedOn")} {new Date(loan.createdAt).toLocaleDateString()}
                  </p>
                  <RequestActionButtons loanId={loan.id} />
                </div>
              </CardContent>
            </Card>
          ))}

          {loans.length === 0 && (
            <p className="text-center py-10 text-muted-foreground">{t("noPendingRequests")}</p>
          )}
        </div>
      )}
    </div>
  );
}

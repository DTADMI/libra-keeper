// app/(protected)/admin/requests/loan-stats-card.tsx
//
// Statistiques de prets (feature B5) : comptes par statut, retards, duree
// moyenne et classements. Purement derive des prets deja charges par la page.
"use client";

import { useMemo } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { computeLoanStats, type LoanStatInput } from "@/lib/loan-stats";
import { useI18n } from "@/lib/i18n";

interface LoanStatsCardProps {
  loans: LoanStatInput[];
}

export function LoanStatsCard({ loans }: LoanStatsCardProps) {
  const { t } = useI18n();
  const stats = useMemo(() => computeLoanStats(loans), [loans]);

  const metric = (label: string, value: string | number) => (
    <div className="rounded-lg border p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-xl font-semibold">{value}</p>
    </div>
  );

  const ranking = (title: string, rows: { label: string; count: number }[]) => (
    <div>
      <p className="mb-1 text-sm font-medium">{title}</p>
      {rows.length === 0 ? (
        <p className="text-xs text-muted-foreground">{t("Admin.statNone")}</p>
      ) : (
        <ul className="space-y-0.5 text-sm">
          {rows.map((row) => (
            <li key={row.label} className="flex justify-between gap-2">
              <span className="truncate">{row.label}</span>
              <span className="text-muted-foreground">{row.count}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-base">{t("Admin.loanStats")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {metric(t("Admin.statTotal"), stats.total)}
          {metric(t("Admin.statReturned"), stats.byStatus.RETURNED ?? 0)}
          {metric(t("Admin.statOverdue"), stats.overdue)}
          {metric(
            t("Admin.statAvgDays"),
            stats.averageLoanDays === null ? "-" : stats.averageLoanDays.toFixed(1),
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {ranking(t("Admin.statTopBorrowers"), stats.topBorrowers)}
          {ranking(t("Admin.statTopItems"), stats.topItems)}
        </div>
      </CardContent>
    </Card>
  );
}

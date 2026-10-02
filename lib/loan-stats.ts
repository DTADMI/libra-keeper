// ─────────────────────────────────────────────────────────
// LibraKeeper - statistiques de prets (feature B5)
//
// Fonctions pures, sans Prisma ni React, pour etre testables et reutilisables
// par l'API comme par l'interface.
// ─────────────────────────────────────────────────────────

export interface LoanStatInput {
  status: string;
  requestedAt?: string | Date | null;
  approvedAt?: string | Date | null;
  dueAt?: string | Date | null;
  returnedAt?: string | Date | null;
  item?: { title?: string | null } | null;
  user?: { name?: string | null; email?: string | null } | null;
}

export interface NamedCount {
  label: string;
  count: number;
}

export interface LoanStats {
  total: number;
  byStatus: Record<string, number>;
  /** Prets en cours dont l'echeance est depassee. */
  overdue: number;
  /** Duree moyenne (jours) des prets rendus ; null s'il n'y en a aucun. */
  averageLoanDays: number | null;
  /** Emprunteurs les plus actifs (max 5). */
  topBorrowers: NamedCount[];
  /** Ouvrages les plus empruntes (max 5). */
  topItems: NamedCount[];
}

const ACTIVE_STATUSES = new Set(["APPROVED", "OVERDUE", "PENDING"]);
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function toTime(value: string | Date | null | undefined): number | null {
  if (!value) return null;
  const t = value instanceof Date ? value.getTime() : new Date(value).getTime();
  return Number.isNaN(t) ? null : t;
}

function top(counts: Map<string, number>, limit = 5): NamedCount[] {
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label))
    .slice(0, limit);
}

export function computeLoanStats(
  loans: readonly LoanStatInput[],
  now: number = Date.now(),
): LoanStats {
  const byStatus: Record<string, number> = {};
  let overdue = 0;
  let durationSum = 0;
  let durationCount = 0;
  const borrowers = new Map<string, number>();
  const items = new Map<string, number>();

  for (const loan of loans) {
    byStatus[loan.status] = (byStatus[loan.status] ?? 0) + 1;

    const due = toTime(loan.dueAt);
    const returned = toTime(loan.returnedAt);
    if (
      (loan.status === "OVERDUE" || (ACTIVE_STATUSES.has(loan.status) && due !== null && due < now)) &&
      returned === null
    ) {
      overdue += 1;
    }

    if (loan.status === "RETURNED" && returned !== null) {
      const start = toTime(loan.approvedAt) ?? toTime(loan.requestedAt);
      if (start !== null && returned >= start) {
        durationSum += (returned - start) / MS_PER_DAY;
        durationCount += 1;
      }
    }

    const borrowerLabel = loan.user?.name || loan.user?.email || null;
    if (borrowerLabel) borrowers.set(borrowerLabel, (borrowers.get(borrowerLabel) ?? 0) + 1);

    const itemLabel = loan.item?.title || null;
    if (itemLabel) items.set(itemLabel, (items.get(itemLabel) ?? 0) + 1);
  }

  return {
    total: loans.length,
    byStatus,
    overdue,
    averageLoanDays: durationCount > 0 ? durationSum / durationCount : null,
    topBorrowers: top(borrowers),
    topItems: top(items),
  };
}

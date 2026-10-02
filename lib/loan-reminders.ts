// ─────────────────────────────────────────────────────────
// LibraKeeper - planification des rappels d'echeance (feature B2)
//
// Fonction pure, sans Prisma ni envoi, pour etre testable. La route cron
// app/api/cron/email-reminders l'utilise pour savoir qui relancer.
// ─────────────────────────────────────────────────────────

export interface ReminderLoanInput {
  status: string;
  dueAt?: string | Date | null;
  item?: { title?: string | null } | null;
  user?: { email?: string | null; name?: string | null } | null;
}

export interface LoanReminder {
  kind: "upcoming" | "overdue";
  days: number;
  itemTitle: string;
  userEmail: string;
  userName: string;
  dueAt: Date;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function toDate(value: string | Date | null | undefined): Date | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Determine les rappels a envoyer. `upcoming`: prets APPROVED dont l'echeance
 * tombe dans les prochaines `windowHours`. `overdue`: prets marques OVERDUE
 * (ou APPROVED dont l'echeance est depassee, filet de securite).
 * Les prets sans destinataire ou sans titre sont ignores.
 */
export function planLoanReminders(
  loans: readonly ReminderLoanInput[],
  now: Date,
  windowHours = 24,
): LoanReminder[] {
  const nowMs = now.getTime();
  const horizon = nowMs + windowHours * 60 * 60 * 1000;
  const out: LoanReminder[] = [];

  for (const loan of loans) {
    const due = toDate(loan.dueAt);
    const email = loan.user?.email;
    const name = loan.user?.name;
    const itemTitle = loan.item?.title;
    if (!due || !email || !name || !itemTitle) continue;

    const dueMs = due.getTime();
    const overdue = loan.status === "OVERDUE" || (loan.status === "APPROVED" && dueMs < nowMs);
    const upcoming = loan.status === "APPROVED" && dueMs >= nowMs && dueMs <= horizon;

    if (overdue) {
      out.push({
        kind: "overdue",
        days: Math.ceil((nowMs - dueMs) / MS_PER_DAY),
        itemTitle,
        userEmail: email,
        userName: name,
        dueAt: due,
      });
    } else if (upcoming) {
      out.push({
        kind: "upcoming",
        days: Math.ceil((dueMs - nowMs) / MS_PER_DAY),
        itemTitle,
        userEmail: email,
        userName: name,
        dueAt: due,
      });
    }
  }

  return out;
}

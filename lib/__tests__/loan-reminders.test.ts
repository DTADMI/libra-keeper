import { planLoanReminders } from "../loan-reminders";

const NOW = new Date("2026-10-02T12:00:00Z");
const base = {
  status: "APPROVED",
  item: { title: "Dune" },
  user: { email: "alex@example.com", name: "Alex" },
};

describe("planLoanReminders", () => {
  it("planifie un rappel pour une echeance dans les prochaines 24 h", () => {
    const reminders = planLoanReminders(
      [{ ...base, dueAt: "2026-10-03T10:00:00Z" }],
      NOW,
      24,
    );
    expect(reminders).toHaveLength(1);
    expect(reminders[0]).toMatchObject({ kind: "upcoming", itemTitle: "Dune" });
    expect(reminders[0]?.days).toBe(1);
  });

  it("ignore une echeance au-dela de la fenetre", () => {
    expect(planLoanReminders([{ ...base, dueAt: "2026-10-10T10:00:00Z" }], NOW, 24)).toHaveLength(0);
  });

  it("planifie un rappel pour un pret marque OVERDUE", () => {
    const reminders = planLoanReminders(
      [{ ...base, status: "OVERDUE", dueAt: "2026-09-28T12:00:00Z" }],
      NOW,
    );
    expect(reminders[0]).toMatchObject({ kind: "overdue" });
    expect(reminders[0]?.days).toBe(4);
  });

  it("traite un APPROVED deja echu comme en retard (filet de securite)", () => {
    const reminders = planLoanReminders([{ ...base, dueAt: "2026-10-01T12:00:00Z" }], NOW);
    expect(reminders[0]?.kind).toBe("overdue");
  });

  it("ignore les prets sans destinataire, titre ou echeance", () => {
    const reminders = planLoanReminders(
      [
        { status: "OVERDUE", dueAt: "2026-09-01T00:00:00Z", item: { title: "X" }, user: { email: null, name: "A" } },
        { status: "OVERDUE", dueAt: "2026-09-01T00:00:00Z", item: { title: null }, user: { email: "a@b.c", name: "A" } },
        { status: "OVERDUE", dueAt: null, item: { title: "X" }, user: { email: "a@b.c", name: "A" } },
      ],
      NOW,
    );
    expect(reminders).toHaveLength(0);
  });
});

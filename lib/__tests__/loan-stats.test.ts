import { computeLoanStats, type LoanStatInput } from "../loan-stats";

const NOW = new Date("2026-10-02T12:00:00Z").getTime();

const base: LoanStatInput = {
  status: "APPROVED",
  requestedAt: "2026-09-01T00:00:00Z",
  approvedAt: "2026-09-02T00:00:00Z",
  dueAt: "2026-10-01T00:00:00Z",
  returnedAt: null,
  item: { title: "Dune" },
  user: { name: "Alex", email: "alex@example.com" },
};

describe("computeLoanStats", () => {
  it("compte les prets par statut", () => {
    const stats = computeLoanStats(
      [
        base,
        { ...base, status: "RETURNED", returnedAt: "2026-09-12T00:00:00Z" },
        { ...base, status: "PENDING" },
      ],
      NOW,
    );
    expect(stats.total).toBe(3);
    expect(stats.byStatus).toEqual({ APPROVED: 1, RETURNED: 1, PENDING: 1 });
  });

  it("detecte les retards (statut OVERDUE et echeance depassee)", () => {
    const stats = computeLoanStats(
      [
        base, // dueAt dans le passe, non rendu -> en retard
        { ...base, status: "OVERDUE" },
        { ...base, dueAt: "2026-12-01T00:00:00Z" }, // echeance future -> pas en retard
        { ...base, dueAt: "2026-10-01T00:00:00Z", returnedAt: "2026-10-01T06:00:00Z" }, // rendu
      ],
      NOW,
    );
    expect(stats.overdue).toBe(2);
  });

  it("calcule la duree moyenne des prets rendus", () => {
    const stats = computeLoanStats(
      [
        { ...base, status: "RETURNED", approvedAt: "2026-09-01T00:00:00Z", returnedAt: "2026-09-11T00:00:00Z" },
        { ...base, status: "RETURNED", approvedAt: "2026-09-01T00:00:00Z", returnedAt: "2026-09-21T00:00:00Z" },
      ],
      NOW,
    );
    expect(stats.averageLoanDays).toBe(15);
  });

  it("renvoie null sans pret rendu", () => {
    expect(computeLoanStats([base], NOW).averageLoanDays).toBeNull();
  });

  it("classe les emprunteurs et les ouvrages, limite a 5", () => {
    const loans: LoanStatInput[] = [];
    for (let i = 0; i < 6; i++) {
      loans.push({ ...base, user: { name: `U${i}`, email: `u${i}@x` }, item: { title: `T${i}` } });
    }
    loans.push({ ...base, user: { name: "U0", email: "u0@x" }, item: { title: "T0" } });
    const stats = computeLoanStats(loans, NOW);
    expect(stats.topBorrowers).toHaveLength(5);
    expect(stats.topBorrowers[0]).toEqual({ label: "U0", count: 2 });
    expect(stats.topItems[0]).toEqual({ label: "T0", count: 2 });
  });
});

import {
  BACKUP_VERSION,
  createBackup,
  parseBackup,
  planRestore,
} from "@/lib/backup";

describe("backup createBackup", () => {
  it("wraps items with a version and an ISO date", () => {
    const out = createBackup(
      [{ title: "Dune", type: "BOOK" }],
      new Date("2026-09-30T12:00:00.000Z")
    );
    expect(out.version).toBe(BACKUP_VERSION);
    expect(out.count).toBe(1);
    expect(out.exportedAt).toBe("2026-09-30T12:00:00.000Z");
    expect(out.items[0].title).toBe("Dune");
  });
});

describe("backup parseBackup", () => {
  it("accepts a valid object and normalizes fields", () => {
    const result = parseBackup({
      version: 1,
      exportedAt: "2026-09-30T00:00:00.000Z",
      items: [{ title: "Dune", type: "book", isbn: "9780441013593", tags: ["sfv", 3] }],
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.backup.items[0].type).toBe("BOOK");
    expect(result.backup.items[0].tags).toEqual(["sfv"]);
    expect(result.backup.items[0].isbn).toBe("9780441013593");
  });

  it("accepts a JSON string", () => {
    const result = parseBackup(JSON.stringify({ version: 1, items: [] }));
    expect(result.ok).toBe(true);
  });

  it("rejects invalid JSON", () => {
    const result = parseBackup("{not json");
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors).toContain("payload is not valid JSON");
  });

  it("rejects a wrong version", () => {
    const result = parseBackup({ version: 99, items: [] });
    expect(result.ok).toBe(false);
  });

  it("reports an item without a title", () => {
    const result = parseBackup({ version: 1, items: [{ type: "BOOK" }] });
    expect(result.ok).toBe(false);
    if (result.ok) return;
    expect(result.errors[0]).toMatch(/missing a title/);
  });

  it("rejects an unknown item type", () => {
    const result = parseBackup({ version: 1, items: [{ title: "X", type: "SPACESHIP" }] });
    expect(result.ok).toBe(false);
  });

  it("requires items to be an array", () => {
    const result = parseBackup({ version: 1, items: {} });
    expect(result.ok).toBe(false);
  });
});

describe("backup planRestore", () => {
  const existing = [
    { id: "a", isbn: "111" },
    { id: "b", isbn: "222" },
  ];

  it("updates by id and by isbn", () => {
    const plan = planRestore(existing, [
      { id: "a", title: "A2", type: "BOOK" },
      { title: "B2", type: "MUSIC", isbn: "222" },
    ]);
    expect(plan.update.map((i) => i.title)).toEqual(["A2", "B2"]);
    expect(plan.create).toHaveLength(0);
  });

  it("creates unknown items", () => {
    const plan = planRestore(existing, [
      { title: "New", type: "BOOK", isbn: "999" },
      { id: "zzz", title: "Fresh", type: "GAME" },
    ]);
    expect(plan.create).toHaveLength(2);
    expect(plan.update).toHaveLength(0);
  });

  it("skips duplicates inside the incoming batch", () => {
    const plan = planRestore(existing, [
      { title: "New", type: "BOOK", isbn: "999" },
      { title: "New again", type: "BOOK", isbn: "999" },
    ]);
    expect(plan.create).toHaveLength(1);
    expect(plan.skipped).toBe(1);
  });

  it("matches isbn case-insensitively", () => {
    const plan = planRestore([{ id: "a", isbn: "ISBN-ABC" }], [
      { title: "Case", type: "BOOK", isbn: "isbn-abc" },
    ]);
    expect(plan.update).toHaveLength(1);
  });
});

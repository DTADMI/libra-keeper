import { parseItemsCsv, splitCsvLine } from "../libra-csv";

describe("splitCsvLine", () => {
  it("gere les guillemets et les virgules internes", () => {
    expect(splitCsvLine('a,"b,c",d')).toEqual(["a", "b,c", "d"]);
    expect(splitCsvLine('"il a dit ""oui""",x')).toEqual(['il a dit "oui"', "x"]);
  });
});

describe("parseItemsCsv", () => {
  it("lit un export Goodreads (Title, Author, ISBN, ISBN13)", () => {
    const csv = [
      "Title,Author,ISBN,ISBN13,My Rating",
      'Dune,Frank Herbert,="0441013597",="9780441013593",5',
      'Le Petit Prince,Antoine de Saint-Exupery,="0156012197",="9780156012195",4',
    ].join("\n");
    const items = parseItemsCsv(csv);
    expect(items).toHaveLength(2);
    expect(items[0]).toMatchObject({
      title: "Dune",
      type: "BOOK",
      author: "Frank Herbert",
      isbn: "9780441013593",
    });
  });

  it("lit un format generique avec type", () => {
    const csv = ["title,author,type,isbn", "Zelda,Nintendo,game,9780000000000"].join("\n");
    const items = parseItemsCsv(csv);
    expect(items[0]?.type).toBe("GAME");
  });

  it("ignore les lignes sans titre", () => {
    const csv = ["title,author", ",Anonyme", "Titre,Alex"].join("\n");
    const items = parseItemsCsv(csv);
    expect(items).toHaveLength(1);
    expect(items[0]?.title).toBe("Titre");
  });

  it("retourne un tableau vide sans entete exploitable", () => {
    expect(parseItemsCsv("Dune,Frank Herbert")).toEqual([]);
  });

  it("rejette un ISBN invalide sans casser la fiche", () => {
    const csv = ["title,isbn", "Livre,abc"].join("\n");
    const items = parseItemsCsv(csv);
    expect(items[0]?.title).toBe("Livre");
    expect(items[0]?.isbn).toBeUndefined();
  });
});

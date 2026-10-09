// Tests de lib/labels.ts : les tables de libelles par type d'item.
//
// L'invariant qui compte : chaque ItemType doit avoir une entree dans CHACUNE des
// cinq tables. Une entree manquante n'echoue pas : elle affiche « undefined » dans
// l'interface, ce qui est bien plus difficile a reperer qu'un plantage.

import { CREATOR_LABELS, IDENTIFIER_LABELS, MAKER_LABELS, TYPE_LABELS, TYPE_SUBTITLE } from "@/lib/labels";
import type { ItemType } from "@/lib/libra-csv";

const ITEM_TYPES: ItemType[] = ["BOOK", "MUSIC", "MOVIE", "GAME", "TOY", "CLOTHES", "OTHER"];

const TABLES: { name: string; table: Record<string, string> }[] = [
  { name: "TYPE_LABELS", table: TYPE_LABELS },
  { name: "TYPE_SUBTITLE", table: TYPE_SUBTITLE },
  { name: "CREATOR_LABELS", table: CREATOR_LABELS },
  { name: "IDENTIFIER_LABELS", table: IDENTIFIER_LABELS },
  { name: "MAKER_LABELS", table: MAKER_LABELS },
];

describe("tables de libelles", () => {
  it("couvre chaque type d'item dans chaque table", () => {
    for (const { table } of TABLES) {
      for (const type of ITEM_TYPES) {
        expect(typeof table[type]).toBe("string");
        expect((table[type] ?? "").length).toBeGreaterThan(0);
      }
    }
  });

  it("ne contient aucune cle etrangere aux types connus", () => {
    for (const { name, table } of TABLES) {
      const extra = Object.keys(table).filter((k) => !ITEM_TYPES.includes(k as ItemType));
      expect(extra).toEqual([]);
    }
  });

  it("donne des libelles distincts la ou la distinction a un sens", () => {
    // Un livre a un auteur, un film a un realisateur : confondre les deux serait
    // une erreur de sens, pas de style.
    expect(CREATOR_LABELS.BOOK).toBe("Author");
    expect(CREATOR_LABELS.MOVIE).toBe("Director");
    expect(CREATOR_LABELS.MUSIC).toBe("Artist");
    expect(IDENTIFIER_LABELS.BOOK).toBe("ISBN");
    expect(IDENTIFIER_LABELS.MUSIC).toBe("UPC");
    expect(MAKER_LABELS.BOOK).toBe("Publisher");
    expect(MAKER_LABELS.MOVIE).toBe("Studio");
  });

  it("distingue le type precis du type generique", () => {
    // Le jouet fait exception et c'est correct : son fabricant EST un « Maker »,
    // donc le libelle generique est ici le libelle exact.
    expect(TYPE_LABELS.BOOK).not.toBe(TYPE_LABELS.OTHER);
    expect(CREATOR_LABELS.GAME).not.toBe(CREATOR_LABELS.OTHER);
    expect(MAKER_LABELS.GAME).toBe("Manufacturer");
    expect(MAKER_LABELS.TOY).toBe(MAKER_LABELS.OTHER);
  });
});

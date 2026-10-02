import { looksLikeIsbn, parseTagsParam, searchTsConfig } from "../search";

describe("looksLikeIsbn", () => {
  it("reconnait les ISBN-13 et ISBN-10", () => {
    expect(looksLikeIsbn("9780306406157")).toBe(true);
    expect(looksLikeIsbn("978-0-306-40615-7")).toBe(true);
    expect(looksLikeIsbn("080442957X")).toBe(true);
    expect(looksLikeIsbn("0-8044-2957-x")).toBe(true);
  });

  it("rejette les requetes textuelles et les longueurs invalides", () => {
    expect(looksLikeIsbn("dune")).toBe(false);
    expect(looksLikeIsbn("12345")).toBe(false);
    expect(looksLikeIsbn("978030640615")).toBe(false);
    expect(looksLikeIsbn("")).toBe(false);
  });
});

describe("searchTsConfig", () => {
  it("utilise la configuration simple pour un ISBN", () => {
    expect(searchTsConfig("9780306406157")).toBe("simple");
  });

  it("utilise la configuration francaise pour le reste", () => {
    expect(searchTsConfig("Le Petit Prince")).toBe("french");
    expect(searchTsConfig("  dune  ")).toBe("french");
  });
});

describe("parseTagsParam", () => {
  it("normalise, minuscule et deduplique", () => {
    expect(parseTagsParam("SF, aventure ,SF")).toEqual(["sf", "aventure"]);
  });

  it("retourne un tableau vide sans valeur", () => {
    expect(parseTagsParam(null)).toEqual([]);
    expect(parseTagsParam("")).toEqual([]);
    expect(parseTagsParam("  ,  ")).toEqual([]);
  });
});

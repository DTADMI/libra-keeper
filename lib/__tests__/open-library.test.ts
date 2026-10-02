import { enrichCoverImage, isValidIsbn, normalizeIsbn, openLibraryCoverUrl } from "../open-library";

describe("normalizeIsbn", () => {
  it("retire tirets et espaces et passe la lettre X en majuscule", () => {
    expect(normalizeIsbn("978-0-306-40615-7")).toBe("9780306406157");
    expect(normalizeIsbn("0-8044-2957-x")).toBe("080442957X");
  });
});

describe("isValidIsbn", () => {
  it("accepte 10 et 13 caracteres, refuse le reste", () => {
    expect(isValidIsbn("9780306406157")).toBe(true);
    expect(isValidIsbn("080442957X")).toBe(true);
    expect(isValidIsbn("12345")).toBe(false);
    expect(isValidIsbn("")).toBe(false);
  });
});

describe("openLibraryCoverUrl", () => {
  it("construit l'URL de couverture", () => {
    expect(openLibraryCoverUrl("978-0-306-40615-7")).toBe(
      "https://covers.openlibrary.org/b/isbn/9780306406157-M.jpg",
    );
    expect(openLibraryCoverUrl("9780306406157", "L")).toContain("-L.jpg");
  });

  it("renvoie null pour un ISBN invalide", () => {
    expect(openLibraryCoverUrl("nope")).toBeNull();
  });
});

describe("enrichCoverImage", () => {
  it("garde la couverture fournie", () => {
    expect(enrichCoverImage("https://cdn/x.jpg", "9780306406157")).toBe("https://cdn/x.jpg");
  });

  it("derive la couverture de l'ISBN sinon", () => {
    expect(enrichCoverImage(null, "9780306406157")).toBe(
      "https://covers.openlibrary.org/b/isbn/9780306406157-M.jpg",
    );
  });

  it("renvoie null sans couverture ni ISBN exploitable", () => {
    expect(enrichCoverImage(null, null)).toBeNull();
    expect(enrichCoverImage("", "nope")).toBeNull();
  });
});

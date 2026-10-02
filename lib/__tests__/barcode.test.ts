import { getBarcodeDetector, isBarcodeScanSupported, normalizeScannedIsbn } from "../barcode";

describe("normalizeScannedIsbn", () => {
  it("accepte un ISBN-13, avec ou sans tirets", () => {
    expect(normalizeScannedIsbn("978-0-306-40615-7")).toBe("9780306406157");
    expect(normalizeScannedIsbn("9780306406157")).toBe("9780306406157");
  });

  it("accepte un ISBN-10 termine par X", () => {
    expect(normalizeScannedIsbn("080442957X")).toBe("080442957X");
    expect(normalizeScannedIsbn("0-8044-2957-x")).toBe("080442957X");
  });

  it("rejette les longueurs invalides ou une valeur vide", () => {
    expect(normalizeScannedIsbn("")).toBeNull();
    expect(normalizeScannedIsbn("12345")).toBeNull();
    expect(normalizeScannedIsbn("abcd")).toBeNull();
  });
});

describe("getBarcodeDetector", () => {
  afterEach(() => {
    delete (globalThis as Record<string, unknown>).BarcodeDetector;
  });

  it("retourne null quand l API est absente", () => {
    expect(getBarcodeDetector()).toBeNull();
    expect(isBarcodeScanSupported()).toBe(false);
  });

  it("retourne le constructeur quand l API existe", () => {
    const fake = class {};
    (globalThis as Record<string, unknown>).BarcodeDetector = fake;
    expect(getBarcodeDetector()).toBe(fake);
    expect(isBarcodeScanSupported()).toBe(true);
  });
});

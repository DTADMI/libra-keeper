// ─────────────────────────────────────────────────────────
// LibraKeeper - lecture de code-barres ISBN (feature B3)
//
// Le scan utilise l'API navigateur BarcodeDetector quand elle existe (Chromium).
// Les fonctions pures (normalisation, disponibilite) sont testables ; le reste
// du scan vit dans le composant ISBNLookup.
// ─────────────────────────────────────────────────────────

export interface DetectedBarcode {
  rawValue: string;
}

export interface BarcodeDetectorLike {
  detect(source: CanvasImageSource): Promise<DetectedBarcode[]>;
}

export interface BarcodeDetectorCtor {
  new (options?: { formats?: string[] }): BarcodeDetectorLike;
}

/** Ctor BarcodeDetector du navigateur, ou null s'il n'existe pas. */
export function getBarcodeDetector(): BarcodeDetectorCtor | null {
  if (typeof globalThis === "undefined") return null;
  const scope = globalThis as unknown as { BarcodeDetector?: BarcodeDetectorCtor };
  return typeof scope.BarcodeDetector === "function" ? scope.BarcodeDetector : null;
}

export function isBarcodeScanSupported(): boolean {
  return getBarcodeDetector() !== null;
}

/**
 * Normalise une valeur lue : ne garde que les chiffres et un X final, et exige
 * une longueur ISBN-10 ou ISBN-13. Retourne null si non exploitable.
 */
export function normalizeScannedIsbn(raw: string): string | null {
  if (!raw) return null;
  const clean = raw.replace(/[^0-9Xx]/g, "").toUpperCase();
  return clean.length === 10 || clean.length === 13 ? clean : null;
}

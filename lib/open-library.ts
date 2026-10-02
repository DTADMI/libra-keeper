// ─────────────────────────────────────────────────────────
// LibraKeeper - enrichissement des fiches via Open Library (feature B7)
//
// Open Library expose une couverture par ISBN a une URL stable, sans cle d'API :
//   https://covers.openlibrary.org/b/isbn/{isbn}-{S|M|L}.jpg
// On s'en sert comme couverture par defaut quand l'utilisateur n'en fournit pas.
// Aucun appel reseau ici : on ne construit que l'URL (testable et sans latence).
// ─────────────────────────────────────────────────────────

const ISBN_CLEAN_RE = /[^0-9Xx]/g;

export type CoverSize = "S" | "M" | "L";

/** Nettoie un ISBN (retire tirets et espaces) ; X final conserve pour ISBN-10. */
export function normalizeIsbn(isbn: string): string {
  return isbn.replace(ISBN_CLEAN_RE, "").toUpperCase();
}

/** Vrai si l'ISBN nettoye a une longueur valide (10 ou 13 chiffres). */
export function isValidIsbn(isbn: string): boolean {
  const clean = normalizeIsbn(isbn);
  return clean.length === 10 || clean.length === 13;
}

/** URL de couverture Open Library, ou null si l'ISBN est invalide. */
export function openLibraryCoverUrl(isbn: string, size: CoverSize = "M"): string | null {
  if (!isValidIsbn(isbn)) return null;
  return `https://covers.openlibrary.org/b/isbn/${normalizeIsbn(isbn)}-${size}.jpg`;
}

/**
 * Couverture a enregistrer : celle fournie si presente, sinon celle d'Open
 * Library derivee de l'ISBN, sinon rien.
 */
export function enrichCoverImage(
  coverImage?: string | null,
  isbn?: string | null,
): string | null {
  if (coverImage && coverImage.trim()) return coverImage;
  if (isbn && isbn.trim()) return openLibraryCoverUrl(isbn);
  return coverImage ?? null;
}

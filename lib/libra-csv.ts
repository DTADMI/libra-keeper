// ─────────────────────────────────────────────────────────
// LibraKeeper - import CSV d'ouvrages (feature B6)
//
// Parseur pur (sans Prisma ni React) pour migrer un inventaire depuis un
// export de tableur. Reconnait les entetes Goodreads et un format generique.
// La creation des fiches est faite par POST /api/items/bulk.
// ─────────────────────────────────────────────────────────

export type ItemType = "BOOK" | "MUSIC" | "MOVIE" | "GAME" | "TOY" | "CLOTHES" | "OTHER";

export interface ParsedItem {
  title: string;
  type: ItemType;
  author?: string;
  publisher?: string;
  isbn?: string;
  description?: string;
}

/** Decoupe une ligne CSV en respectant les guillemets. */
export function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]!;
    if (quoted) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') {
        quoted = false;
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      quoted = true;
    } else if (ch === ",") {
      out.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

const TYPE_BY_LABEL: Record<string, ItemType> = {
  book: "BOOK",
  music: "MUSIC",
  cd: "MUSIC",
  movie: "MOVIE",
  film: "MOVIE",
  dvd: "MOVIE",
  game: "GAME",
  toy: "TOY",
  clothes: "CLOTHES",
  other: "OTHER",
};

function pick(cols: string[], header: string[], names: string[]): string | undefined {
  for (const name of names) {
    const idx = header.indexOf(name);
    if (idx >= 0) {
      const value = (cols[idx] ?? "").trim();
      if (value) return value;
    }
  }
  return undefined;
}

/** Normalise un ISBN Goodreads (souvent ecrit ="9780123456789"). */
function cleanIsbn(value: string | undefined): string | undefined {
  if (!value) return undefined;
  const clean = value.replace(/[^0-9Xx]/g, "");
  return clean.length === 10 || clean.length === 13 ? clean.toUpperCase() : undefined;
}

/**
 * Parse un CSV d'ouvrages. Retourne une fiche par ligne exploitable (titre
 * present). Un entete est requis pour mapper les colonnes ; les alias Goodreads
 * (Title, Author, ISBN, ISBN13) et generiques (title, author, isbn...) sont reconnus.
 */
export function parseItemsCsv(text: string): ParsedItem[] {
  const lines = text.replace(/\r\n/g, "\n").split("\n").filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  const header = splitCsvLine(lines[0]!).map((h) => h.trim().toLowerCase());
  const items: ParsedItem[] = [];

  for (const line of lines.slice(1)) {
    const cols = splitCsvLine(line);
    const title = pick(cols, header, ["title", "name", "nom", "titre"]);
    if (!title) continue;

    const typeLabel = (pick(cols, header, ["type", "media", "format"]) ?? "book").toLowerCase();
    const item: ParsedItem = {
      title,
      type: TYPE_BY_LABEL[typeLabel.replace(/[^a-z]/g, "")] ?? "BOOK",
    };

    const author = pick(cols, header, ["author", "auteur", "writer"]);
    const publisher = pick(cols, header, ["publisher", "editeur", "éditeur"]);
    const isbn = cleanIsbn(pick(cols, header, ["isbn13", "isbn", "isbn10", "ean"]));
    const description = pick(cols, header, ["description", "summary", "resume", "résumé"]);
    if (author) item.author = author;
    if (publisher) item.publisher = publisher;
    if (isbn) item.isbn = isbn;
    if (description) item.description = description;

    items.push(item);
  }

  return items;
}

// ── Ecriture CSV (export admin) ──────────────────────────────────────────────
// L'export admin inserait les valeurs telles quelles (guillemets doubles a la
// main, aucune neutralisation) : un titre ou un auteur commencant par =, + ou @
// s'execute a l'ouverture dans un tableur (OWASP CSV injection), et une valeur
// contenant une virgule cassait la ligne. L'echappement vit ici, a cote du parseur.

/** Neutralise une formule, puis echappe la cellule (guillemets doubles). */
export function escapeCsvCell(value: unknown): string {
  const cell = value === null || value === undefined ? "" : String(value);
  const neutral =
    /^[=+\-@\t\r]/.test(cell) && !/^[+-]?\d+([.,]\d+)?$/.test(cell) ? "'" + cell : cell;
  return /[",\n\r]/.test(neutral) ? `"${neutral.replace(/"/g, '""')}"` : neutral;
}

/** En-tete + lignes CSV, chaque cellule echappee par escapeCsvCell. */
export function toCsv(
  headers: readonly string[],
  rows: ReadonlyArray<ReadonlyArray<unknown>>,
): string {
  const lines = [headers.map(escapeCsvCell).join(",")];
  for (const row of rows) lines.push(row.map(escapeCsvCell).join(","));
  return lines.join("\n");
}

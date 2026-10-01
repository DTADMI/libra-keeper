/**
 * lib/backup.ts - Pure helpers for Libra Keeper JSON backup and restore (B8).
 *
 * No Prisma / next imports so the logic is unit-testable and reusable by the
 * admin API route. The format is intentionally small and stable:
 *
 * {
 *   "version": 1,
 *   "exportedAt": "2026-09-30T...",
 *   "count": 12,
 *   "items": [ { "id": "...", "title": "...", "type": "BOOK", ... } ]
 * }
 */

export const BACKUP_VERSION = 1;

export interface BackupItem {
  id?: string;
  title: string;
  description?: string | null;
  type: string;
  status?: string;
  coverImage?: string | null;
  isbn?: string | null;
  author?: string | null;
  publisher?: string | null;
  publishedAt?: string | null;
  metadata?: Record<string, unknown> | null;
  tags?: string[];
}

export interface BackupFile {
  version: number;
  exportedAt: string;
  count: number;
  items: BackupItem[];
}

export interface BackupParseSuccess {
  ok: true;
  backup: BackupFile;
}

export interface BackupParseFailure {
  ok: false;
  errors: string[];
}

export type BackupParseResult = BackupParseSuccess | BackupParseFailure;

export interface ExistingItemKey {
  id: string;
  isbn?: string | null;
}

export interface RestorePlan {
  create: BackupItem[];
  update: BackupItem[];
  skipped: number;
}

const ITEM_TYPES = new Set(["BOOK", "MUSIC", "MOVIE", "GAME", "TOY", "CLOTHES", "OTHER"]);

function asString(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function normalizeItem(raw: unknown, index: number, errors: string[]): BackupItem | null {
  if (typeof raw !== "object" || raw === null) {
    errors.push(`items[${index}] is not an object`);
    return null;
  }
  const record = raw as Record<string, unknown>;

  const title = asString(record.title);
  if (!title) {
    errors.push(`items[${index}] is missing a title`);
    return null;
  }

  const rawType = asString(record.type) ?? "OTHER";
  const type = rawType.toUpperCase();
  if (!ITEM_TYPES.has(type)) {
    errors.push(`items[${index}] has unknown type "${rawType}"`);
    return null;
  }

  const tags = Array.isArray(record.tags)
    ? record.tags.filter((t): t is string => typeof t === "string")
    : undefined;

  return {
    id: asString(record.id) ?? undefined,
    title,
    description: typeof record.description === "string" ? record.description : null,
    type,
    status: asString(record.status) ?? undefined,
    coverImage: typeof record.coverImage === "string" ? record.coverImage : null,
    isbn: asString(record.isbn),
    author: typeof record.author === "string" ? record.author : null,
    publisher: typeof record.publisher === "string" ? record.publisher : null,
    publishedAt: asString(record.publishedAt),
    metadata:
      typeof record.metadata === "object" && record.metadata !== null
        ? (record.metadata as Record<string, unknown>)
        : null,
    tags,
  };
}

/**
 * Build a versioned backup envelope from a list of items.
 */
export function createBackup(items: BackupItem[], exportedAt: Date = new Date()): BackupFile {
  return {
    version: BACKUP_VERSION,
    exportedAt: exportedAt.toISOString(),
    count: items.length,
    items,
  };
}

/**
 * Validate and normalize an unknown backup payload (object or JSON string).
 */
export function parseBackup(input: unknown): BackupParseResult {
  let data = input;
  if (typeof input === "string") {
    try {
      data = JSON.parse(input);
    } catch {
      return { ok: false, errors: ["payload is not valid JSON"] };
    }
  }

  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    return { ok: false, errors: ["payload must be a backup object"] };
  }

  const record = data as Record<string, unknown>;
  const errors: string[] = [];

  if (record.version !== BACKUP_VERSION) {
    errors.push(`unsupported backup version (expected ${BACKUP_VERSION})`);
  }
  if (!Array.isArray(record.items)) {
    errors.push("items must be an array");
    return { ok: false, errors };
  }

  const items: BackupItem[] = [];
  record.items.forEach((raw, index) => {
    const normalized = normalizeItem(raw, index, errors);
    if (normalized) {items.push(normalized);}
  });

  if (errors.length > 0) {return { ok: false, errors };}

  return {
    ok: true,
    backup: {
      version: BACKUP_VERSION,
      exportedAt: asString(record.exportedAt) ?? new Date().toISOString(),
      count: items.length,
      items,
    },
  };
}

/**
 * Decide what to create, update or skip on restore. Matching is by `id` first,
 * then by `isbn` (case-insensitive). An item with no usable key is created.
 */
export function planRestore(existing: ExistingItemKey[], incoming: BackupItem[]): RestorePlan {
  const byId = new Map(existing.map((e) => [e.id, e]));
  const byIsbn = new Map(
    existing.filter((e) => e.isbn).map((e) => [e.isbn!.trim().toLowerCase(), e])
  );

  const create: BackupItem[] = [];
  const update: BackupItem[] = [];
  const queuedIds = new Set<string>();
  const queuedIsbns = new Set<string>();
  let skipped = 0;

  for (const item of incoming) {
    const isbnKey = item.isbn ? item.isbn.trim().toLowerCase() : null;
    const matchById = item.id ? byId.get(item.id) : undefined;
    const matchByIsbn = isbnKey ? byIsbn.get(isbnKey) : undefined;
    const match = matchById ?? matchByIsbn;

    if (match) {
      update.push({ ...item, id: match.id });
      continue;
    }

    const alreadyQueued =
      (item.id && queuedIds.has(item.id)) || (isbnKey && queuedIsbns.has(isbnKey));
    if (alreadyQueued) {
      skipped += 1;
      continue;
    }

    create.push(item);
    if (item.id) {queuedIds.add(item.id);}
    if (isbnKey) {queuedIsbns.add(isbnKey);}
  }

  return { create, update, skipped };
}

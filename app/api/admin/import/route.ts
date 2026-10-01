// src/app/api/admin/import/route.ts
//
// Restore a Libra Keeper JSON backup (B8). Admin only. Matching is by id then
// by isbn (see lib/backup.ts). Unknown items are created, known ones updated,
// duplicates inside the same payload skipped.
import type { ItemStatus, ItemType, Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { getServerAuth } from "@/lib/auth-utils";
import { type BackupItem,createBackup, parseBackup, planRestore } from "@/lib/backup";
import { prisma } from "@/lib/db";
import { logger } from "@/lib/logger";
import { withProtection } from "@/lib/security/protection";

const MAX_ITEMS = 5000;

function toDate(value: string | null | undefined): Date | null {
  if (!value) {return null;}
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function toItemData(item: BackupItem): Prisma.ItemCreateInput {
  return {
    title: item.title,
    description: item.description ?? null,
    type: item.type as ItemType,
    status: (item.status as ItemStatus | undefined) ?? undefined,
    coverImage: item.coverImage ?? null,
    isbn: item.isbn ?? null,
    author: item.author ?? null,
    publisher: item.publisher ?? null,
    publishedAt: toDate(item.publishedAt),
    metadata: (item.metadata ?? {}) as Prisma.InputJsonValue,
    tags: {
      connectOrCreate: (item.tags ?? []).map((name) => ({
        where: { name },
        create: { name },
      })),
    },
  };
}

async function _POST(req: Request) {
  try {
    const session = await getServerAuth();
    if (!session.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const payload = await req.json();
    const parsed = parseBackup(payload);
    if (!parsed.ok) {
      return NextResponse.json({ errors: parsed.errors }, { status: 422 });
    }

    const incoming = parsed.backup.items;
    if (incoming.length > MAX_ITEMS) {
      return NextResponse.json(
        { errors: [`too many items (max ${MAX_ITEMS})`] },
        { status: 422 }
      );
    }

    const existing = await prisma.item.findMany({ select: { id: true, isbn: true } });
    const plan = planRestore(existing, incoming);

    const result = await prisma.$transaction(async (tx) => {
      for (const item of plan.update) {
        await tx.item.update({ where: { id: item.id! }, data: toItemData(item) });
      }
      for (const item of plan.create) {
        await tx.item.create({ data: toItemData(item) });
      }
      return { created: plan.create.length, updated: plan.update.length };
    });

    logger.info(
      `Backup restore: ${result.created} created, ${result.updated} updated, ${plan.skipped} skipped`
    );

    return NextResponse.json({
      version: parsed.backup.version,
      created: result.created,
      updated: result.updated,
      skipped: plan.skipped,
    });
  } catch (error) {
    logger.error("Error restoring backup", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

// Build a fresh backup envelope (mirrors the GET export, useful for round-trips).
async function _GET() {
  try {
    const session = await getServerAuth();
    if (!session.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const items = await prisma.item.findMany({ include: { tags: true } });
    const backup = createBackup(
      items.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        type: item.type,
        status: item.status,
        coverImage: item.coverImage,
        isbn: item.isbn,
        author: item.author,
        publisher: item.publisher,
        publishedAt: item.publishedAt?.toISOString() ?? null,
        metadata: (item.metadata ?? {}) as Record<string, unknown>,
        tags: item.tags.map((tag) => tag.name),
      }))
    );

    return NextResponse.json(backup, {
      headers: {
        "Content-Disposition": `attachment; filename="librakeeper-backup-${backup.exportedAt.split("T")[0]}.json"`,
      },
    });
  } catch (error) {
    logger.error("Error building backup", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export const POST = withProtection(_POST, { scope: "admin", limit: 10, windowSeconds: 60 });
export const GET = withProtection(_GET, { scope: "admin", limit: 30, windowSeconds: 60 });

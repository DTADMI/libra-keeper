// lib/db.ts — Prisma client with pg adapter (React.cache for multi-component dedup)
import "server-only";

import { cache } from "react";
import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "@prisma/client";
import { Pool } from "pg";

declare global {
  var prisma: PrismaClient | undefined;
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn("[build] DATABASE_URL is not set — Prisma will use fallback.");
}

const pool = new Pool({ connectionString: databaseUrl ?? "" });
const adapter = new PrismaPg(pool);

const prismaOptions = {
  log:
    process.env.NODE_ENV === "development"
      ? (["query", "error", "warn"] as Prisma.LogLevel[])
      : (["error"] as Prisma.LogLevel[]),
  adapter,
};

const _getPrisma = () => global.prisma || new PrismaClient(prismaOptions);

export const prisma: PrismaClient = cache(_getPrisma)();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;

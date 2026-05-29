// src/lib/db.ts
import "server-only";

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

// Configure the Prisma client with appropriate logging
const prismaOptions = {
  log:
    process.env.NODE_ENV === "development"
      ? (["query", "error", "warn"] as Prisma.LogLevel[])
      : (["error"] as Prisma.LogLevel[]),
  adapter,
};

export const prisma: PrismaClient = global.prisma || new PrismaClient(prismaOptions);

// In development, store the Prisma instance in the global object to prevent hot-reloading issues
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;

// src/lib/db.ts
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

declare global {
  // Allow global `prisma` to prevent multiple instances in development
  var prisma: PrismaClient | undefined
}

// Check if DATABASE_URL is set
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set")
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)

// Configure the Prisma client with appropriate logging
const prismaOptions = {
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  adapter,
}

export const prisma: PrismaClient = global.prisma || new PrismaClient(prismaOptions)

// In development, store the Prisma instance in the global object to prevent hot-reloading issues
if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma
}

export default prisma

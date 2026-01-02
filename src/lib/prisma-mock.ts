import { PrismaClient } from "@prisma/client"
import { DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended"

import { prisma } from "./db"

// Mock the entire db module before importing it
jest.mock("./db", () => ({
  __esModule: true,
  prisma: mockDeep<PrismaClient>(),
}));

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>

beforeEach(() => {
  mockReset(prismaMock)
});

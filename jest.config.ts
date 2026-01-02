// jest.config.ts
import type { Config } from "jest"
import nextJest from "next/jest.js"

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const config: Config.InitialOptions = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  // Add more setup options before each test is run
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testPathIgnorePatterns: ["<rootDir>/e2e/"],
  collectCoverageFrom: [
    "src/lib/**/*.{js,jsx,ts,tsx}",
    "src/app/api/items/route.ts",
    "!src/lib/db.ts",
    "!src/lib/prisma.ts",
    "!src/lib/mail.ts",
    "!src/lib/utils.ts",
    "!src/**/*.d.ts",
    "!src/__tests__/**",
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  // No need for transformIgnorePatterns with createJestConfig for ESM in node_modules usually,
  // but if needed, it should be outside createJestConfig if it's not working.
  // Actually, createJestConfig(config) might overwrite transformIgnorePatterns.
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
const asyncConfig = createJestConfig(config)

export default async () => {
  const res = await asyncConfig()
  res.transformIgnorePatterns = res.transformIgnorePatterns?.map((pattern: string) => {
    if (pattern === "/node_modules/") {
      return "/node_modules/(?!(@auth|next-auth|@prisma)/)"
    }
    return pattern
  }) || ["/node_modules/(?!(@auth|next-auth|@prisma)/)"];
  return res
};

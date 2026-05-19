// scripts/install-git-hooks.mjs
// Installs the repo's Git hooks by pointing Git at the .githooks/ directory.
// Run: node scripts/install-git-hooks.mjs

import { execSync } from "child_process";
import { chmodSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

console.log("Libra Keeper — Installing Git hooks...");

// Set git config to use our hooks directory
execSync("git config core.hooksPath .githooks", {
  cwd: projectRoot,
  stdio: "inherit",
});

// Make pre-commit executable
const preCommitHook = resolve(projectRoot, ".githooks", "pre-commit");
if (existsSync(preCommitHook)) {
  try {
    chmodSync(preCommitHook, 0o755);
  } catch {
    // chmod may not be available on Windows — git handles it
  }
}

console.log("✓ Git hooks installed successfully.");
console.log("  Pre-commit: pnpm lint → pnpm typecheck → pnpm test");

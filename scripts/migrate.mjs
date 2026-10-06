#!/usr/bin/env node
/**
 * Outillage de migration de Libra Keeper : appliquer, valider, rapporter.
 *
 * Regle NF : chaque migration doit avoir une paire rollout/rollback. Sans cela,
 * une migration qui casse ne peut pas etre defaite, et personne ne s'en apercoit
 * tant que tout va bien. `validate` est donc le coeur de cet outil, et il ne
 * demande AUCUNE base de donnees : il lit le depot et sort en code 1 sur un
 * manque. C'est ce qui le rend utilisable dans un hook.
 *
 * Usage :
 *   node scripts/migrate.mjs validate                 (ne touche pas la base)
 *   node scripts/migrate.mjs report                   (tableau de l'etat)
 *   node scripts/migrate.mjs apply --env .env.local   (applique les rollouts)
 *   node scripts/migrate.mjs apply --env .env --dry-run
 */

import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const MIGRATION_DIRS = [path.join(ROOT, "supabase", "migrations"), path.join(ROOT, "scripts")];
const NUMBERED = /^(\d{3,})_([a-z0-9_]+)\.sql$/i;
const ROLLOUT = /^(\d{3,})_([a-z0-9_]+)\.rollout\.sql$/i;
const ROLLBACK = /^(\d{3,})_([a-z0-9_]+)\.rollback\.sql$/i;

const args = process.argv.slice(2);
const command = args[0] ?? "report";
const envIndex = args.findIndex((arg) => arg === "--env" || arg === "-e");
const envFile = envIndex >= 0 ? args[envIndex + 1] : null;
const dryRun = args.includes("--dry-run");

/** Inventorie toutes les migrations connues, en ignorant les doublons de dossier. */
export function inventory() {
  const byNumber = new Map();
  for (const dir of MIGRATION_DIRS) {
    let entries = [];
    try {
      entries = fs.readdirSync(dir);
    } catch {
      continue;
    }
    for (const entry of entries) {
      const rollout = entry.match(ROLLOUT);
      const rollback = entry.match(ROLLBACK);
      const plain = entry.match(NUMBERED);
      const match = rollout ?? rollback ?? plain;
      if (!match) continue;
      const number = match[1];
      const name = match[2];
      const record = byNumber.get(number) ?? { number, name, rollout: null, rollback: null, plain: null };
      const full = path.join(dir, entry);
      if (rollout) record.rollout = full;
      else if (rollback) record.rollback = full;
      else if (!record.plain) record.plain = full;
      byNumber.set(number, record);
    }
  }
  return [...byNumber.values()].sort((a, b) => Number(a.number) - Number(b.number));
}

/** Verifie la paire rollout/rollback et la coherence des numeros. */
export function validate(records) {
  const problems = [];
  const seen = new Set();
  for (const record of records) {
    if (seen.has(record.number)) {
      problems.push(`${record.number}_${record.name} : numero en double`);
    }
    seen.add(record.number);
    if (!record.rollout && !record.plain) {
      problems.push(`${record.number}_${record.name} : aucun script a appliquer (ni .sql ni .rollout.sql)`);
    }
    if (!record.rollback) {
      // Un marqueur motive vaut mieux qu'un contournement silencieux : la migration
      // fondatrice qui detruirait des donnees en se defaisant doit le DIRE, et le
      // controle verifie que la raison est ecrite noir sur blanc.
      const source = [record.plain, record.rollout].filter(Boolean)[0];
      const header = source ? fs.readFileSync(source, "utf8").slice(0, 600) : "";
      const documented = /^--\s*rollback:\s*not-reversible\s*-\s*\S.{10,}/m.test(header);
      if (!documented) {
        problems.push(
          `${record.number}_${record.name} : aucun .rollback.sql et aucune justification ` +
            "(-- rollback: not-reversible - <raison>)",
        );
      } else {
        record.documentedIrreversible = true;
      }
    }
  }
  return problems;
}

function report(records) {
  console.log("\n  Numero  Nom                                Rollout  Rollback  Fichier seul");
  console.log("  " + "-".repeat(76));
  for (const record of records) {
    const mark = (value) => (value ? "  oui  " : "  NON  ");
    console.log(
      `  ${record.number.padEnd(6)}  ${record.name.padEnd(33)}${mark(record.rollout)}${mark(record.rollback)}` +
        `   ${record.plain ? "oui" : "-"}`,
    );
  }
  console.log(`\n  ${records.length} migration(s) inventoriee(s).`);
}

function applyEnvFile(file) {
  if (!file) return;
  const resolved = path.isAbsolute(file) ? file : path.join(ROOT, file);
  if (!fs.existsSync(resolved)) {
    console.error(`Fichier d'environnement introuvable : ${resolved}`);
    process.exit(1);
  }
  for (const line of fs.readFileSync(resolved, "utf8").split(/\r?\n/)) {
    if (!line || line.trim().startsWith("#")) continue;
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    let value = match[2] ?? "";
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[match[1]] = value;
  }
}

async function apply(records) {
  if (!envFile) {
    console.error("Indiquer un fichier d'environnement : --env .env.local");
    process.exit(1);
  }
  const problems = validate(records);
  if (problems.length > 0) {
    console.error("Validation refusee avant toute application :");
    for (const problem of problems) console.error(`  - ${problem}`);
    console.error("Corriger les paires rollout/rollback, puis relancer.");
    process.exit(1);
  }
  applyEnvFile(envFile);
  const connectionString =
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_DB_URL);
  if (!connectionString) {
    console.error("Aucune chaine de connexion : definir POSTGRES_URL_NON_POOLING ou DATABASE_URL.");
    process.exit(1);
  }
  const { default: pg } = await import("pg");
  const client = new pg.Client({
    connectionString: connectionString.replace("sslmode=require", "sslmode=no-verify"),
    ssl: connectionString.includes("localhost") ? false : { rejectUnauthorized: false },
  });
  await client.connect();
  try {
    await client.query("create table if not exists nf_migrations (number text primary key, name text, applied_at timestamptz default now())");
    const { rows } = await client.query("select number from nf_migrations");
    const applied = new Set(rows.map((row) => row.number));
    let count = 0;
    for (const record of records) {
      if (applied.has(record.number)) continue;
      const file = record.rollout ?? record.plain;
      const sql = fs.readFileSync(file, "utf8").replace(/^\uFEFF/, "");
      console.log(`${dryRun ? "[simulation] " : ""}applique ${record.number}_${record.name}`);
      if (dryRun) continue;
      await client.query("begin");
      try {
        await client.query(sql);
        await client.query("insert into nf_migrations (number, name) values ($1, $2)", [record.number, record.name]);
        await client.query("commit");
        count += 1;
      } catch (error) {
        await client.query("rollback");
        console.error(`ECHEC sur ${record.number}_${record.name} : ${error.message}`);
        process.exit(1);
      }
    }
    console.log(`${count} migration(s) appliquee(s).`);
  } finally {
    await client.end();
  }
}

// Le module est importable (pour les tests) sans executer d'effet de bord.
if (import.meta.url === `file://${process.argv[1]}`) {
  const records = inventory();
  if (command === "validate") {
    const problems = validate(records);
    for (const problem of problems) console.log(`GAP  ${problem}`);
    console.log(
      `\nmigrate validate : ${records.length} migration(s), ${problems.length} probleme(s).`,
    );
    process.exit(problems.length > 0 ? 1 : 0);
  } else if (command === "report") {
    report(records);
  } else if (command === "apply") {
    await apply(records);
  } else {
    console.error(`Commande inconnue : ${command} (attendu : validate, report, apply)`);
    process.exit(1);
  }
}

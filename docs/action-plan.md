# Action Plan - Libra Keeper

**Last Updated**: 2026-08-20

## Legend

| Symbol | Meaning |
|--------|---------|
| ✅ Done | Completed |
| 🔵 In Progress | Currently being worked on |
| 🟡 Planned | Scheduled but not started |
| ❌ Blocked | Cannot proceed due to external dependency |
| 🔴 Critical | Needs immediate attention |

## Phase 1: Foundation (Complete)

| # | Task | Status |
|---|------|--------|
| 1 | Next.js 16 scaffold with App Router | ✅ Done |
| 2 | AGENTS.md with hard rules | ✅ Done |
| 3 | Prisma ORM with 19 models, pg adapter on Supabase | ✅ Done |
| 4 | Supabase Auth with @supabase/ssr | ✅ Done |
| 5 | Feature flags (13 flags, Redis-backed) | ✅ Done |
| 6 | i18n with default fr (EN/FR) - next-intl | ✅ Done |
| 7 | Encoding reference and fix scripts | ✅ Done |
| 8 | Pre-commit hooks (lint, typecheck, test, supabase-security, build) | ✅ Done |
| 9 | PPR enabled (experimental.ppr: 'incremental') | ✅ Done |
| 10 | Version pinning: Node >=24.0.0, pnpm 11.5.0 | ✅ Done |
| 11 | Radix UI optimizePackageImports (20 packages) | ✅ Done |

## Phase 2: Core Features (Complete)

| # | Task | Status |
|---|------|--------|
| 1 | Item management (books, music, movies, games, toys, clothes) | ✅ Done |
| 2 | Barcode/ISBN scanning via html5-qrcode | ✅ Done |
| 3 | Loan management with waitlist | ✅ Done |
| 4 | Messaging system | ✅ Done |
| 5 | Activity feed | ✅ Done |
| 6 | Calendar view for loans | ✅ Done |
| 7 | Bulk import (CSV/Goodreads) | ✅ Done |
| 8 | Email reminders via Resend | ✅ Done |
| 9 | PWA support | ✅ Done |
| 10 | Full-text search (PostgreSQL tsvector) | ✅ Done |
| 11 | Admin dashboard with feature flag toggles | ✅ Done |

## Phase 3: Remaining Gaps (3 items - minor)

| # | Gap | Priority | Status |
|---|-----|----------|--------|
| 1 | Cross-project i18n Context pattern migration (currently using next-intl) | Low | 🟡 Planned |
| 2 | Testing coverage expansion (current: 18 feature flags, basic unit coverage) | Medium | 🟡 Planned |
| 3 | Performance optimization doc audit | Low | 🟡 Planned |

## Standard Docs Status

| Document | Status |
|---|---|
| `docs/README.md` | ✅ |
| `docs/technical/performance-optimization.md` | ✅ |
| `docs/technical/encoding-reference.md` | ✅ |
| `docs/technical/feature-flags-testing.md` | ✅ |
| `docs/action-plan.md` | ✅ (this document) |
| `docs/technical/gaps-roadmap.md` | ❌ (covered by action-plan.md) |

## Version Compliance

| Requirement | Current | Target |
|-------------|---------|--------|
| Node.js | 26.10.0 (`.nvmrc`/`.node-version`) | 26.10.0 |
| pnpm | 12.8.1 (`packageManager`) | 12.8.1 |

---

## Backlog - features manquantes / pertinentes (recherche 2026-09-30)

Priorite : P1 (fort impact), P2 (utile), P3 (confort). Effort : S/M/L.

| # | Feature | Pourquoi | Prio | Effort | Statut |
|---|---------|----------|------|--------|--------|
| B1 | Rate limiting + cache Redis | Ecrit dans `platform-architecture-comparison.md` comme piece manquante ; protege les routes API et reduit la charge Postgres | P1 | M | ⏳ a faire |
| B2 | Notifications d'echeance (courriel/push) | Un emprunt qui arrive a echeance est le cas d'usage central ; aujourd'hui purement passif | P1 | M | ⏳ a faire |
| B3 | Scan ISBN / code-barres a l'ajout | Reduit la saisie manuelle d'un livre a une photo ; gros gain UX | P2 | M | ⏳ a faire |
| B4 | Recherche plein texte + tags/collections | Retrouver un livre dans une grande bibliotheque | P2 | M | ⏳ a faire |
| B5 | Historique des prets et statistiques | Savoir qui a emprunte quoi et quand ; base pour des recommandations | P2 | S | ⏳ a faire |
| B6 | Import CSV (Goodreads, export maison) | Migration depuis un tableur existant | P2 | S | ⏳ a faire |
| B7 | Couvertures via Open Library API | Enrichissement automatique des fiches | P3 | S | ⏳ a faire |
| B8 | Sauvegarde / restauration (export JSON) | Un outil local doit pouvoir etre sauvegarde et deplace | P2 | S | ✅ fait 2026-09-30 (`lib/backup.ts`, `app/api/admin/import`) |
| B9 | PWA / consultation hors ligne | Consulter sa bibliotheque sans reseau | P3 | M | ⏳ a faire |
| B10 | Migration i18n vers le pattern Context NF | Trace dans la Phase 3 ; coherence multi-projets | P3 | L | ⏳ planifie |

Note : B10 necessite une decision produit (next-intl fonctionne) ; ne pas migrer sans raison forte.

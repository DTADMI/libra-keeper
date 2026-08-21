# Action Plan — Libra Keeper

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
| 6 | i18n with default fr (EN/FR) — next-intl | ✅ Done |
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

## Phase 3: Remaining Gaps (3 items — minor)

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
| Node.js | >=24.0.0 | 26.3.0 |
| pnpm | 11.5.0 | 11.5.0 |

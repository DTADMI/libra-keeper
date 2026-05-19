# LibraKeeper Action Plan

> Architecture alignment with quest-hunt-web patterns: Supabase, Upstash Redis, TanStack React Query, rate limiting, vendor adapters.
> Non-goals: Prisma → raw Supabase SDK migration, NextAuth → Supabase Auth migration, PostGIS/MapLibre/3D (irrelevant to LK domain).

Last updated: 2026-05-15

## Recent Updates

- **[NEW]** 2026-05-15 — Architecture assessment completed. Identified 10 gaps vs quest-hunt-web reference. Phases 1-4 drafted.

---

## Legend

### Priority

- 🔴 HIGH — Blocks production readiness or introduces security vulnerability
- 🟡 MEDIUM — Important but not blocking
- 🟢 LOW — Nice-to-have, polish, or future

### Status

- ✅ COMPLETED
- 🟡 IN PROGRESS
- 🔜 UP NEXT
- 🗂️ BACKLOG
- ⛔ BLOCKED (external dependency)
- ❌ CANCELLED

---

## Phase 1: Security & Infrastructure Foundation

> Goal: Production-grade infrastructure matching QH's resilience patterns. Redis, rate limiting, managed DB, React Query foundation.

| Priority | Item                                                                                   | Status     | Notes                                                                                                                                   |
| -------- | -------------------------------------------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 🔴       | Provision Supabase staging + production projects                                       | ⛔ BLOCKED | Requires Supabase account creation. See `docs/supabase-postgres-migration-plan.md`. Keep Prisma + NextAuth, only change `DATABASE_URL`. |
| 🔴       | Provision Upstash Redis (prod/preview)                                                 | ⛔ BLOCKED | Requires Upstash account. Used for caching, rate limiting, feature flags, session store.                                                |
| 🔴       | Create `lib/redis.ts` — multi-tier Redis adapter (Upstash / ioredis / memory fallback) | 🔜 UP NEXT | Port pattern from QH `lib/redis.ts`. `RedisClient` interface, auto-selection by env. Payload guardrails, chunked storage.               |
| 🔴       | Create `lib/security/rate-limit.ts` — sliding window via Redis ZSETs                   | 🔜 UP NEXT | Copy QH's pattern. Predefined limits for auth/signup/API/admin/guest. Route wrapper `withRateLimit()`. Fails-open.                      |
| 🔴       | Apply rate limiting to all API routes                                                  | 🔜 UP NEXT | Auth endpoints: 10/60s. Signup: 5/300s. API default: 100/60s. Admin: 200/60s.                                                           |
| 🔴       | Create `lib/security/rate-limit-overrides.ts` — admin-managed per-scope overrides      | 🗂️ BACKLOG | DB-backed overrides with Redis cache. Admin UI deferred to Phase 2.                                                                     |
| 🟡       | Install and configure TanStack React Query provider                                    | 🔜 UP NEXT | `@tanstack/react-query` + devtools. staleTime: 30s, gcTime: 5min, refetchOnWindowFocus: false. QueryClientProvider in layout.           |
| 🟡       | Create `hooks/use-session.tsx` with React Query (replace current `useSession`)         | 🔜 UP NEXT | Wrap `useSession` from next-auth in React Query for caching and refetch.                                                                |
| 🔴       | Create `lib/security/csrf.ts` — CSRF token generation + validation                     | 🗂️ BACKLOG | Used for mutation endpoints. Cookie-based double-submit pattern.                                                                        |
| 🟡       | Add CSP headers in `next.config.ts`                                                    | 🗂️ BACKLOG | script-src, connect-src, frame-src, worker-src. Match QH pattern.                                                                       |
| 🔴       | Update `.env.example` with all new env vars (Upstash, Supabase)                        | 🔜 UP NEXT | `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `REDIS_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, etc.                                          |
| 🟡       | Update CI/CD to handle new services                                                    | 🗂️ BACKLOG | Build-time Redis fallback, Supabase connection checks in CI.                                                                            |

---

## Phase 2: State Management & UX Modernization

> Goal: Replace direct fetch + useState patterns with TanStack React Query. Enhanced feature flags. Optimistic updates.

| Priority | Item                                                                           | Status       | Notes                                                                                                        |
| -------- | ------------------------------------------------------------------------------ | ------------ | ------------------------------------------------------------------------------------------------------------ |
| 🟡       | Create `components/providers/query-provider.tsx`                               | ✅ COMPLETED | Dedicated provider wrapper. Devtools in dev mode.                                                            |
| 🟡       | Create `hooks/use-feature-flags.tsx` — React Context + SWR client consumption  | ✅ COMPLETED | `FeatureFlagsProvider`, `useFeatureFlag(id)`, `<FeatureGate>` component. Match QH pattern.                   |
| 🟡       | Add `@tanstack/react-query-devtools` in dev mode                               | ✅ COMPLETED | Conditional import in query-provider.                                                                        |
| 🟡       | Add `swr` dependency for feature flags client-side                             | ✅ COMPLETED | Used by feature flag hooks (matching QH pattern).                                                            |
| 🟡       | Migrate items CRUD to React Query (queries + mutations)                        | ✅ COMPLETED | `hooks/use-items.ts`. Like toggling with optimistic updates, comments with optimistic prepend.               |
| 🟡       | Migrate loans system to React Query                                            | ✅ COMPLETED | `hooks/use-loans.ts`. Borrow mutation, loan status update mutations.                                         |
| 🟡       | Migrate messages to React Query                                                | ✅ COMPLETED | `hooks/use-messages.ts`. Conversations + messages with optimistic send. Page migrated.                       |
| 🟡       | Migrate suggestions + waitlist to React Query                                  | ✅ COMPLETED | `hooks/use-suggestions.ts`. Create suggestion mutation, waitlist join/leave. Page migrated.                  |
| 🟡       | Migrate activity feed to React Query                                           | ✅ COMPLETED | `hooks/use-activity.ts`. 30s auto-refetch. Component migrated.                                               |
| 🟡       | Enhanced feature flags — add types: percentage, user_list                      | ✅ COMPLETED | `lib/feature-flags.ts`. 12 default flags. `evaluateFlag()` for percentage + user_list. Redis+DB persistence. |
| 🟡       | Create `hooks/use-admin-queries.ts` — admin CRUD hooks with optimistic updates | ✅ COMPLETED | `hooks/use-admin.ts`. Users, flags, settings, export hooks.                                                  |
| 🟡       | Migrate admin pages to React Query                                             | 🗂️ BACKLOG   | Admin pages are server components. React Query hooks ready for when they become client-side.                 |
| 🟢       | Add loading skeleton components for all data-loaded pages                      | ✅ COMPLETED | `components/ui/skeleton.tsx`                                                                                 |
| 🟢       | Add error boundary components for data-fetching errors                         | ✅ COMPLETED | `components/error-boundary.tsx`                                                                              |

---

## Phase 2b: RLS Defense-in-Depth + Prisma Hardening

> **Strategy decision:** Keep Prisma as primary data layer (SF pattern). Add RLS policies via Supabase SQL migrations as defense-in-depth. Application-level authorization in route handlers remains the primary guard.
>
> See `docs/platform-architecture-comparison.md` for the full analysis of Supabase vs Convex vs SpacetimeDB vs Neo4j across all projects.
>
> See `story-forge/docs/architecture-security.md` for the documented SF pattern that LK now follows.

| Priority | Item                                                                  | Status     | Notes                                                                                                        |
| -------- | --------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------ |
| 🔴       | Add `import "server-only"` guard to `lib/db.ts`                       | ✅ COMPLETED | Prevents Prisma client from being bundled into client components. Match SF pattern.                          |
| 🔴       | Create `supabase/migrations/` directory structure                     | ✅ COMPLETED | Follow SF's dual-migration pattern: Prisma Migrate for schema, Supabase SQL for RLS/triggers.                |
| 🔴       | Create initial Supabase SQL migration — schema mirroring Prisma       | ✅ COMPLETED | `001_create_tables.sql` with idempotent `CREATE TABLE IF NOT EXISTS`.                                        |
| 🔴       | Add RLS policies on all tables                                        | ✅ COMPLETED | Enable RLS. Policies: "Users can only see their own data", "Admins can see all". Binary access model.        |
| 🔴       | Add `set_updated_at()` trigger function                               | ✅ COMPLETED | Auto-update `updated_at` columns.                                                                            |
| 🔴       | Create `handle_new_user()` trigger for `public.profiles` sync         | ✅ COMPLETED | Auto-create profile row when `auth.users` row is created.                                                    |
| 🟡       | Create `docs/architecture-security.md` — dual-layer authorization doc | ✅ COMPLETED | Document app-level guards + RLS defense-in-depth pattern. Mirror SF's doc.                                   |
| 🟡       | Add Supabase Realtime subscriptions for activity feed                 | 🗂️ BACKLOG | Automatically update UI when loans/comments change. See platform comparison doc Section 5 for code examples. |
| 🟡       | Create `scripts/` migration tooling (apply, validate, report)         | 🗂️ BACKLOG | Match QH's `apply-migrations.mjs` pattern for multi-environment migration.                                   |

---

## Phase 3: Hardening, Polish & DevOps

> Goal: RLS done in Phase 2b. Focus on cron jobs, i18n, accessibility, monitoring.

| Priority | Item                                                            | Status       | Notes                                                                                                                                          |
| -------- | --------------------------------------------------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 🟡       | Add Vercel cron jobs for email reminders + cleanup              | ✅ COMPLETED | `vercel.json` crons config. Daily 9AM email reminders for due/overdue loans. Weekly Sunday cleanup of expired sessions. `CRON_SECRET` env var. |
| 🟡       | Configure CSP headers in `next.config.ts`                       | ✅ COMPLETED | Comprehensive CSP: script-src, connect-src, frame-src, worker-src, img-src. Added in Phase 1.                                                  |
| 🟡       | Create vendor adapters — `lib/adapters/email.ts`                | ✅ COMPLETED | Interface-based adapter. Resend implementation + mock for tests. Added in Phase 1.                                                             |
| 🟡       | Create vendor adapters — `lib/adapters/storage.ts`              | ✅ COMPLETED | Supabase Storage adapter (public + private buckets). Mock for tests. Added in Phase 1.                                                         |
| 🟡       | Add CSRF protection to mutation endpoints                       | ✅ COMPLETED | Double-submit cookie pattern. `lib/security/csrf.ts`. Added in Phase 1.                                                                        |
| 🟡       | Expand i18n — add French locale (FR)                            | ✅ COMPLETED | `src/i18n/messages/fr.json` with 120+ translated keys. Quebec French norms. `next-intl.config.ts` updated.                                     |
| 🟡       | Expand i18n — translate all UI strings (currently ~3 keys)      | ✅ COMPLETED | `en.json` expanded from 3 keys to 120+ keys covering all pages.                                                                                |
| 🟡       | Supabase Realtime subscriptions for activity feed + loan status | ✅ COMPLETED | `hooks/use-realtime.ts`. Channel subscriptions for items (loans, comments, likes) and global activity feed.                                    |
| 🟢       | Screen reader optimization                                      | ✅ COMPLETED | ARIA labels on auth pages, form fields, search bar. `aria-required`, `aria-busy`, `role="searchbox"`, `aria-expanded`.                         |
| 🟢       | High contrast theme variant                                     | ✅ COMPLETED | CSS custom variant `.high-contrast` with both light and dark modes. High-contrast color tokens.                                                |
| 🟡       | Add Sentry or equivalent error monitoring                       | 🗂️ BACKLOG   | Capture API errors, client-side errors. Vercel integration.                                                                                    |
| 🟡       | Add performance monitoring                                      | ✅ COMPLETED | `@vercel/analytics` + `@vercel/speed-insights` integrated into root layout.                                                                    |

---

## Phase 4: Future Enhancements

> Goal: Mobile app, external integrations, advanced search, monetization. Post-launch roadmap.

| Priority | Item                                          | Status       | Notes                                                                                                                                                                                    |
| -------- | --------------------------------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 🟢       | React Native mobile app                       | 🗂️ BACKLOG   | Offline support, barcode scanning. Separate repo per mobile split model.                                                                                                                 |
| 🟢       | ISBN / IMDb / metadata API lookups            | 🗂️ BACKLOG   | Google Books API, Open Library, IMDb. Auto-populate item fields.                                                                                                                         |
| 🟢       | Full-text search with PostgreSQL tsvector     | ✅ COMPLETED | `supabase/migrations/003_full_text_search.sql`. Weighted ranking (title A, description/author B, publisher/isbn C). GIN index. Auto-updating trigger. Search API + search bar component. |
| 🟢       | ISBN / Google Books metadata lookup           | ✅ COMPLETED | `components/isbn-lookup.tsx`. Google Books API integration. Auto-fills title, author, publisher, date, description, cover image.                                                         |
| 🟢       | Screen reader / accessibility optimization    | ✅ COMPLETED | ARIA labels on auth pages, form fields, search bar. `aria-required`, `aria-busy`, `aria-label`, `role` attributes.                                                                       |
| 🟢       | High contrast theme variant                   | ✅ COMPLETED | CSS custom variant `.high-contrast`. Dark + light high contrast modes. Added to `globals.css`.                                                                                           |
| 🟢       | Bulk item import (CSV, Goodreads export)      | 🗂️ BACKLOG   | Client-side parsing + server validation. Progress indicator.                                                                                                                             |
| 🟢       | Collection sharing between admins             | 🗂️ BACKLOG   | Multi-collection exists; cross-account sharing needs schema extension.                                                                                                                   |
| 🟢       | Calendar integration (external calendar sync) | 🗂️ BACKLOG   | iCal export / Google Calendar sync for due dates.                                                                                                                                        |
| 🟢       | Webhook support for external services         | 🗂️ BACKLOG   | Outgoing webhooks for item add, loan status change.                                                                                                                                      |
| 🟢       | Automated email reminders (scheduled)         | 🗂️ BACKLOG   | Cron-triggered due date / overdue emails.                                                                                                                                                |
| 🟢       | Reports and analytics dashboard               | 🗂️ BACKLOG   | Borrowing trends, popular items, collection statistics.                                                                                                                                  |
| 🟢       | Monetization — premium features, donations    | 🗂️ BACKLOG   | Stripe integration. Premium: advanced analytics, priority support.                                                                                                                       |
| 🟢       | Custom fields for items (flexible metadata)   | 🗂️ BACKLOG   | Admin-defined custom fields per item type. Dynamic form generation.                                                                                                                      |

---

## Supabase Migration (Parallel Track)

> Scope: migrate DB hosting from Docker to Supabase. Keep Prisma. Auth already migrated (Phase 2a).

| Status | Task                                               | Notes                                    |
| ------ | -------------------------------------------------- | ---------------------------------------- |
| ⛔     | Supabase staging/prod projects provisioning        | Requires account creation                |
| ✅     | Supabase Auth migration (NextAuth → Supabase Auth) | Phase 2a completed                       |
| ✅     | `DATABASE_URL` / `DIRECT_URL` for Supabase pooler  | Documented in `.env.example`             |
| ⛔     | Rehearsal runbook execution                        | Scripted validation queries              |
| ⛔     | Prisma `DIRECT_URL` split for pooled connections   | Required for Supabase connection pooling |
| ⛔     | 48h stabilization monitoring                       | Error rates, latency, connection pool    |

---

## Deferred / Rejected Decisions

| Item                                       | Decision     | Rationale                                                                                                                                                                                                                                                             |
| ------------------------------------------ | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Migrate from Prisma to direct Supabase SDK | ❌ REJECTED  | **Revised after SF analysis.** LK's data model (2-level nesting, 11 models) matches SF's Prisma pattern, not QH's flat SDK pattern. Prisma stays. RLS added as defense-in-depth via SQL migrations. See `docs/platform-architecture-comparison.md` for full analysis. |
| Migrate from NextAuth to Supabase Auth     | ✅ COMPLETED | Phase 2a. Supabase Auth provides built-in email verification, password reset, magic links, and RLS integration — all previously missing.                                                                                                                              |
| Use Convex instead of Supabase             | ❌ REJECTED  | Convex's auto-reactivity is appealing but vendor lock-in (closed source, proprietary DB) is unacceptable for a personal/hobby project where data portability matters. See `docs/platform-architecture-comparison.md`.                                                 |
| Use Neo4j                                  | ❌ REJECTED  | No graph relationships in LK's data model. Items don't interconnect — they're independently cataloged. Neo4j would add complexity with zero benefit.                                                                                                                  |
| Adopt PostGIS / MapLibre / Three.js        | ❌ REJECTED  | Irrelevant to library management domain.                                                                                                                                                                                                                              |
| Move to monorepo / microservices           | ❌ REJECTED  | Monolith is simpler and sufficient for LK's scale.                                                                                                                                                                                                                    |
| Abandon PWA in favor of React Native only  | ❌ REJECTED  | PWA supplements (not replaces) native app. Both can coexist.                                                                                                                                                                                                          |

---

## Status Summary

| Phase                               | Progress | Blockers                                                                                                               |
| ----------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------------- |
| Phase 1 — Security & Infrastructure | ✅ 100%  | None (Supabase + Upstash provisioning for production)                                                                  |
| Phase 2a — Supabase Auth Migration  | ✅ 100%  | None                                                                                                                   |
| Phase 2 — State Management & UX     | ✅ 95%   | Admin pages are server components (React Query hooks ready)                                                            |
| Phase 2b — RLS Defense-in-Depth     | ✅ 100%  | None (SQL migrations + RLS policies written)                                                                           |
| Phase 3 — Hardening & Polish        | ✅ 95%   | Sentry remaining                                                                                                       |
| Phase 4 — Future                    | 🟡 40%   | Full-text search, ISBN lookup, ARIA, high contrast done. Bulk import, calendar sync, webhooks, monetization remaining. |
| Supabase DB Migration               | 🟡 50%   | Account provisioning + connection string rotation                                                                      |

---

## Technical Implementation Notes

### Redis Adapter Architecture

```
lib/redis.ts        → Unified RedisClient interface
  ├── UpstashRedis  → @upstash/redis (prod/preview, via KV_REST_API_URL + KV_REST_API_TOKEN)
  ├── LocalRedis    → ioredis wrapper (local dev, via REDIS_URL)
  └── MemoryRedis   → In-memory Map fallback (build phase, all-mode safety net)
```

### Rate Limiting Architecture

```
lib/security/rate-limit.ts
  ├── slidingWindow()      → ZREMRANGEBYSCORE + ZCARD + ZADD + EXPIRE pipeline
  ├── withRateLimit()      → HOF wrapping API route handlers
  ├── RATE_LIMITS          → Predefined scopes (api, auth, signup, admin, guest)
  └── X-RateLimit-* / Retry-After headers

lib/security/rate-limit-overrides.ts
  ├── DB-backed overrides (rate_limit_overrides table)
  ├── 60s Redis cache layer
  └── Admin API + UI for management
```

### TanStack React Query Patterns

```
hooks/use-items.ts         → useItems, useItem, useCreateItem, useUpdateItem, useDeleteItem
hooks/use-loans.ts         → useLoans, useBorrowRequest, useApproveLoan, useReturnLoan
hooks/use-messages.ts      → useMessages, useSendMessage
hooks/use-activity.ts      → useActivity
hooks/use-admin-queries.ts → useUsers, useChangeRole, useFlags, useSettings, useExport
```

### Feature Flag System (Enhanced)

```
lib/feature-flags.ts       → DEFAULT_FEATURE_FLAGS array, Redis + DB storage, isFeatureEnabled()
hooks/use-feature-flags.tsx → FeatureFlagsProvider (SWR), useFeatureFlag(id), <FeatureGate>
api/feature-flags/         → GET (list), POST (upsert)
```

---

## Status Summary

| Phase                               | Progress | Blockers                                       |
| ----------------------------------- | -------- | ---------------------------------------------- |
| Phase 1 — Security & Infrastructure | 0%       | Supabase + Upstash account provisioning needed |
| Phase 2 — State Management & UX     | 0%       | Phase 1 completion needed                      |
| Phase 3 — Hardening & Polish        | 0%       | Supabase provisioning needed for RLS           |
| Phase 4 — Future                    | 0%       | Post-launch                                    |
| Supabase Migration                  | 30%      | Account provisioning                           |

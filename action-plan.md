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

| Priority | Item | Status | Notes |
|----------|------|--------|-------|
| 🔴 | Provision Supabase staging + production projects | ⛔ BLOCKED | Requires Supabase account creation. See `docs/supabase-postgres-migration-plan.md`. Keep Prisma + NextAuth, only change `DATABASE_URL`. |
| 🔴 | Provision Upstash Redis (prod/preview) | ⛔ BLOCKED | Requires Upstash account. Used for caching, rate limiting, feature flags, session store. |
| 🔴 | Create `lib/redis.ts` — multi-tier Redis adapter (Upstash / ioredis / memory fallback) | 🔜 UP NEXT | Port pattern from QH `lib/redis.ts`. `RedisClient` interface, auto-selection by env. Payload guardrails, chunked storage. |
| 🔴 | Create `lib/security/rate-limit.ts` — sliding window via Redis ZSETs | 🔜 UP NEXT | Copy QH's pattern. Predefined limits for auth/signup/API/admin/guest. Route wrapper `withRateLimit()`. Fails-open. |
| 🔴 | Apply rate limiting to all API routes | 🔜 UP NEXT | Auth endpoints: 10/60s. Signup: 5/300s. API default: 100/60s. Admin: 200/60s. |
| 🔴 | Create `lib/security/rate-limit-overrides.ts` — admin-managed per-scope overrides | 🗂️ BACKLOG | DB-backed overrides with Redis cache. Admin UI deferred to Phase 2. |
| 🟡 | Install and configure TanStack React Query provider | 🔜 UP NEXT | `@tanstack/react-query` + devtools. staleTime: 30s, gcTime: 5min, refetchOnWindowFocus: false. QueryClientProvider in layout. |
| 🟡 | Create `hooks/use-session.tsx` with React Query (replace current `useSession`) | 🔜 UP NEXT | Wrap `useSession` from next-auth in React Query for caching and refetch. |
| 🔴 | Create `lib/security/csrf.ts` — CSRF token generation + validation | 🗂️ BACKLOG | Used for mutation endpoints. Cookie-based double-submit pattern. |
| 🟡 | Add CSP headers in `next.config.ts` | 🗂️ BACKLOG | script-src, connect-src, frame-src, worker-src. Match QH pattern. |
| 🔴 | Update `.env.example` with all new env vars (Upstash, Supabase) | 🔜 UP NEXT | `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `REDIS_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, etc. |
| 🟡 | Update CI/CD to handle new services | 🗂️ BACKLOG | Build-time Redis fallback, Supabase connection checks in CI. |

---

## Phase 2: State Management & UX Modernization

> Goal: Replace direct fetch + useState patterns with TanStack React Query. Enhanced feature flags. Optimistic updates.

| Priority | Item | Status | Notes |
|----------|------|--------|-------|
| 🟡 | Migrate items CRUD to React Query (queries + mutations) | 🗂️ BACKLOG | `useQuery` for list/detail, `useMutation` with `invalidateQueries`. Optimistic updates for like/unlike, comment add. |
| 🟡 | Migrate loans system to React Query | 🗂️ BACKLOG | Borrow request, approval/rejection, return. Optimistic status changes. |
| 🟡 | Migrate messages to React Query | 🗂️ BACKLOG | Inbox list, conversation view. Polling or manual refetch. |
| 🟡 | Migrate admin pages to React Query | 🗂️ BACKLOG | User management, settings, flags, export. Admin queries hook file. |
| 🟡 | Migrate suggestions + waitlist to React Query | 🗂️ BACKLOG | Create suggestion, join/leave waitlist. |
| 🟡 | Migrate activity feed to React Query | 🗂️ BACKLOG | Auto-refetch on new activity. |
| 🟡 | Enhanced feature flags — add types: percentage, user_list | 🗂️ BACKLOG | Extend `FeatureFlag` model. Redis-backed storage with DB fallback. `useFeatureFlag()` client hook via SWR. |
| 🟡 | Create `hooks/use-feature-flags.tsx` — React Context + SWR client consumption | 🗂️ BACKLOG | `FeatureFlagsProvider`, `useFeatureFlag(id)`, `<FeatureGate>` component. Match QH pattern. |
| 🟡 | Create `components/providers/query-provider.tsx` | 🔜 UP NEXT | Dedicated provider wrapper. Devtools in dev mode. Error boundary. |
| 🟡 | Create `components/providers/feature-flags-provider.tsx` | 🗂️ BACKLOG | SWR-based context provider for client-side flag consumption. |
| 🟡 | Create `hooks/use-admin-queries.ts` — admin CRUD hooks with optimistic updates | 🗂️ BACKLOG | Pattern from QH: `onMutate` cancelQueries + setQueryData, `onError` rollback, `onSettled` invalidate. |
| 🟡 | Add `@tanstack/react-query-devtools` in dev mode | 🔜 UP NEXT | Conditional import in query-provider. |
| 🟡 | Add `swr` dependency for feature flags client-side | 🔜 UP NEXT | Used by feature flag hooks (matching QH pattern). |
| 🟢 | Add loading skeleton components for all data-loaded pages | 🗂️ BACKLOG | shadcn-style skeleton components. Replace generic spinners. |
| 🟢 | Add error boundary components for data-fetching errors | 🗂️ BACKLOG | Per-route error states with retry buttons. |

---

## Phase 3: Hardening, Polish & DevOps

> Goal: RLS, CSP, cron jobs, vendor adapters, i18n, accessibility, monitoring.

| Priority | Item | Status | Notes |
|----------|------|--------|-------|
| 🔴 | Implement RLS policies on all tables | ⛔ BLOCKED | Requires Supabase. Enable RLS, create policies per table. Admin bypass via service role. Track in `docs/technical/rls-policy-inventory.md`. |
| 🟡 | Add Vercel cron jobs for email reminders + cleanup | 🗂️ BACKLOG | Due date reminders, overdue notifications, token cleanup. `vercel.json` crons config. |
| 🟡 | Create vendor adapters — `lib/adapters/email.ts` wrapping Resend | 🗂️ BACKLOG | Interface-based adapter for testability. Resend implementation + mock for tests. |
| 🟡 | Create vendor adapters — `lib/adapters/storage.ts` for file uploads | 🗂️ BACKLOG | Supabase Storage adapter (public + private buckets). Mock for tests. |
| 🟡 | Configure CSP headers in `next.config.ts` | 🗂️ BACKLOG | Comprehensive CSP: script-src, connect-src, frame-src, worker-src, img-src. |
| 🟡 | Add CSRF protection to mutation endpoints | 🗂️ BACKLOG | Double-submit cookie pattern. Middleware or per-route check. |
| 🟡 | Expand i18n — add French locale (FR) | 🗂️ BACKLOG | Bilingual EN/FR per cross-project rules. Quebec French norms. |
| 🟡 | Expand i18n — translate all UI strings (currently ~3 keys) | 🗂️ BACKLOG | All pages, components, form labels, errors, emails. |
| 🟢 | Add screen reader optimization | 🗂️ BACKLOG | ARIA labels, focus management, semantic HTML audit. |
| 🟢 | Add high contrast theme variant | 🗂️ BACKLOG | Toggle alongside dark/light. |
| 🟡 | Add Sentry or equivalent error monitoring | 🗂️ BACKLOG | Capture API errors, client-side errors. Vercel integration. |
| 🟡 | Add performance monitoring | 🗂️ BACKLOG | Vercel Analytics, Web Vitals. |

---

## Phase 4: Future Enhancements

> Goal: Mobile app, external integrations, advanced search, monetization. Post-launch roadmap.

| Priority | Item | Status | Notes |
|----------|------|--------|-------|
| 🟢 | React Native mobile app | 🗂️ BACKLOG | Offline support, barcode scanning. Separate repo per mobile split model. |
| 🟢 | ISBN / IMDb / metadata API lookups | 🗂️ BACKLOG | Google Books API, Open Library, IMDb. Auto-populate item fields. |
| 🟢 | Full-text search with PostgreSQL tsvector | 🗂️ BACKLOG | Search across title, description, author, tags. Weighted ranking. |
| 🟢 | Bulk item import (CSV, Goodreads export) | 🗂️ BACKLOG | Client-side parsing + server validation. Progress indicator. |
| 🟢 | Collection sharing between admins | 🗂️ BACKLOG | Multi-collection exists; cross-account sharing needs schema extension. |
| 🟢 | Calendar integration (external calendar sync) | 🗂️ BACKLOG | iCal export / Google Calendar sync for due dates. |
| 🟢 | Webhook support for external services | 🗂️ BACKLOG | Outgoing webhooks for item add, loan status change. |
| 🟢 | Automated email reminders (scheduled) | 🗂️ BACKLOG | Cron-triggered due date / overdue emails. |
| 🟢 | Reports and analytics dashboard | 🗂️ BACKLOG | Borrowing trends, popular items, collection statistics. |
| 🟢 | Monetization — premium features, donations | 🗂️ BACKLOG | Stripe integration. Premium: advanced analytics, priority support. |
| 🟢 | Custom fields for items (flexible metadata) | 🗂️ BACKLOG | Admin-defined custom fields per item type. Dynamic form generation. |

---

## Supabase Migration (Parallel Track)

> Scope: migrate DB hosting only. Keep Prisma + NextAuth. See `docs/supabase-postgres-migration-plan.md`.

| Status | Task | Notes |
|--------|------|-------|
| ⛔ | Supabase staging/prod projects provisioning | Requires account creation |
| ⛔ | `DATABASE_URL` / `DIRECT_URL` rotation | Staging first, then prod |
| ⛔ | Rehearsal runbook execution | Scripted validation queries |
| ⛔ | Prisma `DIRECT_URL` split for pooled connections | Required for Supabase connection pooling |
| ⛔ | 48h stabilization monitoring | Error rates, latency, connection pool |

---

## Deferred / Rejected Decisions

| Item | Decision | Rationale |
|------|----------|-----------|
| Migrate from Prisma to direct Supabase SDK | ❌ REJECTED | Prisma works well with LK's schema complexity. No benefit from raw SDK. |
| Migrate from NextAuth to Supabase Auth | ❌ REJECTED | NextAuth is stable and integrated. Migration is high-risk, low-value. |
| Adopt PostGIS / MapLibre / Three.js | ❌ REJECTED | Irrelevant to library management domain. |
| Move to monorepo / microservices | ❌ REJECTED | Monolith is simpler and sufficient for LK's scale. |
| Abandon PWA in favor of React Native only | ❌ REJECTED | PWA supplements (not replaces) native app. Both can coexist. |

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

| Phase | Progress | Blockers |
|-------|----------|----------|
| Phase 1 — Security & Infrastructure | 0% | Supabase + Upstash account provisioning needed |
| Phase 2 — State Management & UX | 0% | Phase 1 completion needed |
| Phase 3 — Hardening & Polish | 0% | Supabase provisioning needed for RLS |
| Phase 4 — Future | 0% | Post-launch |
| Supabase Migration | 30% | Account provisioning |

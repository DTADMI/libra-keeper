# LibraKeeper Architecture & Security

> Last updated: 2026-05-15

---

## 1. Authorization Model: Dual-Layer Defense

LibraKeeper uses a **dual-layer authorization** model following the StoryForge pattern:

| Layer | Mechanism | What it protects |
|-------|-----------|-----------------|
| **Application-level** (primary) | Route handler guards: `getServerAuth()` + `session.user.role` checks + explicit `where: { userId }` filters | All API access via Next.js route handlers |
| **Database-level** (defense-in-depth) | Row Level Security (RLS) policies in `supabase/migrations/` | Direct database access, SQL injection, accidental un-filtered queries |

### Why dual-layer?

**Prisma connects to Postgres via `@prisma/adapter-pg` using the database user, not `auth.uid()`.** This means Prisma queries bypass RLS entirely. The primary authorization must therefore be in application code — every route handler checks the user's identity and role, and every query explicitly filters by `userId`.

**RLS serves as defense-in-depth.** If application code has a bug (missing `userId` filter) or if someone accesses the database directly (e.g., via the Supabase dashboard), RLS policies still block unauthorized access. The policies are not the primary guard, but they are the safety net.

This is the same architecture documented for StoryForge in `story-forge/docs/architecture-security.md`.

### Binary access model

LK has only two access tiers (vs QH's 4 tiers and SF's 4 tiers):

| Role | Permissions |
|------|------------|
| **ADMIN** | Full CRUD on items, collections, tags. Approve/reject loans. Manage users, settings, feature flags. View all data. |
| **USER** | Browse items. Request to borrow. Comment on items. Like items. Join waitlist. Message other users. View own loans and requests. |

This binary model means RLS policies are simple:
- User-owned data: `auth.uid() = user_id`
- Admin access: `EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN')`

---

## 2. Database Architecture: Supabase + Prisma

### Why Prisma (not direct Supabase SDK)

| Factor | LK's data | Assessment |
|--------|-----------|-----------|
| **Models** | 11 tables | Small-medium |
| **Query depth** | 2 levels (items → tags, items → comments → users) | Prisma's `include` saves 1-2 round-trips |
| **Relations** | Standard FK, M:N via junction table | Prisma handles automatically |
| **Access model** | Binary (admin/user) | Simple enough for app-level guards |
| **Migrations** | Prisma Migrate is the source of truth | Supabase SQL mirrors it for RLS |

LK's data model is not complex enough to justify Prisma's deep-include benefits alone (unlike SF with 3-level nesting). However, Prisma provides:
- Type-safe queries (autocomplete on every field)
- Migration management (Prisma Migrate is more ergonomic than raw SQL for schema changes)
- Single source of truth for the schema (`prisma/schema.prisma`)
- Familiarity across the Nebula Forge portfolio (SF also uses Prisma)

See `docs/platform-architecture-comparison.md` for the full analysis of Supabase vs Convex vs SpacetimeDB vs Neo4j.

### Connection architecture

```
┌─ Next.js Route Handler ──────────────────────────┐
│                                                    │
│  const session = await getServerAuth()             │
│  // ← Uses @supabase/ssr (respects RLS)           │
│  if (!session.user) return 401                     │
│                                                    │
│  const items = await prisma.item.findMany({        │
│    include: { tags: true }                          │
│  })                                                │
│  // ← Uses Prisma + pg adapter (bypasses RLS)     │
│  // ← Authorization: app-level guard above         │
│                                                    │
└────────────────────────────────────────────────────┘
         │                        │
         ▼                        ▼
┌─ Supabase Auth ───┐    ┌─ Prisma (pg adapter) ──┐
│ @supabase/ssr      │    │ @prisma/adapter-pg      │
│ Cookie-based JWT   │    │ Pooler URL (port 6543)  │
│ Respects RLS       │    │ Bypasses RLS            │
└────────────────────┘    └─────────────────────────┘
         │                        │
         └────────┬───────────────┘
                  ▼
         ┌─ Supabase Postgres ──┐
         │ auth.users            │
         │ public.profiles       │
         │ public.items          │
         │ ... (11 tables)       │
         │ RLS policies active   │
         │ (for SDK queries)     │
         └───────────────────────┘
```

---

## 3. Auth Architecture: Supabase Auth

### Migration from NextAuth (completed Phase 2a)

| Before (NextAuth) | After (Supabase Auth) |
|-------------------|----------------------|
| `lib/auth.ts` — NextAuthOptions config | `lib/supabase/server.ts` — server client factory |
| `getServerSession(authOptions)` | `getServerAuth()` — returns same shape |
| `useSession()` from `next-auth/react` | `useSession()` from `@/hooks/use-session` — compatibility shim |
| User/Account/Session tables in Prisma | `auth.users` + `public.profiles` — managed by Supabase |
| `api/auth/[...nextauth]` route | `@supabase/ssr` middleware + cookie handling |
| Password hashing via `bcryptjs` | Handled by Supabase Auth (Argon2) |
| No email verification | Built-in via Supabase Auth |
| No password reset | Built-in via Supabase Auth |

### Client types

| Client | File | Use case |
|--------|------|----------|
| Browser | `lib/supabase/client.ts` | Client components. Singleton via `globalThis`. Reads `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_ANON_KEY`. |
| Server | `lib/supabase/server.ts` | Server components + API routes. Dual-mode: JWT Bearer passthrough or cookie-based SSR. |
| Middleware | `lib/supabase/middleware.ts` | Next.js middleware. Reads/writes cookies on both request and response. |
| Admin | `lib/supabase/admin.ts` | Server-only. Service role key. Bypasses RLS. |

---

## 4. Infrastructure

| Component | Technology | Notes |
|-----------|-----------|-------|
| **Hosting** | Vercel | Next.js 16 with `output: "standalone"` |
| **Database** | Supabase Postgres | Via `@prisma/adapter-pg` connecting to pooler URL (port 6543) |
| **Auth** | Supabase Auth | `@supabase/ssr` for session management |
| **Cache** | Upstash Redis | 3-tier adapter: Upstash → ioredis → memory |
| **Rate limiting** | Redis ZSETs | Sliding window algorithm. Fails open. |
| **Email** | Resend | Vendor adapter in `lib/adapters/email.ts` |
| **Storage** | Supabase Storage | Vendor adapter in `lib/adapters/storage.ts` (public + private buckets) |
| **State** | TanStack React Query | `staleTime: 30s`, `gcTime: 5min`, `refetchOnWindowFocus: false` |
| **Feature flags** | Redis + DB | Public API at `/api/feature-flags`. SWR hooks for client consumption. |

---

## 5. Security Measures

| Measure | Status | Details |
|---------|--------|---------|
| **Rate limiting** | ✅ | Sliding window via Redis. Auth: 10/60s, Signup: 5/300s, API: 100/60s, Admin: 200/60s. `lib/security/rate-limit.ts` |
| **CSRF protection** | ✅ | Double-submit cookie pattern. `lib/security/csrf.ts` |
| **CSP headers** | ✅ | `next.config.ts` — script-src, connect-src, frame-src, worker-src |
| **RLS policies** | ✅ | All tables. `supabase/migrations/001_*` and `002_*` |
| **server-only imports** | ✅ | `lib/db.ts`, `lib/supabase/server.ts`, `lib/supabase/admin.ts` |
| **Admin separation** | ✅ | `requireAdmin()` in route handlers. Service role key never exposed to client. |
| **Auth rate limiting** | ✅ | `withRateLimit(RATE_LIMITS.auth)` on signin. `withRateLimit(RATE_LIMITS.signup)` on register. |
| **Vendor isolation** | ✅ | Email and Storage behind adapter interfaces with mock fallbacks. |

---

## 6. File Map

```
libra-keeper/
├── prisma/schema.prisma                    ← Source of truth for DB schema (Prisma Migrate)
├── supabase/migrations/                    ← RLS policies, triggers, storage buckets (mirrors Prisma)
│   ├── 001_create_user_triggers.sql        ← profiles + handle_new_user + set_updated_at
│   └── 002_create_app_tables.sql           ← all tables + RLS policies
├── docs/
│   ├── platform-architecture-comparison.md ← Supabase vs Convex vs SpacetimeDB vs Neo4j
│   ├── architecture-security.md            ← This file
│   └── supabase-postgres-migration-plan.md ← DB hosting migration plan
├── src/
│   ├── lib/
│   │   ├── db.ts                           ← Prisma client with pg adapter (import "server-only")
│   │   ├── auth-utils.ts                   ← getServerAuth(), requireAuth(), requireAdmin()
│   │   ├── redis.ts                        ← 3-tier Redis adapter
│   │   ├── supabase/                       ← Client factories (browser, server, middleware, admin)
│   │   ├── security/                       ← rate-limit.ts, csrf.ts, rate-limit-overrides.ts
│   │   └── adapters/                       ← email.ts, storage.ts
│   └── hooks/
│       ├── use-auth.ts                     ← Production-hardened auth hook
│       ├── use-session.ts                  ← NextAuth-compatible shim
│       └── use-feature-flags.tsx           ← SWR-based feature flag hooks
└── next.config.ts                          ← CSP headers + PWA + standalone output
```

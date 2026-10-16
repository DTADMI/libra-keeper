<!-- CLUSTER-C CANONICAL: NF-root rules. Project-specific delta below. -->
> **Canonical rules/process**: `../../../docs/technical/performance-optimization.md` (NF root). This doc keeps project-specific values/catalog only.
# Performance Optimization

LibraKeeper performance strategy. Last updated: 2026-10-16 (audited against the code).

## Rendering and caching strategy (PPR)

The project enables `cacheComponents: true` (Next 16 Partial Prerendering). The
documented per-route exports (`force-dynamic`, `revalidate`, `dynamicParams`) are
**neutralised in the code**, because they are incompatible with Cache Components:
each route is a static shell plus streamed dynamic content. Do not re-add them;
the comments in `app/page.tsx`, `app/[locale]/page.tsx` and
`app/[locale]/layout.tsx` mark exactly where they were removed.

| Route | Behaviour | Notes |
|-------|-----------|-------|
| `/` (root) | Dynamic (locale redirect) | Never cached; redirects by locale |
| `/[locale]` (landing) | PPR: static shell + dynamic hole | Public page |
| `/(protected)/*` | Dynamic | Auth-gated, no caching |

Next's client router cache is tuned in `next.config.ts` (`experimental.staleTimes`):
`dynamic: 30` seconds, `static: 300` seconds.

## Caching layers

| Layer | Technology | TTL | Scope |
|-------|-----------|-----|-------|
| Feature flags | In-process `Map` (`lib/feature-flags-pg.ts`) | 2 s (`CACHE_MS = 2_000`) | Server-side flag reads |
| Application cache | Postgres `cache` table (`lib/pg-cache.ts`) | 300 s (`CACHE_DEFAULT_TTL`) | Computed values |
| Application cache (Redis) | Redis, only when `REDIS_CACHE=true` | `min(ttl, 60)` s | Same keys, faster path |
| Client cache | TanStack React Query (`components/providers/query-provider.tsx`) | staleTime 30 s, gcTime 5 min | Items, loans, messages, suggestions |
| Router cache | Next `experimental.staleTimes` | dynamic 30 s, static 300 s | Client-side navigation |
| PWA cache | Service Worker (`next-pwa`) | Cache-first for static | Offline support, installable app |

Flags are **not** served from Redis: the earlier "flags 30 s" figure was the
React Query `staleTime` on the client, not a server cache.

## Database

- GIN index on the full-text vector: `idx_items_search_vector` on
  `public.items (search_vector)`, with a trigger keeping it updated
  (`supabase/migrations/003_full_text_search.sql`).
- Connection pooling via `@prisma/adapter-pg`: `new Pool({ connectionString })`
  in `lib/db.ts`. The limit is **node-postgres' default (max 10)**; it is not set
  explicitly, so it follows the library default rather than a chosen value.
- RLS policies provide defense-in-depth without query overhead.
- Pagination is enforced on list endpoints: `take` is capped at 100 with a
  default of 50 (`app/api/items/route.ts`, `app/api/loans/route.ts`); the
  conversation list in `app/api/messages/route.ts` is capped at 50.

## Bundle optimization

- `optimizePackageImports` for `lucide-react`, `date-fns` and the Radix packages
- PWA with `next-pwa` (enabled in production or with `ENABLE_PWA=true`), offline
  fallback `/offline`
- Service worker caches static assets at build time
- `output: "standalone"` for optimized deployments

## Query optimization

- React Query `staleTime: 30s` prevents redundant fetches
- `refetchOnWindowFocus: false` reduces unnecessary network calls
- Optimistic updates for likes, comments, messages
- Query invalidation scoped to affected keys only

## Monitoring

- Vercel Analytics (`@vercel/analytics`, mounted in `app/layout.tsx`)
- Vercel Speed Insights (`@vercel/speed-insights`, mounted in `app/layout.tsx`)
- Console-based logger with structured format

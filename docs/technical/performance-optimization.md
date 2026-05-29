# Performance Optimization

LibraKeeper performance strategy. Last updated: 2026-05-29.

## SSR Strategy

| Route | Strategy | revalidate | Notes |
|-------|----------|------------|-------|
| `/` (root) | `force-dynamic` | N/A | Locale redirect — must never cache |
| `/[locale]` (landing) | ISR | 3600s | Static public page, revalidated hourly |
| `/[locale]/layout` | Static | `dynamicParams: false` | Only pre-generated FR/EN locales |
| `/(protected)/*` | Dynamic | N/A | Auth-gated, no caching |

## Caching Layers

| Layer | Technology | TTL | Scope |
|-------|-----------|-----|-------|
| Database queries | Prisma + connection pool | N/A | pg Pool (max 10 connections) |
| Application cache | Redis (Upstash/ioredis/memory) | Varies | Feature flags (30s), settings (60s), rate limit data |
| Client cache | TanStack React Query | staleTime: 30s, gcTime: 5min | Items, loans, messages, suggestions |
| CDN cache | Vercel Edge Network | Configured via `revalidate` | Static pages, public assets |
| PWA cache | Service Worker (next-pwa) | Cache-first for static | Offline support, installable app |

## Revalidation Tiers

| Tier | Use Case | Revalidation |
|------|----------|--------------|
| Static | Landing page, public info | 3600s (1 hour) |
| Frequent | Item lists, search results | 30s (staleTime) |
| Real-time | Activity feed, loan status | Supabase Realtime subscriptions |
| Never | Admin pages, auth-gated content | Dynamic (no cache) |

## Bundle Optimization

- `optimizePackageImports` configured for `lucide-react` and `date-fns`
- PWA with `next-pwa` for offline capability
- Service worker caches static assets at build time
- `output: "standalone"` for optimized Docker deployments

## Query Optimization

- React Query `staleTime: 30s` prevents redundant fetches
- `refetchOnWindowFocus: false` reduces unnecessary network calls
- Optimistic updates for likes, comments, messages
- Query invalidation scoped to affected keys only

## Database

- GIN index on full-text search vector
- Connection pooling via `@prisma/adapter-pg`
- RLS policies provide defense-in-depth without query overhead
- Pagination enforced on list endpoints (max 100 per page)

## Monitoring

- Vercel Analytics (user behavior)
- Vercel Speed Insights (Core Web Vitals)
- Console-based logger with structured format

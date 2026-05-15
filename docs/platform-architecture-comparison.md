# Platform Architecture Comparative Analysis

> Supabase vs Convex vs SpacetimeDB vs Neo4j — analyzed across QuestHunt, StoryForge, and LibraKeeper.
> Migration effort is de-prioritized: recommendations are based on technical merit for each project's specific requirements.
> Last updated: 2026-05-15

---

## Executive Summary

| Platform | QH | SF | LK | Summary |
|----------|----|----|-----|---------|
| **Supabase** | ✅ **Optimal** — PostGIS mandatory | ✅ **Optimal** — Prisma for deep relational data | ✅ **Optimal** — Simple model, open source, all-in-one |
| **Convex** | ❌ No geospatial | 🟡 Strong for co-authoring (reactive) | 🟡 Simpler DX, but vendor lock-in |
| **SpacetimeDB** | ❌ No PostGIS | ❌ Not a content platform | ❌ Overkill for library management |
| **Neo4j** | ❌ No PostGIS | 🟡 Great for character/plot graphs — but needs separate auth | ❌ No graph relationships to model |

**Key takeaway:** Supabase is the only platform viable across all three projects. The alternatives each have niche strengths but fatal flaws for at least one project. For QH, PostGIS is the non-negotiable requirement that eliminates all alternatives. For SF, Neo4j's graph model is genuinely appealing for story-world data. For LK, simplicity and open-source independence favor Supabase over Convex.

---

## 1. Platform Profiles

### 1.1 Supabase

**What is it?** Supabase is an open-source Firebase alternative built on PostgreSQL. It provides a managed database with built-in authentication, file storage, edge functions, and realtime subscriptions — all accessed through a unified SDK.

**Core components:**

| Component | What it does | Equivalent to |
|-----------|-------------|---------------|
| **Postgres Database** | Full SQL database with extensions (PostGIS, pgvector, pg_cron) | Firebase Firestore, but relational |
| **Auth** | Email/password, OAuth (Google, GitHub, Apple, etc.), magic links, phone auth | Firebase Auth |
| **Storage** | File storage with access rules tied to auth | Firebase Storage |
| **Realtime** | WebSocket-based subscriptions to database changes (INSERT/UPDATE/DELETE) | Firebase Realtime Database |
| **Edge Functions** | Serverless functions running Deno at the edge | Firebase Cloud Functions |
| **Row Level Security (RLS)** | Database-enforced access rules using the authenticated user's identity | No direct Firebase equivalent — this is Postgres-native |

**How data flows:**
```
Browser/App
    │
    ├─ @supabase/ssr ──── JWT in cookies ────► Supabase Postgres
    │                                              │
    │                                              ├─ RLS checks auth.uid()
    │                                              ├─ Executes query
    │                                              └─ Returns filtered rows
    │
    ├─ Supabase Realtime ── WebSocket ─────────► LISTEN/NOTIFY
    │                                              └─ Pushes changes to subscribers
    │
    └─ Supabase Storage ── REST ───────────────► S3-compatible storage
                                                   └─ Access rules via RLS
```

**Key strengths:**
- PostgreSQL ecosystem (Prisma, Drizzle, raw SQL, 100+ extensions)
- PostGIS for geospatial queries (critical for GPS-based apps)
- Row Level Security enforces access at the database engine level
- Open source — can self-host if needed
- Massive community and documentation
- Free tier is generous (500MB database, 2 projects, 50MB storage)

**Key weaknesses:**
- Realtime requires explicit channel setup (not automatic)
- Connection pooling needed for serverless (PgBouncer via pooler URL)
- RLS policies must be written in SQL (learning curve)
- Cold starts on Edge Functions
- Can't use Prisma with RLS (Prisma bypasses RLS — see Section 5)

---

### 1.2 Convex

**What is it?** Convex is a full-stack serverless platform where your database schema, server functions, and realtime subscriptions are all defined in TypeScript. There is no separate database server to manage, no ORM, and no migration files — you write TypeScript and Convex handles the rest.

**Core components:**

| Component | What it does | How it differs from Supabase |
|-----------|-------------|------------------------------|
| **Database** | Custom document-relational engine (not PostgreSQL) | No SQL. Schema defined in TS with `defineTable()`. |
| **Functions** | Serverless mutations, queries, and actions (JS/TS) | Functions are ACID by default. No separate "edge function" concept. |
| **Realtime** | **Automatic** — every query subscribes to its data and re-renders on change | Supabase requires explicit channel setup. Convex is automatic. |
| **Auth** | Built-in via Auth.js or custom | Similar to Supabase, but no hosted auth UI. |
| **File Storage** | Built-in file storage with automatic caching | Similar to Supabase Storage. |
| **Scheduling** | Built-in cron jobs and delayed execution | Supabase uses pg_cron or Edge Function cron triggers. |

**How data flows:**
```
Browser/App
    │
    ├─ useQuery("getItems") ─── WebSocket ───► Convex Server
    │                                              │
    │                                              ├─ Runs query function
    │                                              ├─ Returns data
    │                                              └─ Automatically re-runs on data change
    │
    ├─ useMutation("borrowItem") ─── WebSocket ─► Convex Server
    │                                              │
    │                                              ├─ Runs mutation (ACID)
    │                                              ├─ Writes to database
    │                                              └─ Triggers all affected queries to re-run
    │
    └─ All re-renders are automatic — no refetch logic needed
```

**Key strengths:**
- **Zero-config realtime.** Every query is a live subscription. UI always reflects current data.
- **No ORM, no migrations, no connection strings.** Schema is TypeScript. Functions are TypeScript. Everything is TypeScript.
- **ACID transactions by default.** Every mutation is a transaction.
- **Optimistic updates built-in.** Mutations return immediately with predicted results, then reconcile.
- **Type-safe end-to-end.** Schema → query → component types flow automatically.
- **No cold starts.** Functions are always warm.

**Key weaknesses:**
- **Vendor lock-in.** Closed source. Data can be exported but you can't run Convex yourself. If Convex shuts down or changes pricing, migration is a full rewrite.
- **No PostgreSQL.** No PostGIS, no pgvector, no Prisma, no SQL ecosystem. You get what Convex provides.
- **No geospatial support.** Coordinates are just numbers — no spatial indexes, no proximity queries.
- **Smaller ecosystem.** Fewer tutorials, community packages, and StackOverflow answers.
- **Pricing can be opaque.** Charged by function calls + data storage + bandwidth.

---

### 1.3 SpacetimeDB

**What is it?** SpacetimeDB is a relational database system designed specifically for multiplayer games. It combines a database with an application server where game logic runs inside the database as compiled Rust modules (WebAssembly modules also supported). It provides built-in state synchronization and deterministic transaction processing.

**Core components:**

| Component | What it does |
|-----------|-------------|
| **Database** | Custom relational engine with Rust-defined tables |
| **Modules** | Rust code compiled to WASM that runs inside the database |
| **Realtime** | Built-in multiplayer state sync with client prediction |
| **Transactions** | Deterministic ordering — all clients see the same state in the same order |
| **Time Travel** | Can query database state at any point in history |

**Key strengths:**
- Deterministic multiplayer sync (every client sees the exact same game state)
- Logic runs inside the database (no network round-trips for game logic)
- Time-travel debugging (replay any game session)
- Designed by game developers for game developers

**Key weaknesses:**
- **Not a general-purpose backend.** Designed for real-time multiplayer games, not web apps.
- **No built-in auth system.** You must implement authentication yourself.
- **No file storage.** No equivalent to Supabase Storage or Convex file storage.
- **Rust-first** (WASM support is newer). Steep learning curve for non-Rust developers.
- **Very small ecosystem.** Limited documentation, few examples, no Prisma/Drizzle support.
- **No geospatial support.**
- **No managed cloud** (self-hosted or bring-your-own-infra). A cloud product is in development.

---

### 1.4 Neo4j

**What is it?** Neo4j is a graph database. Unlike relational databases (which store data in tables with rows and columns) or document databases (which store nested JSON), Neo4j stores data as **nodes** (entities) connected by **relationships** (edges). It uses a query language called **Cypher** that is purpose-built for traversing connections between entities.

**Core concepts:**

| Concept | SQL equivalent | Neo4j |
|---------|---------------|-------|
| Entity | Row in a table | **Node** with labels (e.g., `(:Character {name: "Frodo"})`) |
| Connection | Foreign key + JOIN | **Relationship** (e.g., `(:Character)-[:KNOWS]->(:Character)`) |
| Query | SELECT ... JOIN ... WHERE | `MATCH (c:Character)-[:APPEARS_IN]->(l:Location) RETURN c, l` |
| Property | Column value | Key-value on node or relationship |

**Key strengths:**
- **Native graph traversal.** "Find all characters connected to Character A through shared locations, events, or relationships" is a single Cypher query — in SQL this would be multiple recursive JOINs.
- **Relationship-first data model.** Connections are first-class citizens, not implicit in foreign keys.
- **Cypher query language** is intuitive for path-finding: `MATCH path = (a)-[*1..3]-(b) RETURN path` finds all nodes connected within 3 hops.
- **AuraDB** is the managed cloud version (comparable to Supabase's managed Postgres).
- **Graph algorithms built-in:** shortest path, centrality, community detection, page rank.
- **Excellent for:** social networks, recommendation engines, knowledge graphs, character relationship maps, plot connection graphs.

**Key weaknesses:**
- **No built-in auth.** You need a separate auth service (Supabase Auth, Auth0, etc.).
- **No built-in file storage.** You need a separate storage service.
- **No RLS equivalent.** Access control is handled in application code or via Neo4j's enterprise RBAC.
- **Not ideal for simple CRUD.** If your data is flat and non-interconnected, Neo4j adds complexity without benefit.
- **Learning curve.** Cypher is different from SQL. Graph modeling requires thinking in nodes and relationships.
- **Ecosystem smaller than PostgreSQL.** Fewer ORMs, tools, and community resources.
- **Overhead for simple apps.** Running Neo4j for a basic CRUD app is like using a supercomputer for arithmetic.

---

## 2. Comprehensive Feature Matrix

| Feature | Supabase | Convex | SpacetimeDB | Neo4j |
|---------|----------|--------|-------------|-------|
| **Database type** | PostgreSQL (relational) | Custom document-relational | Custom relational | Graph (property graph) |
| **Query language** | SQL | TypeScript functions | Rust modules | Cypher |
| **Auth (built-in)** | ✅ Email, OAuth, magic link, phone | ✅ Via Auth.js or custom | ❌ Bring your own | ❌ Bring your own |
| **File storage** | ✅ S3-compatible, RLS-protected | ✅ Built-in with caching | ❌ None | ❌ None |
| **Realtime** | ✅ Explicit subscriptions (WebSocket + LISTEN/NOTIFY) | ✅ **Automatic** (every query is reactive) | ✅ Built-in multiplayer sync | ❌ None built-in |
| **Row/Node-level security** | ✅ RLS (Postgres-native) | ✅ Function-level auth checks | ❌ Application-level | ❌ Enterprise RBAC only |
| **Geospatial (PostGIS)** | ✅ Native PostGIS | ❌ None | ❌ None | ❌ Limited (point distance only) |
| **Full-text search** | ✅ PostgreSQL tsvector | ❌ Limited | ❌ None | ✅ Full-text indexes |
| **Vector search (AI)** | ✅ pgvector extension | ❌ None | ❌ None | ✅ Vector indexes (v5+) |
| **Graph traversal** | ❌ Recursive CTEs only | ❌ None | ❌ None | ✅ **Native** (Cypher path queries) |
| **ACID transactions** | ✅ PostgreSQL-native | ✅ Automatic | ✅ Deterministic | ✅ ACID compliant |
| **Open source** | ✅ MIT license | ❌ Closed source | ✅ BDSL license | ✅ Community Edition (GPL) |
| **Self-hostable** | ✅ Yes | ❌ No | ✅ Yes | ✅ Yes |
| **Managed cloud** | ✅ supabase.com | ✅ convex.cloud | 🟡 In development | ✅ AuraDB |
| **Free tier** | ✅ 500MB DB, 2 projects | ✅ 1GB data, 5M calls | 🟡 Self-hosted is free | ✅ AuraDB Free (200MB) |
| **ORM support** | ✅ Prisma, Drizzle, Knex | ❌ Schema-in-code only | ❌ None | ❌ Limited (neo4j-ogm, not Prisma) |
| **Vercel integration** | ✅ `@supabase/ssr` in Next.js | ✅ `convex` package in Next.js | ❌ No official integration | ✅ `neo4j-driver` in API routes |
| **Type safety** | ✅ Generated types from DB | ✅ TypeScript-native schema | ✅ Rust types | ✅ TypeScript types via introspection |
| **Cold starts** | 🟡 Edge Functions have cold starts | ✅ No cold starts | ✅ Always running | 🟡 AuraDB is always running |
| **Migrations** | SQL files or Prisma Migrate | Push-based (schema evolution in code) | Rust module redeployment | Cypher schema commands |
| **Best for** | General apps, geospatial, relational data | Real-time collaborative apps, simple DX | Multiplayer games | Social graphs, recommendations, knowledge graphs |

---

## 3. Vercel Compatibility

All four platforms can connect to Vercel-hosted Next.js apps — but the integration depth varies.

### 3.1 Supabase + Vercel

**Integration quality: Excellent.** Supabase and Vercel have a formal partnership.

| Integration method | Where | Notes |
|-------------------|-------|-------|
| `@supabase/ssr` | Server Components, API routes, Middleware | Cookie-based auth, automatic session refresh |
| `@supabase/supabase-js` | Client Components, API routes | Singleton pattern via `globalThis` |
| Vercel Integration | vercel.com/integrations | Auto-provisions Supabase project, sets env vars |
| Vercel Cron Jobs | `vercel.json` | Triggers Edge Functions or API routes on schedule |

**Architecture flow:**
```
Next.js on Vercel
    │
    ├─ Server Component ── @supabase/ssr ──► Supabase Postgres
    │   (cookies forwarded automatically)       │
    │                                           └─ RLS enforced
    ├─ Client Component ── @supabase/ssr ──► Supabase Auth
    │   (document.cookie)                      └─ Session token in cookie
    └─ API Route ── supabase-js ────────────► Supabase Postgres
        (service role key for admin ops)        └─ RLS bypassed
```

### 3.2 Convex + Vercel

**Integration quality: Excellent.** Officially documented and supported.

| Integration method | Where | Notes |
|-------------------|-------|-------|
| `convex` npm package | Client Components, Server Components | `useQuery()`, `useMutation()` in client; `fetchQuery()` in server |
| Convex Client Provider | Root layout | Wraps app with `ConvexClientProvider` |
| `ConvexHttpClient` | API routes, Server Components | Server-side queries without WebSocket |
| Vercel deploy | `npx convex deploy` | Separate from Vercel build — deploy function changes independently |
| Environment | `CONVEX_DEPLOYMENT` env var | Points Next.js to the correct Convex deployment (prod/preview) |

**Architecture flow:**
```
Next.js on Vercel                    Convex Cloud
    │                                      │
    ├─ "use client" ─── WebSocket ──────► │
    │   useQuery("getItems")              │ Runs query function
    │   ◄── auto-reactive results ────── │ Re-runs on data change
    │                                      │
    └─ Server Component ── HTTP ────────► │
        fetchQuery("getItems")            │ Runs query once (no subscription)
        ◄── static result ────────────── │
```

**Important:** Convex functions deploy separately from Vercel. Changes to Convex schema or functions require `npx convex deploy` (not a Vercel deploy). This means your backend and frontend deployments are independent.

### 3.3 SpacetimeDB + Vercel

**Integration quality: Poor.** No official Next.js integration.

| Integration method | Where | Notes |
|-------------------|-------|-------|
| Custom HTTP API | API routes | You'd build a REST/WebSocket bridge in your API route |
| WebSocket directly | Client Components | Connect to SpacetimeDB from the browser |
| No middleware integration | — | Auth must be entirely custom |

**Architecture flow:**
```
Next.js on Vercel                    Your Server / SpacetimeDB Cloud
    │                                      │
    └─ API Route ─── HTTP fetch ────────► │ Custom bridge
        (manual auth, manual serialization)└─ SpacetimeDB Rust module
```

**Verdict:** SpacetimeDB is not designed to integrate with web frameworks. It expects direct WebSocket connections from game clients. Using it with Next.js is possible but requires building a full bridge layer.

### 3.4 Neo4j + Vercel

**Integration quality: Good.** Works through API routes and server components.

| Integration method | Where | Notes |
|-------------------|-------|-------|
| `neo4j-driver` | API routes, Server Components | Direct Cypher queries |
| `@neo4j/graphql` | API routes | Auto-generates GraphQL API from Neo4j schema |
| No client-side SDK | — | Must proxy through API routes (don't expose credentials) |
| AuraDB connection | API routes | Connect via bolt:// or neo4j+s:// protocol |

**Architecture flow:**
```
Next.js on Vercel                    Neo4j AuraDB
    │                                      │
    └─ API Route ─── neo4j-driver ──────► │
        const session = driver.session()   │ Runs Cypher query
        const result = await session.run(  │ Returns nodes + relationships
          'MATCH (c:Character)-[:APPEARS_IN]->(l:Location) RETURN c, l'
        )
        ◄── structured results ────────── │
```

**Important:** Neo4j AuraDB runs independently (not on Vercel). It's always-on, no cold starts. The `neo4j-driver` is a lightweight TCP driver, not an HTTP API — it opens a persistent connection pool, which works well in serverless if you cache the driver instance.

---

## 4. Prisma Compatibility

Prisma is an ORM (Object-Relational Mapper) for TypeScript/JavaScript. It generates a type-safe client from your database schema and provides a fluent query API.

| Platform | Prisma works? | Details |
|----------|:------------:|---------|
| **Supabase** | ✅ Yes | Via `@prisma/adapter-pg` connecting to Supabase's PgBouncer pooler URL. **Caveat:** Prisma bypasses RLS because it connects as the database user, not as `auth.uid()`. Authorization must be handled in application code. This is StoryForge's current architecture. |
| **Convex** | ❌ No | Convex has its own schema system (`defineTable()`) and its own query engine. There is no PostgreSQL underneath, so Prisma cannot connect. |
| **SpacetimeDB** | ❌ No | Tables are defined in Rust, not SQL. No PostgreSQL connection available. |
| **Neo4j** | ❌ No | Prisma only supports relational databases (PostgreSQL, MySQL, SQLite, SQL Server, MongoDB). Neo4j is a graph database with a fundamentally different data model. There are Neo4j-specific ORMs (`neo4j-ogm` for JS, `neogma`) but they are not Prisma-compatible. |

**The Prisma + Supabase RLS tradeoff:**

When Prisma connects to Supabase via the pg adapter, it authenticates as the database user specified in the connection string. This means RLS policies — which rely on `auth.uid()` to identify the current user — are **completely bypassed**. The database sees all Prisma queries as coming from the database user, not from the authenticated end user.

This is not a bug. It's a consequence of the architecture:
- Supabase SDK forwards the user's JWT → Postgres sees `auth.uid() = user_id` → RLS activates
- Prisma connects directly → Postgres sees the DB user → RLS is inert

**The mitigation (StoryForge pattern):**
1. Write RLS policies anyway (defense-in-depth for direct DB access)
2. Handle authorization in route handlers (app-level guards)
3. Filter queries explicitly: `prisma.item.findMany({ where: { userId: user.id } })`

**Should you use Prisma with Supabase?**
- **If your data is deeply relational** (3+ levels of nesting, many-to-many joins) → Prisma's `include` saves multiple round-trips. **Use Prisma + app-level guards.**
- **If your access model is complex** (4+ user tiers, public/private data) → RLS enforces security at the database level. **Use Supabase SDK directly.**
- **If both are true** → You have a difficult architectural decision. StoryForge chose Prisma + app guards. QuestHunt chose Supabase SDK + RLS.
- **If neither is true** (simple data, simple access) → Either works. LibraKeeper falls here.

---

## 5. Realtime/Reactivity Deep-Dive

### 5.1 Does Supabase offer automatic reactivity?

**No — Supabase Realtime is explicit, not automatic.** But it IS built-in and powerful.

**How Supabase Realtime works:**

Under the hood, Supabase Realtime uses PostgreSQL's `LISTEN`/`NOTIFY` mechanism combined with WebSockets:

1. You create a **channel** and subscribe to specific database events
2. When a row is inserted, updated, or deleted, PostgreSQL fires a NOTIFY
3. Supabase Realtime picks up the NOTIFY and pushes the change to subscribed clients via WebSocket
4. You handle the change in your client code (update state, invalidate cache, show toast)

**Code example — "another author adds a character" (StoryForge):**

```typescript
// components/project/character-list.tsx
"use client"

import { useEffect } from "react"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { createBrowserClient } from "@/lib/supabase/client"

export function CharacterList({ projectId }: { projectId: string }) {
  const queryClient = useQueryClient()
  const supabase = createBrowserClient()

  const { data: characters } = useQuery({
    queryKey: ["characters", projectId],
    queryFn: () => supabase.from("characters").select("*").eq("project_id", projectId),
  })

  useEffect(() => {
    const channel = supabase
      .channel(`project-${projectId}-characters`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "characters",
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          // payload.new is the newly inserted character
          // Option A: Optimistic insert into cache
          queryClient.setQueryData(
            ["characters", projectId],
            (old: Character[] | undefined) => [...(old ?? []), payload.new as Character],
          )
          // Option B: Invalidate and refetch
          // queryClient.invalidateQueries({ queryKey: ["characters", projectId] })
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "characters",
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          queryClient.setQueryData(
            ["characters", projectId],
            (old: Character[] | undefined) =>
              old?.map((c) => (c.id === payload.new.id ? { ...c, ...payload.new } : c)) ?? [],
          )
        },
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "characters",
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          queryClient.setQueryData(
            ["characters", projectId],
            (old: Character[] | undefined) =>
              old?.filter((c) => c.id !== payload.old.id) ?? [],
          )
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [projectId, supabase, queryClient])

  return (
    <ul>
      {characters?.map((c) => (
        <li key={c.id}>{c.name}</li>
      ))}
    </ul>
  )
}
```

**Code example — "someone borrows an item" (LibraKeeper):**

```typescript
// hooks/use-item-subscription.ts
"use client"

import { useEffect } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { createBrowserClient } from "@/lib/supabase/client"

export function useItemSubscription(itemId: string) {
  const queryClient = useQueryClient()
  const supabase = createBrowserClient()

  useEffect(() => {
    const channel = supabase
      .channel(`item-${itemId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "loans",
          filter: `item_id=eq.${itemId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["item", itemId] })
          queryClient.invalidateQueries({ queryKey: ["loans"] })
          toast.info("Someone borrowed this item")
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "loans",
          filter: `item_id=eq.${itemId}`,
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ["item", itemId] })
          if (payload.new.status === "APPROVED") {
            toast.success("Borrow request approved")
          } else if (payload.new.status === "RETURNED") {
            toast.success("Item returned")
          }
        },
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `item_id=eq.${itemId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["item", itemId] })
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [itemId, supabase, queryClient])
}
```

### 5.2 How Convex handles the same scenarios

**"Another author adds a character" — zero additional code:**

```typescript
// components/project/character-list.tsx
"use client"

import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

export function CharacterList({ projectId }: { projectId: string }) {
  // This query automatically re-runs whenever characters change —
  // no channel setup, no invalidation, no useEffect
  const characters = useQuery(api.characters.listByProject, { projectId })

  return (
    <ul>
      {characters?.map((c) => (
        <li key={c._id}>{c.name}</li>
      ))}
    </ul>
  )
}
```

The Convex client maintains a persistent WebSocket connection. When any mutation touches the `characters` table, the query automatically re-executes and pushes updated results to all subscribed clients. **No polling. No manual subscriptions. No cache invalidation.**

**"Someone borrows an item" — equally automatic:**

```typescript
"use client"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

export function ItemDetail({ itemId }: { itemId: string }) {
  // Auto-updates when loans or comments change
  const item = useQuery(api.items.getById, { itemId })
  const loans = useQuery(api.loans.listByItem, { itemId })

  return (
    <div>
      <h1>{item?.title}</h1>
      <p>Status: {loans?.some(l => l.status === "APPROVED") ? "Borrowed" : "Available"}</p>
    </div>
  )
}
```

### 5.3 Key differences in approach

| Aspect | Supabase Realtime | Convex Reactivity |
|--------|------------------|-------------------|
| **Setup** | Explicit channel + event handlers + cleanup | Zero setup. `useQuery()` auto-subscribes. |
| **Granularity** | Per-table, per-event, with filters | Per-query — any data the query touches triggers re-run |
| **Cache integration** | Must manually integrate with React Query/SWR | Built-in. Convex is its own state manager. |
| **Network** | WebSocket (via Supabase client) | WebSocket (via Convex client) |
| **Offline** | Not supported | Built-in optimistic updates; mutation queue survives disconnection |
| **Consistency** | Eventual (you receive the change event, then refetch) | Immediate (query re-runs with latest data) |
| **Code volume** | ~30 lines per subscription | ~3 lines per query |
| **Control** | Fine-grained: choose exactly what to subscribe to | Coarse: query re-runs when any touched data changes |

### 5.4 Can you achieve Convex-like reactivity with Supabase?

**Not exactly, but you can get close.** The pattern is:

1. **Supabase Realtime** for push-based notifications of data changes
2. **TanStack React Query** for client-side cache management
3. **Channel subscriptions** that invalidate React Query cache on changes

This gives you:
- ✅ Real-time updates from the database
- ✅ React Query's caching, deduplication, and optimistic updates
- ✅ Fine-grained control over what triggers updates

This does NOT give you:
- ❌ Automatic query re-execution (you choose what to invalidate)
- ❌ Built-in optimistic mutation reconciliation (you handle it manually)
- ❌ Offline mutation queue (you'd need to build or add a library)

**The practical difference:** With Supabase, you write ~30 lines of channel setup per real-time feature. With Convex, you write zero. For an app with 5 real-time features, that's 150 lines vs 0 lines. For an app with 50 real-time features, the difference is significant.

---

## 6. Project-by-Project Analysis

### 6.1 QuestHunt (QH)

**Project profile:**
- Type: Location-based quest/puzzle platform
- Scale: Public-facing, multi-tenant, production
- Users: Anonymous visitors, players, creators, admins
- Key feature: GPS-based questing, proximity triggers, geospatial waypoints
- Data model: 207 tables, mostly flat, tiered access
- Current stack: Supabase SDK + Supabase Auth + Upstash Redis

**Non-negotiable requirement: PostGIS.**

QH uses PostGIS for:
- Finding quests near a user's GPS location: `ST_DWithin(waypoint_location, user_location, radius)`
- Geofencing puzzle triggers
- Proximity-based leaderboards
- Mapping quest coverage areas

**Platform analysis:**

| Platform | Geospatial | Verdict |
|----------|:----------:|---------|
| Supabase | ✅ PostGIS native | **Only viable option** |
| Convex | ❌ No geospatial | Eliminated immediately |
| SpacetimeDB | ❌ No geospatial | Eliminated immediately |
| Neo4j | ❌ Point distance only (not PostGIS-level) | Eliminated — no ST_DWithin, no spatial indexes |

**QH Conclusion:** Supabase is the ONLY option. PostGIS is irreplaceable. The question is not "which platform" but "how to optimize the existing Supabase architecture."

---

### 6.2 StoryForge (SF)

**Project profile:**
- Type: Creative writing and world-building platform
- Scale: Multi-user, collaborative content creation
- Users: Authors (create/manage), readers (consume)
- Key feature: Rich text editor with character/location/timeline management, AI writing suggestions
- Data model: 19 models, deeply relational (3-level nesting, many-to-many)
- Planned but not built: Character relationship graphs, co-authoring, EPUB export
- Current stack: Prisma + Supabase Auth + Supabase Postgres + Upstash Redis

**What makes SF's data model a graph?**

```
┌──────────┐  APPEARS_IN   ┌──────────┐  LOCATED_IN   ┌──────────┐
│ Character├──────────────►│TimelineEvent│◄─────────────┤ Location │
└────┬─────┘               └─────┬─────┘               └────┬─────┘
     │                           │                          │
     │ KNOWS                     │ BELONGS_TO               │
     ▼                           ▼                          ▼
┌──────────┐               ┌──────────┐               ┌──────────┐
│ Character├──────────────►│  Project  │◄─────────────┤ Location │
└──────────┘  CREATED_IN   └──────────┘  SET_IN       └──────────┘
```

This is a property graph. Characters know each other, appear at locations during events, locations host events, events involve characters — every entity is interconnected.

**Platform analysis (migration effort de-prioritized):**

| Platform | Strengths for SF | Weaknesses for SF | Overall |
|----------|-----------------|-------------------|---------|
| **Supabase + Prisma** | Prisma handles deep relational queries. Auth + Storage + DB in one vendor. Working today. | No native graph traversal. Character relationships need explicit JOINs or recursive CTEs. Realtime requires explicit channel setup. | ✅ **Optimal pragmatic choice.** Prisma's deep includes match SF's relational data. |
| **Supabase + Neo4j** | Hybrid: Supabase for auth/storage/content, Neo4j for character/plot graphs. Best-in-class for each domain. | Two databases to manage. No Prisma for graph data. Must sync user identity between systems. Complex architecture. | 🟡 **Optimal technical choice for graph features.** Overkill unless character relationship graphs are core. |
| **Convex** | Auto-reactive co-authoring. Zero realtime setup. No migrations. Simpler DX than Supabase. | No Prisma. Must rewrite all queries. Closed source. No deep relational queries — more manual joins. | 🟡 **Strong for collaboration features.** Best if real-time co-authoring becomes a priority. |
| **SpacetimeDB** | None | Not a content platform. No rich-text support. No auth. Rust-only. | ❌ Not applicable. |
| **Neo4j only** | Perfect for character/plot relationship graphs. Native path traversal. | No auth. No storage. No realtime. Must combine with other services. | ❌ Not viable alone. Must be hybrid. |

**Neo4j for SF — concrete example of what becomes easier:**

```cypher
// "Find all characters connected to Frodo through shared locations or events, up to 3 hops"
MATCH path = (frodo:Character {name: "Frodo"})-[*1..3]-(other:Character)
WHERE frodo <> other
RETURN other.name, length(path) AS distance, [rel in relationships(path) | type(rel)] AS connection_types
ORDER BY distance
```

In SQL (with Prisma or Supabase SDK), this would require recursive Common Table Expressions (CTEs) or multiple round-trips. In Cypher, it's a single query.

**SF Recommendation — two-tier:**

| Priority | Platform | When to use |
|----------|---------|-------------|
| **Pragmatic (today)** | Supabase + Prisma | Current architecture is working. Keep it for all content CRUD. |
| **Technical best (future)** | Supabase (auth/storage) + Neo4j (graph data) | When character relationship graphs, plot connections, and story-world visualization become core features. Add Neo4j alongside Supabase, not replacing it. |
| **Alternative (collab focus)** | Convex | If real-time co-authoring becomes the primary feature and the relational complexity is acceptable. |

---

### 6.3 LibraKeeper (LK)

**Project profile:**
- Type: Personal library management system
- Scale: Small-group (single admin + friends/family)
- Users: Admin (owner), Users (borrowers)
- Key feature: Item catalog, borrow/lend tracking, activity feed
- Data model: 11 tables, 2-level nesting, simple FK relationships
- Current stack: Prisma + Supabase Auth (Phase 2a) + Upstash Redis (Phase 1)

**What LK's data model looks like:**

```
┌──────┐  owns    ┌──────┐  borrows  ┌──────┐
│ User │◄────────┤ Loan ├──────────►│ Item │
└──┬───┘         └──────┘           └──┬───┘
   │                                   │
   │ writes                            │ has
   ▼                                   ▼
┌──────┐                            ┌──────┐
│Comment├──────────────────────────►│ Tag  │
└──────┘         about              └──────┘
```

This is a standard relational model. No graph-like interconnectedness. Items don't relate to other items. Users don't have relationships with other users beyond messaging. There are no transitive paths to traverse.

**Platform analysis:**

| Platform | Strengths for LK | Weaknesses for LK | Overall |
|----------|-----------------|-------------------|---------|
| **Supabase + Prisma** | Already working. Auth + DB + Storage in one. Prisma ergonomics for type-safe queries. RLS as defense-in-depth. Open source. | Realtime requires explicit setup (but LK has few realtime needs). | ✅ **Optimal.** All-in-one, open source, appropriate scale. |
| **Convex** | Simpler DX. Auto-reactive activity feed (loans, comments update live). No migrations to manage. | Vendor lock-in. Closed source. Can't export to standard SQL. Overkill for LK's scale. | 🟡 **Nicer DX, higher risk.** The simplicity is appealing but the lock-in is hard to justify for a personal project. |
| **Neo4j** | None for LK's use case. | No graph relationships to model. Would add complexity with zero benefit. | ❌ **Wrong tool.** Using Neo4j for LK is like using a supercomputer to run a calculator. |
| **SpacetimeDB** | None. | Not a content platform. | ❌ Not applicable. |

**LK's decision matrix:**

| Factor | Supabase | Convex | Winner |
|--------|----------|--------|--------|
| **Data model fit** | Relational → perfect fit | Relational (with work) → fits | Supabase |
| **Auth complexity** | Binary (admin/user) → simple | Binary → simple | Tie |
| **Realtime needs** | Activity feed, loan status → 2-3 subscriptions | Every query is reactive → effortless | Convex |
| **Vendor independence** | Open source, can self-host, standard Postgres | Closed source, proprietary DB | Supabase |
| **Setup complexity** | Docker, Prisma, migrations, pg adapter | `npx convex dev` → running | Convex |
| **Long-term risk** | Low (Postgres is forever) | Medium (Convex-specific, can't migrate) | Supabase |
| **Free tier fit** | 500MB DB — sufficient for personal library | 1GB data — sufficient | Tie |
| **Learning value** | Teaches SQL, Postgres, RLS — transferable skills | Teaches Convex — non-transferable | Supabase |

**LK Conclusion:** Supabase wins for LK on vendor independence and data model fit. Convex's auto-reactivity is appealing but doesn't outweigh the platform risk for a project that should be durable and ownable. The current Phase 2a architecture (Prisma + Supabase Auth + app-level guards) is the right foundation.

---

### 6.4 VelvetGalaxy (VG)

**Project profile:**
- Type: Adult-themed social platform with marketplace, artists showcase, and toy reviews
- Scale: Multi-user, public-facing social network
- Users: Personal accounts, Organizations ("Moral Persons"), Artists
- Key features: Social feed (SFW/NSFW), DMs with ephemeral media, chat rooms, groups, events, custom relationship types (Dom/Sub, Partner, mutual consent), 3D galaxy network visualization, Stripe marketplace + subscriptions, toy reviews with 3D viewers, artists portfolio/commissions
- Data model: 40+ tables, highly interconnected, graph-like social relationships
- Current stack: Supabase SDK + Supabase Auth + SWR + IndexedDB cache + PostgreSQL rate limiting

**What makes VG's data model a graph:**

```
┌──────────┐  FOLLOWS    ┌──────────┐  MEMBER_OF   ┌──────────┐
│  Profile ├────────────►│  Profile  │◄─────────────┤  Group   │
└────┬─────┘             └────┬─────┘              └────┬─────┘
     │                        │                          │
     │ HAS_RELATIONSHIP       │ FRIENDS                  │ HOSTS
     ▼                        ▼                          ▼
┌──────────┐             ┌──────────┐              ┌──────────┐
│Custom    │◄───────────►│  Profile  │◄────────────┤  Event   │
│Relationship            └──────────┘  RSVPS       └──────────┘
│(Dom/Sub,                │
│ Partner,                │ CREATES
│ mutual)                 ▼
└──────────┘         ┌──────────┐
                     │ Artwork  │
                     │ (Artist  │
                     │ Showcase)│
                     └──────────┘
```

VG has the most genuinely graph-like data of any Nebula Forge project:
- Profiles connected via follows, friendships, custom relationships
- Relationships have types (Dom/Sub, Partner), line styles (solid, dashed, wavy), and mutual consent flows
- The app literally visualizes the social graph in 3D (galaxy-themed network visualization)
- Groups → Members, Events → Attendees, Conversations → Participants

**Platform analysis (migration effort de-prioritized):**

| Platform | Strengths for VG | Weaknesses for VG | Overall |
|----------|-----------------|-------------------|---------|
| **Supabase SDK (current)** | Already working. Supabase Auth + Storage + Realtime integrated. 60+ SQL migrations. RLS on all tables. SWR + IndexedDB caching working well. | No ORM — all queries are manual Supabase SDK calls. Complex nested queries (profile + relationships + artworks) require multiple round-trips. No graph-native queries. | ✅ **Pragmatic choice.** Working and well-integrated. |
| **Supabase + Neo4j hybrid** | Neo4j is purpose-built for VG's social graph. "Find all profiles connected to this profile through relationship type Dom within 3 hops" is a single Cypher query. The 3D galaxy visualization could query Neo4j directly for graph data. Custom relationship types with line styles map naturally to Neo4j relationship properties. | Must sync user identity between Supabase Auth and Neo4j. Two databases to maintain. Artists showcase, marketplace, and toy reviews stay on Supabase. | 🟡 **Strong technical fit for the graph layer.** The 3D social graph + custom relationships are VG's most unique feature. Neo4j makes them first-class. |
| **Convex** | Auto-reactive chat (DMs, rooms) and activity feeds. No manual SWR cache management. Real-time updates for new posts, comments, notifications. Simpler DX than Supabase SDK for complex queries. | No ORM — still manual queries. 40+ tables to migrate. Closed source — content policy risk for an adult platform. No Supabase Auth (would need Auth.js). | 🟡 **Good for real-time features.** But the adult content nature raises platform risk concerns with a proprietary host. |
| **Supabase + Prisma** | Prisma's `include` would reduce round-trips for nested queries (profile + relationships + artworks + posts). Type-safe client. Migration management via Prisma Migrate. | Must rewrite all 60+ SQL migration queries as Prisma schema. Significant effort. Prisma bypasses RLS — need app-level guards. SWR + IndexedDB caching system is independent and can stay. | 🟡 **Adds type safety and query ergonomics.** Not worth the migration cost given 60+ existing SQL migrations, but valuable if starting fresh. |
| **SpacetimeDB** | Multiplayer chat/rooms would benefit from deterministic sync. | Not a game. No auth. No storage. No web framework integration. | ❌ Not applicable. |

**VG's unique platform considerations:**

1. **Adult content policy risk:** VG hosts NSFW content. This makes **vendor lock-in with closed-source platforms (Convex) particularly risky** — a policy change could shut down the app. Supabase is open source and self-hostable, providing an escape hatch if the managed service changes policies. Neo4j Community Edition is also open source (GPL).

2. **Social graph is the core differentiator:** The custom relationship system (Dom/Sub, Partner, mutual consent flows) and 3D galaxy visualization are what make VG unique. Neo4j handles this natively. Supabase handles it with JOINs. The question is whether the graph complexity justifies a second database.

3. **No ORM, no Redis:** VG uses raw Supabase SDK (like QH), PostgreSQL-based rate limiting (no Redis), and SWR instead of TanStack Query. Adding Redis would improve rate limiting and caching. Adding Prisma would add type safety but at high migration cost.

**VG's Neo4j potential — concrete example:**

```cypher
// "Find all profiles in a Dom/Sub relationship with this user, showing the relationship type and line style"
MATCH (dom:Profile {id: $userId})-[:HAS_RELATIONSHIP]->(rel:Relationship {type: "DOM_SUB"})-[:WITH]->(sub:Profile)
OPTIONAL MATCH (dom)-[:FRIENDS_WITH]-(sub)
RETURN sub, rel.line_style, rel.mutual_consent, EXISTS((dom)-[:FRIENDS_WITH]-(sub)) AS are_also_friends
ORDER BY rel.display_order
```

In Supabase SDK, this requires querying `custom_relationship_types`, `user_relationships`, and `friendships` separately, then merging in JavaScript.

**VG Code Example — "Get a profile with relationships, artworks, and groups":**

```typescript
// Supabase SDK (current VG approach — 4 round-trips)
const { data: profile } = await supabase.from("profiles").select("*").eq("id", id).single()
const { data: relationships } = await supabase.from("user_relationships").select("*, custom_relationship_types(*)").eq("user_id", id)
const { data: artworks } = await supabase.from("artworks").select("*").eq("artist_id", id).order("created_at", { ascending: false })
const { data: groups } = await supabase.rpc("get_user_groups", { user_id: id })
const result = { ...profile, relationships, artworks, groups }
```

```cypher
// Neo4j (single query for social graph)
MATCH (p:Profile {id: $id})
OPTIONAL MATCH (p)-[:HAS_RELATIONSHIP]->(rel:Relationship)-[:WITH]->(other:Profile)
OPTIONAL MATCH (p)-[:CREATED]->(a:Artwork)
OPTIONAL MATCH (p)-[:MEMBER_OF]->(g:Group)
RETURN p, collect(DISTINCT {rel: rel, profile: other}) AS relationships,
          collect(DISTINCT a) AS artworks,
          collect(DISTINCT g) AS groups
```

**VG Recommendation:**

| Tier | Platform | Rationale |
|------|----------|-----------|
| **Pragmatic (today)** | Supabase SDK (current stack) | Working well. Keep it. Add Redis for rate limiting + caching (missing piece). |
| **Technical best (graph layer)** | Supabase + Neo4j hybrid | When the 3D galaxy visualization and relationship system become performance bottlenecks or need advanced graph queries. Neo4j for the social graph, Supabase for everything else (auth, storage, marketplace, toy reviews, artists). |
| **Query ergonomics (alternative)** | Supabase + Prisma | If the team wants type-safe queries and automated migrations. High migration cost (60+ SQL files) but long-term DX improvement. Not urgent. |

---

## 7. Migration Paths

### 7.1 From Supabase + Prisma → Supabase SDK (Direct)

LK's current state → pure Supabase like QH.

| Step | Effort | Risk |
|------|--------|------|
| 1. Generate Supabase types from DB schema | 5 min | None |
| 2. Rewrite Prisma queries to Supabase SDK calls (~50 query sites) | 2-3 days | Medium (query logic must match) |
| 3. Replace Prisma Migrate with SQL migration files | 1 day | Low (already have Prisma schema as reference) |
| 4. Add RLS policies (now enforceable) | 1 day | Low (binary access = simple policies) |
| 5. Remove Prisma dependency | 30 min | Low |
| 6. Update CI (remove `prisma generate`) | 15 min | None |

**Total: ~1 week. Risk: Medium.** The main risk is query logic regressions during the rewrite.

### 7.2 From Supabase → Convex

Any project → Convex.

| Step | Effort | Risk |
|------|--------|------|
| 1. Define schema in Convex (`defineTable()`) | 1-2 days | Low |
| 2. Rewrite all queries as Convex functions | 2-3 weeks for SF, 1 week for LK | High (logic must be exactly replicated) |
| 3. Rewrite auth flow (Convex uses Auth.js or custom) | 2-3 days | Medium |
| 4. Replace storage (Convex file storage) | 1 day | Low |
| 5. Replace realtime subscriptions (automatic in Convex) | -1 week (savings!) | None |
| 6. Remove Supabase dependencies | 30 min | Low |
| 7. Data migration (Supabase → Convex) | 1-2 days | High (data integrity) |

**Total: 3-4 weeks for SF, 1-2 weeks for LK. Risk: High.** Data migration and query logic accuracy are the main concerns.

### 7.3 From Supabase → Supabase + Neo4j (Hybrid)

StoryForge only — add Neo4j alongside Supabase.

| Step | Effort | Risk |
|------|--------|------|
| 1. Set up Neo4j AuraDB instance | 15 min | None |
| 2. Define graph model (nodes + relationships) | 2-3 days | Low |
| 3. Build sync layer (Prisma CRUD → Neo4j graph updates) | 3-5 days | Medium (dual-write consistency) |
| 4. Implement graph queries for relationship features | 1-2 weeks | Low |
| 5. Keep Supabase for auth, storage, content CRUD | 0 days (stays as-is) | None |

**Total: 2-3 weeks for SF. Risk: Medium.** The main challenge is keeping the graph in sync with the relational data.

---

## 8. Concrete Code Examples — Same Operation Across Platforms

### Example: "Get an item with its tags, active loans, and comments"

This is the most complex query in LibraKeeper. Let's see how it looks in each platform.

**Supabase + Prisma (LK's current approach):**

```typescript
const item = await prisma.item.findUnique({
  where: { id },
  include: {
    tags: true,
    loans: {
      where: { status: { in: ["PENDING", "APPROVED"] } },
      include: { user: { select: { id: true, name: true } } },
    },
    comments: {
      include: { user: { select: { id: true, name: true, image: true } } },
      orderBy: { createdAt: "desc" },
    },
  },
})
// Single SQL query. All data populated. Fully typed.
```

**Supabase SDK (QH-style):**

```typescript
// Round-trip 1: Item + tags
const { data: item } = await supabase
  .from("items")
  .select("*, tags(*)")
  .eq("id", id)
  .single()

// Round-trip 2: Active loans with user
const { data: loans } = await supabase
  .from("loans")
  .select("*, user:profiles(id, name)")
  .eq("item_id", id)
  .in("status", ["PENDING", "APPROVED"])

// Round-trip 3: Comments with user
const { data: comments } = await supabase
  .from("comments")
  .select("*, user:profiles(id, name, avatar_url)")
  .eq("item_id", id)
  .order("created_at", { ascending: false })

// Manual composition
const result = { ...item, loans, comments }
// 3 round-trips. But RLS is enforced on each.
```

**Convex:**

```typescript
// Schema (convex/schema.ts)
const items = defineTable({
  title: v.string(),
  type: v.union(v.literal("BOOK"), v.literal("MUSIC"), /* ... */),
  status: v.string(),
}).index("by_id", ["_id"])

const loans = defineTable({
  itemId: v.id("items"),
  userId: v.id("users"),
  status: v.string(),
}).index("by_item", ["itemId"]).index("by_user", ["userId"])

const comments = defineTable({
  itemId: v.id("items"),
  userId: v.id("users"),
  content: v.string(),
  createdAt: v.number(),
}).index("by_item", ["itemId"])

// Query (convex/items.ts)
export const getById = query({
  args: { itemId: v.id("items") },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.itemId)
    const tags = await ctx.db.query("tags").withIndex("by_item", q => q.eq("itemId", args.itemId)).collect()
    const loans = await ctx.db.query("loans").withIndex("by_item", q => q.eq("itemId", args.itemId)).filter(q => q.or(q.eq("status", "PENDING"), q.eq("status", "APPROVED"))).collect()
    const comments = await ctx.db.query("comments").withIndex("by_item", q => q.eq("itemId", args.itemId)).order("desc").collect()
    return { ...item, tags, loans, comments }
  }
})

// Client — auto-reactive, auto-typed
const item = useQuery(api.items.getById, { itemId })
```

**Neo4j:**

```typescript
// Graph model (nodes + relationships):
// (:Item {title, type, status})-[:TAGGED_WITH]->(:Tag {name})
// (:User)-[:BORROWED]->(:Loan {status})-[:FOR_ITEM]->(:Item)
// (:User)-[:WROTE]->(:Comment {content})-[:ABOUT]->(:Item)

const result = await session.run(`
  MATCH (item:Item {id: $id})
  OPTIONAL MATCH (item)-[:TAGGED_WITH]->(tag:Tag)
  OPTIONAL MATCH (loan:Loan)-[:FOR_ITEM]->(item)
  WHERE loan.status IN ['PENDING', 'APPROVED']
  OPTIONAL MATCH (user:User)-[:BORROWED]->(loan)
  OPTIONAL MATCH (comment:Comment)-[:ABOUT]->(item)
  OPTIONAL MATCH (author:User)-[:WROTE]->(comment)
  RETURN item,
         collect(DISTINCT tag) AS tags,
         collect(DISTINCT {loan: loan, user: user}) AS loans,
         collect(DISTINCT {comment: comment, author: author}) AS comments
  ORDER BY comment.createdAt DESC
`, { id })

// Single Cypher query. But overkill for this simple relational data.
```

**Comparison:**

| Platform | Lines | Round-trips | Type safety | Realtime |
|----------|------:|:----------:|:-----------:|:--------:|
| Supabase + Prisma | 13 | 1 | ✅ Auto-generated | ❌ (manual) |
| Supabase SDK | 22 | 3 | ✅ Generated types | ❌ (manual) |
| Convex | 15 (query) + 15 (schema) | 1 | ✅ TS-native | ✅ **Auto** |
| Neo4j | 20 | 1 | ⚠️ Manual typing | ❌ (none) |

For LK's query complexity, Prisma is the most concise and type-safe. Convex is close but requires separate schema definition. Supabase SDK requires the most manual composition. Neo4j is overkill for this flat relational query.

---

## 9. Final Recommendations

### By project, ordered by technical merit (migration effort ignored)

#### QuestHunt (QH)

| Rank | Platform | Rationale |
|:----:|----------|-----------|
| 1 | **Supabase** | PostGIS is non-negotiable. No alternative exists. |
| — | Convex | Eliminated: no geospatial. |
| — | SpacetimeDB | Eliminated: no geospatial. |
| — | Neo4j | Eliminated: no PostGIS-equivalent geospatial. |

#### StoryForge (SF)

| Rank | Platform | When to choose |
|:----:|----------|---------------|
| 1 | **Supabase + Prisma** | **Pragmatic best choice.** Working today. Prisma handles deep relational queries perfectly. Auth + Storage + DB in one vendor. |
| 2 | **Supabase + Neo4j hybrid** | **Technical best choice for graph features.** When character relationships, plot connections, and story-world visualization become core. Keep Supabase for auth/storage/content. Add Neo4j for the graph layer. |
| 3 | **Convex** | **Best choice if real-time co-authoring is the priority.** Auto-reactivity makes collaborative editing seamless. But: no Prisma, closed source, migration cost. |
| — | SpacetimeDB | Not applicable. |

#### LibraKeeper (LK)

| Rank | Platform | When to choose |
|:----:|----------|---------------|
| 1 | **Supabase + Prisma** | **Best all-around.** Already working. Open source. Type-safe queries. Auth + DB + Storage in one. Appropriate scale. Transferable skills (Postgres, SQL). |
| 2 | **Supabase SDK** | **If RLS enforcement at DB level is valued above query ergonomics.** Simpler stack (no Prisma). Better security posture. But query code is more verbose. |
| 3 | **Convex** | **If DX simplicity is the top priority and vendor lock-in is acceptable.** Less code, auto-reactivity, no migrations. But proprietary, can't self-host, no standard SQL export. |
| — | Neo4j | No graph relationships to model. Using Neo4j for LK would add complexity with zero benefit. |
| — | SpacetimeDB | Not applicable. |

#### VelvetGalaxy (VG)

| Rank | Platform | When to choose |
|:----:|----------|---------------|
| 1 | **Supabase SDK** | **Pragmatic best choice.** Working today with 60+ SQL migrations. Supabase Auth + Storage + Realtime integrated. SWR + IndexedDB caching. |
| 2 | **Supabase + Neo4j hybrid** | **Technical best choice for the social graph.** The custom relationship system (Dom/Sub, Partner, mutual consent) and 3D galaxy visualization are inherently graph problems. Neo4j handles them natively. Keep Supabase for auth, storage, marketplace, toy reviews, artists. |
| 3 | **Supabase + Prisma** | **If query ergonomics and type safety become priorities.** Prisma's `include` would reduce round-trips for nested social queries. But 60+ SQL migrations to convert. Not urgent. |
| 4 | **Convex** | **If real-time features are the top priority.** Auto-reactive chat, notifications, and activity feeds. But adult content raises platform risk on a proprietary host. |
| — | SpacetimeDB | Not applicable. |

### Recommended architecture for each project

```
QuestHunt:
  Supabase Auth ─────► @supabase/ssr
  Supabase Postgres ─► @supabase/supabase-js (direct SDK)
  Supabase Storage ──► @supabase/supabase-js
  PostGIS ───────────► ST_DWithin, ST_MakePoint, geography columns
  Upstash Redis ─────► Rate limiting, feature flags, caching
  RLS ───────────────► Primary authorization (4-tier access)
  ORM ───────────────► None (raw SDK)

StoryForge:
  Supabase Auth ─────► @supabase/ssr
  Supabase Postgres ─► Prisma + @prisma/adapter-pg
  Supabase Storage ──► @supabase/supabase-js (for file uploads)
  Neo4j ─────────────► (future) Character relationship graphs
  Upstash Redis ─────► Rate limiting, feature flags, caching
  RLS ───────────────► Defense-in-depth (Prisma bypasses it)
  ORM ───────────────► Prisma (primary data access)
  Auth guards ───────► requireUser() + prisma.X.findMany({ where: { userId } })

LibraKeeper:
  Supabase Auth ─────► @supabase/ssr
  Supabase Postgres ─► Prisma + @prisma/adapter-pg
  Upstash Redis ─────► Rate limiting, caching, feature flags (Phase 1)
  RLS ───────────────► Defense-in-depth (via Supabase SQL migrations)
  ORM ───────────────► Prisma (primary data access)
  Auth guards ───────► getServerAuth() + session.user.role checks (Phase 2a)
  React Query ───────► @tanstack/react-query (Phase 1)

VelvetGalaxy:
  Supabase Auth ─────► @supabase/ssr
  Supabase Postgres ─► @supabase/supabase-js (direct SDK, no ORM)
  Supabase Storage ──► @supabase/supabase-js (2 buckets: media + private-media)
  Supabase Realtime ─► Live activity feeds, notifications, chat
  SWR ───────────────► Client-side data fetching + caching
  IndexedDB ─────────► Offline-first caching layer (lib/cache/storage.ts)
  RLS ───────────────► Primary authorization (all 40+ tables)
  Rate limiting ─────► PostgreSQL-based (lib/rate-limit.ts, per user+action)
  Stripe ────────────► Marketplace + subscription tiers (Basic/Premium/Lifetime)
  Neo4j ─────────────► (future) Social graph queries for 3D galaxy visualization
  ORM ───────────────► None (raw SQL migrations)
```

---

## 10. Decision Flowchart

```
START: Choosing a backend for your project
│
├─ Does your app need geospatial features (GPS, maps, proximity)?
│  YES → Supabase (PostGIS). Stop. No alternative exists.
│
├─ Is your data a graph (interconnected nodes with meaningful relationships)?
│  │
│  ├─ Is it a PURE graph with NO file storage, NO auth, NO content CRUD?
│  │  YES → Neo4j. Perfect fit.
│  │
│  └─ Is it a HYBRID (graph data + standard content + auth + files)?
│     YES → Supabase (content, auth, files) + Neo4j (graph layer). Hybrid.
│
├─ Is real-time collaboration the PRIMARY feature?
│  │
│  ├─ And vendor lock-in is acceptable?
│  │  YES → Convex. Auto-reactivity is unmatched.
│  │
│  └─ And you need open source / data portability?
│     YES → Supabase + Supabase Realtime + TanStack Query. More code, more control.
│
├─ Is it a multiplayer game with deterministic state?
│  YES → SpacetimeDB.
│
└─ Is it a standard web app with relational data?
   ├─ Deeply relational (3+ levels, many-to-many)?
   │  → Supabase + Prisma. Type-safe includes save round-trips.
   │
   ├─ Is it a social network with graph-like relationships?
   │  ├─ And those relationships are core to the product (3D visualization, custom types)?
   │  │  → Supabase (auth, content, storage) + Neo4j (social graph). Hybrid.
   │  │
   │  └─ And relationships are secondary (simple follows/friends)?
   │     → Supabase SDK. Standard joins are sufficient.
   │
   ├─ Does it have adult/NSFW content?
   │  → Supabase. Open source = self-hostable if platform policy changes.
   │
   └─ Flat (1-2 levels)?
      → Supabase SDK (if RLS is critical) OR Supabase + Prisma (if DX is priority).
```

---

## Appendix: Glossary

| Term | Definition |
|------|-----------|
| **PostGIS** | PostgreSQL extension adding geospatial data types and functions. Enables "find all points within 500m of this location" queries. |
| **RLS (Row Level Security)** | PostgreSQL feature that filters rows based on the authenticated user. `CREATE POLICY ... USING (auth.uid() = user_id)` means users can only see their own rows. |
| **Prisma** | TypeScript ORM that generates a type-safe client from your database schema. Handles migrations, relations, and type-safe queries. |
| **ORM** | Object-Relational Mapper. Translates between database tables and programming language objects. |
| **PgBouncer** | A lightweight connection pooler for PostgreSQL. Required when using Supabase from serverless environments (Vercel) because serverless functions create many short-lived connections. |
| **JWT** | JSON Web Token. A signed token containing user identity claims. Supabase Auth uses JWTs to authenticate requests. |
| **Cypher** | Query language for Neo4j. `MATCH (a)-[:KNOWS]->(b) RETURN a, b` is "find all people who know each other." |
| **ACID** | Atomicity, Consistency, Isolation, Durability. Guarantees database transactions are processed reliably. |
| **WebSocket** | A protocol for persistent, bidirectional communication between client and server. Used for real-time updates. |
| **Edge Function** | A serverless function that runs close to the user (at the "edge" of the network). Deno runtime on Supabase. |
| **Cold start** | The delay when a serverless function spins up for the first time. Can be 200-500ms. Convex avoids this by keeping functions warm. |

---

*This document was generated from comparative analysis of Supabase, Convex, SpacetimeDB, and Neo4j as applied to the QuestHunt, StoryForge, LibraKeeper, and VelvetGalaxy projects within Nebula Forge Digital Studio. Last updated 2026-05-15.*

# Supabase Postgres Migration Plan

## Decision Summary

- Target: migrate `libra-keeper` database hosting to Supabase Postgres.
- Scope: preserve current architecture (`Next.js` + `Prisma` + `NextAuth`) while changing DB infrastructure.
- Non-goal in this phase: replacing app auth/session logic with Supabase Auth.

## Why This Approach

| Option | Pros | Cons | Recommendation |
| --- | --- | --- | --- |
| Supabase as managed Postgres host only | Fastest path, minimal app-layer churn, keeps Prisma workflow | No immediate RLS/Auth platform rewrite | Adopt now |
| Full Supabase migration (Auth + policy model rewrite) | Potential long-term platform consolidation | High implementation risk and timeline cost | Defer |
| Keep current DB hosting model | No immediate migration effort | Ongoing ops overhead and less managed tooling | Keep as fallback only |

## Migration Phases

### Phase 0 - Readiness

- Provision Supabase staging and production projects.
- Enable backups and restore testing.
- Record baseline app/db metrics.

### Phase 1 - Staging Migration

- Point staging `DATABASE_URL` to Supabase pooled connection.
- Run schema deployment (`prisma migrate deploy`).
- Run validation suite:
  - `pnpm test --coverage`
  - `pnpm build`

### Phase 2 - Production Cutover

- Freeze schema changes for migration window.
- Apply final migration set to Supabase production.
- Rotate deployment secrets (`DATABASE_URL` and related values).
- Run production smoke checks: auth, dashboard load, item CRUD, loans/messages flows.

### Phase 3 - Stabilization

- Observe for 48 hours (errors, latency, connection pool health).
- Resolve anomalies and close migration window after stability criteria are met.

## Remaining Gaps and Tasks

| Status | Gap / Task | Owner | Notes |
| --- | --- | --- | --- |
| Done | CI command issues corrected (`pnpm test --coverage`, deterministic setup) | Engineering | Prevents prior CI failures |
| Done | Vercel build blocker in dashboard typecheck fixed | Engineering | Removed implicit-any failure |
| Pending | Supabase staging/prod projects and credentials provisioning | Ops | Required before rehearsals |
| Pending | Rehearsal runbook with data verification queries | Engineering | Must be scripted/repeatable |
| Pending | Release checklist for secret rotation and rollback trigger | Engineering + Ops | Required before prod cutover |
| Pending | Assess Prisma `DIRECT_URL` split for migrations | Engineering | Recommended for pooled environments |

## Risks and Mitigations

| Risk | Mitigation |
| --- | --- |
| Runtime failures due to missing env values | Add environment checklist and verify in CI + Vercel before deploy |
| Query/perf regressions after cutover | Compare baseline metrics and run focused performance smoke tests |
| Rollback complexity | Keep previous DB snapshot and scripted rollback connection switch |

## Alternatives

- Neon Postgres for branching-heavy workflows.
- Railway Postgres for simpler managed hosting.
- AWS RDS/Aurora for stricter infra governance.

## Recommendation

Move to Supabase Postgres hosting first, maintain Prisma and current auth/session architecture, and defer platform-level rewrites until post-cutover metrics justify further changes.

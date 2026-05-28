# Libra Keeper — Documentation

## Overview

Libra Keeper is a personal library management app for tracking books, music, movies, games, and other collectible items. It supports loan management, barcode/ISBN scanning, waitlists, messaging, and bilingual UI (EN/FR).

## Quick Links

- **Action Plan** — `action-plan.md` (project root)
- **User Guide** — `user-guide.md`
- **Admin Guide** — `admin-guide.md`
- **API Reference** — `api-reference.md`

## Architecture & Technical

- **Architecture & Security** — `technical/architecture-security.md`
- **Encoding Reference** — `technical/encoding-reference.md`

## Planning & Analysis

- **Platform Comparison** — `platform-architecture-comparison.md` (Supabase vs Convex vs SpacetimeDB vs Neo4j)
- **Migration Plan** — `supabase-postgres-migration-plan.md` (Docker PostgreSQL → Supabase)

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19
- **ORM**: Prisma 7 with pg adapter
- **Auth**: Supabase Auth via `@supabase/ssr`
- **Database**: Supabase PostgreSQL + Upstash Redis
- **Styling**: Tailwind CSS v4 + shadcn/ui (new-york)
- **State**: TanStack React Query
- **Forms**: react-hook-form + Zod
- **i18n**: next-intl (EN/FR)
- **PWA**: next-pwa
- **Email**: Resend
- **Hosting**: Vercel

## Feature Flags

13 feature flags (see `lib/feature-flags.ts` and `action-plan.md`). Managed via admin dashboard at `/admin/settings`.

# Feature Flags Testing

LibraKeeper feature flag system. Last updated: 2026-05-29.

## Architecture

- **Definition**: `lib/feature-flags.ts` (13 flags, Redis + DB persistence)
- **Server consumption**: `import { isFeatureEnabled } from "@/lib/feature-flags"`
- **Client consumption**: `useFeatureFlag(id)` hook via `hooks/use-feature-flags.tsx`
- **Admin UI**: `app/(protected)/admin/settings/feature-flag-manager.tsx`
- **API**: `app/api/feature-flags/route.ts` (GET) and `app/api/admin/flags/route.ts` (GET/POST)

## Flags

| Flag | Type | Default | Description | Test Strategy |
|------|------|---------|-------------|---------------|
| `dark_mode` | boolean | true | Dark mode toggle in theme-provider | Toggle in admin, verify theme switches |
| `barcode_scanner` | boolean | true | ISBN barcode scanning for item entry | Toggle off, verify scanner button hidden |
| `waitlist` | boolean | true | Waitlist for borrowed items | Toggle off, verify waitlist buttons hidden |
| `suggestions` | boolean | true | Item suggestion submissions | Toggle off, verify form hidden |
| `messaging` | boolean | true | In-app messaging between users | Toggle off, verify messages nav hidden |
| `activity_feed` | boolean | true | Activity feed on dashboard | Toggle off, verify feed hidden |
| `calendar_view` | boolean | true | Calendar view for loans | Toggle off, verify calendar nav hidden |
| `data_export` | boolean | true | Data export for admins | Toggle off, verify export buttons hidden |
| `ai_metadata_lookup` | percentage | false (0%) | Auto-populate from ISBN (experimental) | Set to 100% for all users, verify lookup triggers |
| `full_text_search` | boolean | true | PostgreSQL tsvector search | Toggle off, verify search uses basic LIKE query |
| `bulk_import` | boolean | true | CSV/Goodreads bulk import | Toggle off, verify import button hidden on dashboard |
| `email_reminders` | boolean | true | Automated due-date email reminders | Toggle off, verify cron returns early |
| `public_collection` | boolean | false | Public (unauthenticated) browsing | Toggle on, verify unauthenticated users see items |

## Flag Types

- **boolean**: Simple on/off toggle. Most flags use this type.
- **percentage**: Rollout to a percentage of users. Currently only `ai_metadata_lookup` uses this (0% = disabled for all).
- **user_list**: Rollout to specific users by ID. No flags currently use this type.

## Testing Checklist

For each new flag added:
1. Add to `DEFAULT_FEATURE_FLAGS` in `lib/feature-flags.ts`
2. Add client-side guard using `useFeatureFlag(id)` or `<FeatureGate>` component
3. Add server-side guard using `isFeatureEnabled(id)` in API routes/page components
4. Verify flag appears in admin settings UI
5. Test toggle on → feature visible, toggle off → feature hidden
6. Test with Redis unavailable (flag falls back to DB, then defaults)
7. Update this document with the new flag

## Cache Invalidation

Flags are cached in Redis for 30 seconds. After changing a flag in the admin UI:
- The UI calls `invalidateFlagCache()` which clears both the all-flags cache and the per-flag cache
- The next request within 30s will fetch fresh values from the DB
- If Redis is unavailable, flags read directly from DB (no caching)

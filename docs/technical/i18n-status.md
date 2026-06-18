# LibraKeeper — i18n Status Audit

**Audit Date**: 2026-06-18

## Approach

| Aspect | Value |
|--------|-------|
| Pattern | `next-intl` (different from cross-project Context pattern) |
| Config | `next-intl.config.ts` |
| Provider | `next-intl` `NextIntlClientProvider` |
| Translation format | JSON messages (`i18n/messages/*.json`) |
| Locale resolution | `next-intl` request-based routing |

## Locale Configuration

| Setting | Value |
|---------|-------|
| Default locale | `fr` (first in `locales` array) |
| Supported locales | fr, en |
| Locale prefix | Standard next-intl routing |

## Translation Key Counts

| Locale | Keys | Status |
|--------|------|--------|
| EN | 394 | Baseline |
| FR | 394 | Fully synced |

## Quebec French Conventions

| Convention | Count | Notes |
|------------|-------|-------|
| "connexion" (vs "login") | 6 occurrences | Good |
| "courriel" (vs "email") | 5 occurrences | Good |
| "mot de passe" (vs "password") | 1 occurrence | Good |
| "email" in FR | 0 occurrences | All cleaned up |
| "password" in FR | 0 occurrences | All cleaned up |
| Hardcoded locale arguments | N/A (next-intl pattern) | |

## Missing Keys / Issues

- Uses `next-intl` instead of the cross-project Context pattern (low priority — next-intl is a valid alternative)
- Consider migration to React Context pattern for cross-project consistency

## Assessment

- FR key parity is complete (394/394)
- Default locale is `fr` ✅ (complies with cross-project rule)
- Quebec French conventions fully adopted ✅
- Uses `next-intl` instead of cross-project Context pattern (acceptable trade-off, migration deferred)

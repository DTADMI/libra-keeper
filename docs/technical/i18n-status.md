# LibraKeeper — i18n Status Audit

**Audit Date**: 2026-05-28

## Approach

| Aspect | Value |
|--------|-------|
| Pattern | `next-intl` (different from cross-project Context pattern) |
| Config | `next-intl.config.ts` + `i18n/request.ts` |
| Provider | `next-intl` `NextIntlClientProvider` |
| Translation format | JSON messages (`i18n/messages/*.json`) |
| Locale resolution | `next-intl` request-based routing |

## Locale Configuration

| Setting | Value |
|---------|-------|
| Default locale | `en` (first in `locales` array; no explicit default set) |
| Supported locales | en, fr |
| Locale prefix | Standard next-intl routing |

## Translation Key Counts

| Locale | Keys | Status |
|--------|------|--------|
| EN | 362 | Baseline |
| FR | 362 | Fully synced |

## Quebec French Conventions

| Convention | Count | Notes |
|------------|-------|-------|
| "connexion" (vs "login") | 6 occurrences | Good |
| "courriel" (vs "email") | 5 occurrences | Good |
| "mot de passe" (vs "password") | 1 occurrence | Low |
| "email" in FR | 3 occurrences | Needs cleanup to "courriel" |
| "password" in FR | 1 occurrence | Needs cleanup to "mot de passe" |
| Hardcoded locale arguments | N/A (next-intl pattern) | |

## Missing Keys / Issues

- Default locale is effectively `en` (first in locales array, standard next-intl behavior) — needs to be `fr`
- No explicit `defaultLocale` in config to override next-intl default
- Uses `next-intl` instead of the cross-project Context pattern

## Assessment

- FR key parity is complete (362/362)
- Action plan confirms 120+ French keys translated with Quebec French norms
- Default locale is `en` — violates cross-project rule requiring `fr`
- Uses `next-intl` instead of cross-project Context pattern
- Quebec French conventions partially adopted (good "connexion" and "courriel", but some "email" and "password" in FR)
- Recommended: set explicit `defaultLocale: "fr"` and migrate remaining Anglicisms

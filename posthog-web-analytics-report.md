# PostHog Web Analytics Doctor

_Run: 2026-07-28T03:36:41Z_  
_Window analyzed: last 30 days_  
_Project: Default project_

## Summary

- **Warnings:** 1
- **Info:** 1
- **Fixes applied:** 0
- **Checks passed:** 2
- **Checks skipped:** 1

## Findings

### Pageleave coverage is low on akashdubey.me

- **Severity:** warning
- **Check:** Pageleave coverage per host
- **Affected:** akashdubey.me
- **Evidence:**
  - 186 pageviews, 76 pageleaves, ratio 0.409
  - Query grouped `$pageview`, `$pageleave`, and `$web_vitals` by host over the last 30 days.
- **Outcome:** Manual — the current code already sets `capture_pageleave: true`; inspect SPA route transitions and deployed SDK configuration before changing behavior. See [PostHog JavaScript configuration](https://posthog.com/docs/libraries/js#config).

### Web Vitals are not reaching PostHog

- **Severity:** info
- **Check:** Web Vitals coverage per host
- **Affected:** akashdubey.me
- **Evidence:**
  - 186 pageviews, 0 Web Vitals events
  - Query grouped `$pageview`, `$pageleave`, and `$web_vitals` by host over the last 30 days.
- **Outcome:** Manual — enable `capture_performance: { web_vitals: true }` in the PostHog initialization after explicit approval, then confirm events arrive. See [PostHog Web Vitals](https://posthog.com/docs/web-analytics/web-vitals).

## Fixes applied

No fixes were applied.

## Manual follow-up

- Pageleave coverage is low on akashdubey.me — confirm the deployed SDK matches `instrumentation-client.ts` and test pageleave events across client-side routes. See [PostHog JavaScript configuration](https://posthog.com/docs/libraries/js#config).
- Web Vitals are not reaching PostHog — explicitly approve enabling Web Vitals capture, then validate `$web_vitals` ingestion. See [PostHog Web Vitals](https://posthog.com/docs/web-analytics/web-vitals).

## Checks passed

- ✓ Partial reverse proxy — the only qualifying host, akashdubey.me, consistently sends traffic directly.
- ✓ Duplicate canonical URLs — no path met the multi-host duplication threshold.

## Checks skipped

- ✗ Dark authorized URLs — no authorized URLs are configured in the project.

## Next steps

The most impactful analytics follow-up is enabling Web Vitals capture, followed by a deployed-route test for pageleave coverage. The audit intentionally made no analytics-specific changes without an explicit selection.

import posthog from 'posthog-js'

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST

if (!posthogKey || !posthogHost) {
  if (process.env.NODE_ENV === 'development') {
    console.error(
      'NEXT_PUBLIC_POSTHOG_KEY or NEXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once the variables are configured',
    )
  }
} else {
  posthog.init(posthogKey, {
    api_host: posthogHost,
    defaults: '2026-01-30',
    capture_pageview: 'history_change',
    capture_pageleave: true,
    autocapture: true,
    person_profiles: 'identified_only',
    capture_exceptions: true,
  })
}

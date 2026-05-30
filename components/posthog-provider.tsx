'use client'

import posthog from 'posthog-js'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { useEffect } from 'react'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST

    if (key && host && !posthog.__loaded) {
      posthog.init(key, {
        api_host: host,
        person_profiles: 'always', // Using 'always' to track anonymous users as well, common for portfolios
        capture_pageview: false, // Recommended for Next.js to avoid double pageviews
        capture_pageleave: true,
      })
    }
  }, [])

  return <PHProvider client={posthog}>{children}</PHProvider>
}

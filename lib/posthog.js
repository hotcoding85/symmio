"use client"
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'
if (typeof window !== 'undefined') {
  console.log(process.env.NEXT_PUBLIC_POSTHOG_KEY)
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
    // Enable capture of pageviews and all autocapture events
    capture_pageview: true,
    capture_pageleave: true,
    // Record sessions
    session_recording: {
      maskAllInputs: false,
      recordCrossOriginIframes: true
    },
    // Enable debug mode in development
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') posthog.debug()
    }
  })
}

export function PostHogPageview() {
  const pathname = usePathname()

  useEffect(() => {
    posthog?.capture('$pageview')
  }, [pathname])

  return null
}

export function PHProvider({ children }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>
}
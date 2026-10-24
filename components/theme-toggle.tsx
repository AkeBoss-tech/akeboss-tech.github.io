'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import posthog from 'posthog-js'
import { cn } from '@/lib/utils'

/**
 * Swaps the theme with a circle that grows out from the click point,
 * using a view transition when the browser supports it.
 */
function switchTheme(next: string, x: number, y: number, setTheme: (theme: string) => void) {
  const root = document.documentElement
  const apply = () => {
    // Set the attribute directly so the transition's "new" snapshot already has the theme.
    root.setAttribute('data-theme', next)
    setTheme(next)
    root.style.colorScheme = next
  }

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!document.startViewTransition || reduceMotion) {
    apply()
    return
  }

  // Keyboard activation reports (0, 0); grow from the center instead.
  const originX = x || window.innerWidth / 2
  const originY = y || window.innerHeight / 2
  const radius = Math.hypot(Math.max(originX, window.innerWidth - originX), Math.max(originY, window.innerHeight - originY))

  root.classList.add('theme-swap')
  const transition = document.startViewTransition(apply)
  transition.ready.then(() => {
    root.animate(
      { clipPath: [`circle(0px at ${originX}px ${originY}px)`, `circle(${radius}px at ${originX}px ${originY}px)`] },
      { duration: 700, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)', pseudoElement: '::view-transition-new(root)' },
    )
  })
  transition.finished.finally(() => root.classList.remove('theme-swap'))
}

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return (
    <div className={cn("h-10 w-10 rounded-full border border-border/50 bg-bg-elevated", className)} />
  )

  const current = theme === 'system' ? resolvedTheme : theme
  const isPill = className?.includes('button')

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      onClick={(event) => {
        const nextTheme = current === 'dark' ? 'light' : 'dark'
        posthog.capture('theme_changed', { theme: nextTheme })
        switchTheme(nextTheme, event.clientX, event.clientY, setTheme)
      }}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full border border-border/70 bg-bg-elevated/80 text-sm text-text-muted shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-md transition hover:-translate-y-0.5 hover:text-text",
        className
      )}
    >
      {current === 'dark' ? (
        <>
          <span>☀︎</span>
          {isPill && <span className="ml-2">Light Mode</span>}
        </>
      ) : (
        <>
          <span>☾</span>
          {isPill && <span className="ml-2">Dark Mode</span>}
        </>
      )}
    </button>
  )
}

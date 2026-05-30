'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

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
      onClick={() => setTheme(current === 'dark' ? 'light' : 'dark')}
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

'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="h-10 w-10 rounded-full border border-border/50 bg-bg-elevated" />
  const current = theme === 'system' ? resolvedTheme : theme
  return <button aria-label="Toggle theme" onClick={() => setTheme(current === 'dark' ? 'light' : 'dark')} className="glass flex h-10 w-10 items-center justify-center rounded-full text-sm text-text-muted transition hover:-translate-y-0.5 hover:text-text">{current === 'dark' ? '☀︎' : '☾'}</button>
}

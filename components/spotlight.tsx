'use client'

import { useEffect } from 'react'

/**
 * Feeds the pointer position into `--mx` / `--my` on whichever
 * `[data-spotlight]` element is under the cursor, so CSS can draw a
 * soft light that follows the pointer. One listener for the whole page.
 */
export function Spotlight() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    let frame = 0
    let pending: { el: HTMLElement; x: number; y: number } | null = null

    const flush = () => {
      frame = 0
      if (!pending) return
      pending.el.style.setProperty('--mx', `${pending.x}px`)
      pending.el.style.setProperty('--my', `${pending.y}px`)
      pending = null
    }

    const onMove = (event: PointerEvent) => {
      const el = (event.target as Element | null)?.closest?.('[data-spotlight]') as HTMLElement | null
      if (!el) return
      const rect = el.getBoundingClientRect()
      pending = { el, x: event.clientX - rect.left, y: event.clientY - rect.top }
      if (!frame) frame = requestAnimationFrame(flush)
    }

    document.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      document.removeEventListener('pointermove', onMove)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  return null
}

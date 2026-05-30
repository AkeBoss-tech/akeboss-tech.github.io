'use client'

import { useEffect } from 'react'
import { Reveal } from '@/components/reveal'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="relative flex min-h-[80vh] flex-col items-center justify-center p-6 text-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,100,100,0.06),transparent_70%)]" />

      <Reveal y={30}>
        <div className="panel-soft mb-8 inline-block rounded-2xl border-red-500/20 px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-red-400">
          Runtime Exception
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <h1 className="text-6xl tracking-tight text-text sm:text-8xl">
          Something failed.
        </h1>
      </Reveal>

      <Reveal delay={0.2}>
        <p className="mt-6 max-w-lg text-lg text-text-muted">
          A runtime error occurred while rendering this page. The system integrity is maintained, but the current operation could not be completed.
        </p>
      </Reveal>

      <Reveal delay={0.3}>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => reset()}
            className="rounded-full border border-red-500/20 bg-red-500/10 px-8 py-4 text-sm font-medium text-red-200 transition-all hover:bg-red-500/20"
          >
            Attempt Recovery
          </button>
          <a
            href="/"
            className="rounded-full border border-white/6 px-8 py-4 text-sm font-medium text-text-muted transition-all hover:bg-white/6 hover:text-text"
          >
            Return to Core
          </a>
        </div>
      </Reveal>

      {error.digest && (
        <div className="pointer-events-none mt-20 font-mono text-[10px] uppercase tracking-[0.3em] text-white/5">
          Hash: {error.digest}
        </div>
      )}
    </div>
  )
}

'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Reveal } from '@/components/reveal'

export default function NotFound() {
  return (
    <div className="relative flex min-h-[80vh] flex-col items-center justify-center p-6 text-center">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(132,169,255,0.08),transparent_70%)]" />
      
      <Reveal y={30}>
        <div className="panel-soft mb-8 inline-block rounded-2xl px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-accent">
          Error 404
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <h1 className="text-6xl tracking-tight text-text sm:text-8xl">
          Page not found.
        </h1>
      </Reveal>

      <Reveal delay={0.2}>
        <p className="mt-6 max-w-lg text-lg text-text-muted">
          The system couldn't find the route you were looking for. It might have been moved, deleted, or never existed in this coordinate space.
        </p>
      </Reveal>

      <Reveal delay={0.3}>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="rounded-full border border-white/12 bg-white/[0.04] px-8 py-4 text-sm font-medium text-text transition-all hover:bg-white/10"
          >
            Return Home
          </Link>
          <Link
            href="/projects"
            className="rounded-full border border-white/6 px-8 py-4 text-sm font-medium text-text-muted transition-all hover:bg-white/6 hover:text-text"
          >
            Browse Projects
          </Link>
        </div>
      </Reveal>

      <div className="pointer-events-none mt-20 font-mono text-[10px] uppercase tracking-[0.3em] text-white/10">
        Coordinate Mismatch / System Integrity: Nominal
      </div>
    </div>
  )
}

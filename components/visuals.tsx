'use client'

import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useRef } from 'react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function ProjectVisualContainer({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div 
      whileHover="hover"
      initial="initial"
      className={cn("relative aspect-[4/3] w-full overflow-hidden rounded-[24px] border border-border bg-bg-strong/50 shadow-soft", className)}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(41,82,227,0.05),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(15,118,110,0.05),transparent_50%)]" />
      <div className="relative flex h-full w-full items-center justify-center p-6">
        {children}
      </div>
    </motion.div>
  )
}

/**
 * Lykke Visual: AI Education / Chat / Knowledge base
 */
export function LykkeVisual() {
  return (
    <ProjectVisualContainer className="bg-blue-50/10 dark:bg-blue-900/10">
      <div className="relative flex flex-col items-center gap-4 w-full max-w-[240px]">
        {/* Abstract Chat Bubbles */}
        <motion.div 
          variants={{
            initial: { opacity: 0, x: -20 },
            hover: { x: -5, transition: { duration: 0.4 } }
          }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="self-start rounded-2xl rounded-bl-none bg-accent/10 border border-accent/20 p-3 w-[80%]"
        >
          <div className="h-1.5 w-full bg-accent/20 rounded-full mb-2" />
          <div className="h-1.5 w-[60%] bg-accent/20 rounded-full" />
        </motion.div>

        <motion.div 
          variants={{
            initial: { scale: 0.8, opacity: 0 },
            hover: { scale: 1.1, rotate: 5 }
          }}
          whileInView={{ scale: 1, opacity: 1 }}
          className="relative h-16 w-16 rounded-full bg-accent flex items-center justify-center shadow-lg shadow-accent/20"
        >
          <div className="absolute inset-0 rounded-full bg-accent animate-ping opacity-20" />
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </motion.div>

        <motion.div 
          variants={{
            initial: { opacity: 0, x: 20 },
            hover: { x: 5, transition: { duration: 0.4 } }
          }}
          whileInView={{ opacity: 1, x: 0 }}
          className="self-end rounded-2xl rounded-br-none bg-bg-strong border border-border p-3 w-[85%] shadow-sm"
        >
          <div className="h-1.5 w-full bg-border rounded-full mb-2" />
          <div className="h-1.5 w-[40%] bg-accent/40 rounded-full" />
        </motion.div>
      </div>
    </ProjectVisualContainer>
  )
}

/**
 * Scarlet Sync Visual: Scheduling / Degree Planning
 */
export function ScarletSyncVisual() {
  return (
    <ProjectVisualContainer className="bg-emerald-50/10 dark:bg-emerald-900/10">
      <div className="grid grid-cols-3 gap-2 w-full max-w-[200px]">
        {[...Array(9)].map((_, i) => (
          <motion.div
            key={i}
            variants={{
              initial: { opacity: 0, y: 10 },
              hover: { 
                backgroundColor: i % 4 === 0 ? "var(--color-accent)" : "rgba(16, 185, 129, 0.2)",
                transition: { duration: 0.3 }
              }
            }}
            whileInView={{ 
              opacity: [0.3, 1, 0.3],
              y: 0,
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              delay: i * 0.15,
            }}
            className={cn(
              "aspect-square rounded-lg border",
              i % 4 === 0 ? "bg-accent/20 border-accent/30" : "bg-bg-strong border-border"
            )}
          />
        ))}
      </div>
    </ProjectVisualContainer>
  )
}

/**
 * Robotics Visual: Motion planning / Grid - Scroll Reactive
 */
export function RoboticsVisual() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  
  const path = "M 20 80 Q 50 20 80 80 T 140 40"
  const pathLength = useSpring(useTransform(scrollYProgress, [0, 0.8], [0, 1]), { stiffness: 400, damping: 90 })

  return (
    <ProjectVisualContainer className="bg-zinc-50/10 dark:bg-zinc-900/10">
      <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">
        <div className="absolute inset-0 opacity-20" style={{ 
          backgroundImage: 'radial-gradient(circle, var(--color-border) 1px, transparent 1px)',
          backgroundSize: '20px 20px'
        }} />
        
        <svg viewBox="0 0 160 100" className="w-full h-auto max-w-[280px]">
          <motion.path
            d={path}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="2"
            style={{ pathLength }}
          />
          <motion.circle
            r="4"
            fill="var(--color-accent)"
            style={{ 
              cx: useTransform(pathLength, [0, 0.3, 0.6, 1], [20, 50, 80, 140]),
              cy: useTransform(pathLength, [0, 0.3, 0.6, 1], [80, 20, 80, 40]),
            }}
          />
          <circle cx="20" cy="80" r="2" fill="var(--color-text-muted)" opacity="0.5" />
          <circle cx="140" cy="40" r="2" fill="var(--color-text-muted)" opacity="0.5" />
        </svg>
      </div>
    </ProjectVisualContainer>
  )
}

/**
 * API / Systems Visual: Data pulses
 */
export function SystemsVisual() {
  return (
    <ProjectVisualContainer className="bg-indigo-50/10 dark:bg-indigo-900/10">
      <div className="flex flex-col gap-3 w-full max-w-[180px]">
        {[...Array(3)].map((_, i) => (
          <motion.div 
            key={i} 
            variants={{
              hover: { scale: 1.05, x: 5 }
            }}
            className="relative h-12 rounded-xl border border-border bg-bg-strong flex items-center px-4 overflow-hidden"
          >
             <motion.div 
               className="absolute top-0 left-0 h-full w-1 bg-accent/40"
               animate={{ 
                 height: ['0%', '100%', '0%']
               }}
               transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
             />
             <div className="h-1.5 w-1/2 bg-border rounded-full" />
          </motion.div>
        ))}
      </div>
    </ProjectVisualContainer>
  )
}

/**
 * ARC Lab Visual: Robot Path Planning
 * Shows a high-fidelity A* search expansion and path traversal.
 */
export function PathPlanningVisual() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  
  const progress = useSpring(scrollYProgress, { stiffness: 40, damping: 20 })
  
  return (
    <ProjectVisualContainer className="bg-orange-50/10 dark:bg-orange-950/20">
      <div ref={containerRef} className="relative w-full h-full flex items-center justify-center overflow-hidden">
        {/* Expansion Grid */}
        <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 gap-1 opacity-20">
          {[...Array(100)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: [0, 0.5, 0.1] }}
              transition={{ delay: (i % 10 + Math.floor(i / 10)) * 0.05, duration: 2, repeat: Infinity }}
              className="bg-accent/20 rounded-sm"
            />
          ))}
        </div>
        
        <svg viewBox="0 0 200 200" className="w-full h-full max-w-[280px] drop-shadow-2xl">
          {/* Obstacles with Glow */}
          <rect x="60" y="40" width="40" height="40" rx="8" className="fill-bg-strong stroke-accent/20" />
          <rect x="110" y="110" width="50" height="30" rx="8" className="fill-bg-strong stroke-accent/20" />
          
          {/* Planned Path with Glow */}
          <motion.path
            d="M 20 180 L 20 140 L 100 140 L 100 80 L 180 80"
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="4"
            strokeLinecap="round"
            className="filter blur-[1px]"
            style={{ pathLength: progress }}
          />

          {/* Robot Trailing Effect */}
          {[...Array(3)].map((_, i) => (
            <motion.circle
              key={i}
              r={4 - i}
              className="fill-accent/40"
              style={{ 
                cx: useTransform(progress, [0, 0.25, 0.5, 0.75, 1], [20, 20, 100, 100, 180]),
                cy: useTransform(progress, [0, 0.25, 0.5, 0.75, 1], [180, 140, 140, 80, 80]),
                opacity: 0.5 - (i * 0.1)
              }}
            />
          ))}

          {/* Robot Node */}
          <motion.circle
            r="8"
            className="fill-accent"
            style={{ 
              cx: useTransform(progress, [0, 0.25, 0.5, 0.75, 1], [20, 20, 100, 100, 180]),
              cy: useTransform(progress, [0, 0.25, 0.5, 0.75, 1], [180, 140, 140, 80, 80]),
            }}
          />
        </svg>
      </div>
    </ProjectVisualContainer>
  )
}

/**
 * Kwan Lab Visual: Computational Biology
 * Stylized DNA / Molecular Graph Nodes
 */
export function CompBioVisual() {
  return (
    <ProjectVisualContainer className="bg-rose-50/10 dark:bg-rose-900/10">
      <div className="relative w-full h-full flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full max-w-[180px]">
          {[...Array(8)].map((_, i) => (
            <g key={i}>
              <motion.circle
                cx="30"
                cy={20 + i * 10}
                r="3"
                className="fill-rose-500"
                animate={{ x: [0, 40, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
              />
              <motion.circle
                cx="70"
                cy={20 + i * 10}
                r="3"
                className="fill-blue-500"
                animate={{ x: [0, -40, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
              />
              <motion.line
                x1="30" y1={20 + i * 10}
                x2="70" y2={20 + i * 10}
                className="stroke-border"
                strokeWidth="1"
                animate={{ 
                  x1: [30, 70, 30],
                  x2: [70, 30, 70],
                  opacity: [0.2, 0.5, 0.2]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
              />
            </g>
          ))}
        </svg>
      </div>
    </ProjectVisualContainer>
  )
}

/**
 * Economics Lab Visual: Data & Networks
 */
export function EconomicsVisual() {
  return (
    <ProjectVisualContainer className="bg-cyan-50/10 dark:bg-cyan-900/10">
      <div className="relative w-full h-full flex items-center justify-center">
        <div className="grid grid-cols-4 items-end gap-2 w-32 h-32">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="bg-accent/40 rounded-t-lg border-t-2 border-accent"
              animate={{ height: [`${20 + i * 15}%`, `${80 - i * 10}%`, `${20 + i * 15}%`] }}
              transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
            />
          ))}
        </div>
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-40 h-40 rounded-full border border-dashed border-accent/20" />
        </motion.div>
      </div>
    </ProjectVisualContainer>
  )
}

/**
 * Generic Visual: Blueprint / Tooling
 */
export function GenericVisual() {
  return (
    <ProjectVisualContainer className="bg-slate-50/10 dark:bg-slate-900/10">
      <div className="w-full max-w-[160px] aspect-square border-2 border-dashed border-border rounded-3xl flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-1/2 h-1/2 border border-accent/30 rounded-full flex items-center justify-center"
        >
          <div className="w-2 h-2 rounded-full bg-accent" />
        </motion.div>
      </div>
    </ProjectVisualContainer>
  )
}

/**
 * Dispatcher for Project Cards
 */
export function DynamicProjectVisual({ slug }: { slug: string }) {
  switch (slug) {
    case 'lykke': return <LykkeVisual />
    case 'scarlet-sync': return <ScarletSyncVisual />
    case 'robot-code': 
    case 'path-finder': return <PathPlanningVisual />
    case 'grokipedia-api':
    case 'personal-assistant': return <SystemsVisual />
    case 'economic-grapher':
    case 'economics-labs': return <EconomicsVisual />
    case 'comp-bio':
    case 'kwan-lab': return <CompBioVisual />
    default: return <GenericVisual />
  }
}

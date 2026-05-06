'use client'

import { motion } from 'framer-motion'

export function GhostWindow({ children, title = "System", className = "" }: { children: React.ReactNode, title?: string, className?: string }) {
  return (
    <motion.div 
      initial={{ y: 40, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`relative rounded-2xl bg-white dark:bg-[#0a0c10] shadow-[0_50px_100px_-20px_rgba(50,50,93,0.25),0_30px_60px_-30px_rgba(0,0,0,0.3)] border border-border/50 overflow-hidden ${className}`}
    >
      {/* Browser Bar */}
      <div className="flex items-center gap-2 px-4 py-3 bg-[#f7f9fc] dark:bg-[#111827] border-b border-border/40">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
          <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
        </div>
        <div className="mx-auto text-[10px] font-mono text-text-muted uppercase tracking-widest">{title}</div>
      </div>
      <div className="relative">
        {children}
      </div>
    </motion.div>
  )
}

'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const tracks = [
  { id: 1, name: 'Systems Research', artist: 'Ambient Focus', color: 'bg-blue-500' },
  { id: 2, name: 'Late Night Code', artist: 'Lo-fi Beats', color: 'bg-indigo-500' },
  { id: 3, name: 'Math & Logic', artist: 'Classical Modern', color: 'bg-emerald-500' },
]

export function VibeModule() {
  const [active, setActive] = useState(1)

  return (
    <div className="glass rounded-[32px] p-6 overflow-hidden relative group">
      <div className="absolute top-0 right-0 p-4">
        <div className="flex gap-1 items-end h-4">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              animate={{ height: [4, 12, 4] }}
              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              className="w-1 bg-accent rounded-full"
            />
          ))}
        </div>
      </div>
      
      <p className="font-mono text-[10px] uppercase tracking-widest text-text-muted mb-6">Current Vibe</p>
      
      <div className="space-y-3">
        {tracks.map((track) => (
          <motion.div
            key={track.id}
            onClick={() => setActive(track.id)}
            className={`cursor-pointer flex items-center gap-4 p-3 rounded-2xl transition-all ${
              active === track.id ? 'bg-bg-strong shadow-lg' : 'hover:bg-bg-strong/40'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl ${track.color} flex items-center justify-center text-white`}>
              {active === track.id ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" /></svg>
              ) : (
                <div className="w-2 h-2 rounded-full bg-white/50" />
              )}
            </div>
            <div>
              <p className={`text-sm font-medium ${active === track.id ? 'text-text' : 'text-text-muted'}`}>{track.name}</p>
              <p className="text-[10px] text-text-muted">{track.artist}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-border">
        <p className="text-[10px] text-text-muted leading-relaxed italic">
          "I build better when the music matches the problem's complexity."
        </p>
      </div>
    </div>
  )
}

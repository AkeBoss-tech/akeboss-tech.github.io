'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function FinalReveal() {
  const [mounted, setMounted] = useState(false)
  const [particles, setParticles] = useState<{ x: number, y: number, delay: number, duration: number }[]>([])

  useEffect(() => {
    setMounted(true)
    const newParticles = [...Array(20)].map(() => ({
      x: Math.random() * 1000 - 500,
      y: Math.random() * 1000 - 500,
      delay: Math.random() * 5,
      duration: 5 + Math.random() * 5
    }))
    setParticles(newParticles)
  }, [])

  if (!mounted) return <div className="h-96" />

  return (
    <div className="relative w-full h-96 flex items-center justify-center overflow-hidden">
      {/* Background abstract shape */}
      <motion.div 
        animate={{ 
          rotate: 360,
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute w-[600px] h-[600px] border border-accent/20 rounded-[40%] blur-3xl opacity-30"
      />
      
      {/* Central Pulsing Node */}
      <div className="relative z-10">
        <motion.div 
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="w-32 h-32 rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center"
        >
          <div className="w-4 h-4 rounded-full bg-accent animate-ping" />
        </motion.div>
      </div>
      
      {/* Floating particles */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-accent rounded-full"
          initial={{ 
            x: p.x, 
            y: p.y,
            opacity: 0 
          }}
          animate={{ 
            y: [null, -1000],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: p.duration, 
            repeat: Infinity,
            delay: p.delay
          }}
        />
      ))}
    </div>
  )
}

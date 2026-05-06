'use client'

import { motion } from 'framer-motion'

export function FinalReveal() {
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
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-accent rounded-full"
          initial={{ 
            x: Math.random() * 1000 - 500, 
            y: Math.random() * 1000 - 500,
            opacity: 0 
          }}
          animate={{ 
            y: [null, -1000],
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: 5 + Math.random() * 5, 
            repeat: Infinity,
            delay: Math.random() * 5
          }}
        />
      ))}
    </div>
  )
}

'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect } from 'react'

/**
 * Variant 1: Stripe-inspired Mesh Gradient with sophisticated multi-layer motion.
 */
export function MeshHero() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springX = useSpring(mouseX, { stiffness: 40, damping: 25 })
  const springY = useSpring(mouseY, { stiffness: 40, damping: 25 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX / window.innerWidth - 0.5)
      mouseY.set(e.clientY / window.innerHeight - 0.5)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [mouseX, mouseY])

  const moveX = useTransform(springX, [-0.5, 0.5], [-60, 60])
  const moveY = useTransform(springY, [-0.5, 0.5], [-60, 60])
  const moveXSlow = useTransform(springX, [-0.5, 0.5], [30, -30])

  return (
    <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none opacity-60 dark:opacity-40">
      {/* Primary Blurple Orb */}
      <motion.div
        style={{ x: moveX, y: moveY }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute -top-[20%] -right-[10%] w-[90%] h-[90%] rounded-full bg-[#635bff]/15 blur-[120px]"
      />
      
      {/* Cyan Accent */}
      <motion.div
        style={{ x: moveXSlow, y: moveY }}
        animate={{
          scale: [1.2, 1, 1.2],
          rotate: [0, -45, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[10%] -left-[15%] w-[80%] h-[80%] rounded-full bg-[#00d4ff]/10 blur-[100px]"
      />

      {/* Indigo Depth */}
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-[-10%] right-[10%] w-[60%] h-[60%] rounded-full bg-[#4f46e5]/10 blur-[140px]"
      />
      
      {/* Subtle Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ 
        backgroundImage: 'linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)',
        backgroundSize: '100px 100px'
      }} />
    </div>
  )
}

/**
 * Variant 2: Technical Grid with Pulses
 * A more structured, "Systems" focused background.
 */
export function GridHero() {
  return (
    <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none opacity-40">
      <div 
        className="absolute inset-0"
        style={{ 
          backgroundImage: `
            linear-gradient(to right, var(--color-border) 1px, transparent 1px),
            linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(circle at 50% 40%, black, transparent 80%)'
        }}
      />
      
      {/* Random Pulse Lines */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-px bg-gradient-to-r from-transparent via-accent to-transparent"
          style={{
            top: `${20 + i * 15}%`,
            left: '-20%',
            width: '40%',
          }}
          animate={{
            left: ['-20%', '120%'],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            delay: i * 1.5,
            ease: "linear"
          }}
        />
      ))}
    </div>
  )
}

/**
 * Variant 4: Infinite Data Stream / Neural Network
 * A complex, interconnected field of nodes and pulsing paths.
 */
export function InfiniteStream() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="w-full h-full opacity-[0.15] dark:opacity-[0.25]">
        {[...Array(15)].map((_, i) => (
          <motion.path
            key={i}
            d={`M ${-20 + (i * 10)} 110 Q ${40 + (i * 20)} 50 ${120 + (i * 10)} -10`}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1, 0],
              opacity: [0, 0.5, 0],
              pathOffset: [0, 1]
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear"
            }}
          />
        ))}
        
        {[...Array(30)].map((_, i) => (
          <motion.circle
            key={i}
            r="1"
            fill="var(--color-accent)"
            initial={{ 
              cx: Math.random() * 100 + "%",
              cy: Math.random() * 100 + "%",
              opacity: 0
            }}
            animate={{ 
              opacity: [0, 0.8, 0],
              scale: [0.5, 1.5, 0.5]
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </svg>
      
      {/* Background Gradients to blend */}
      <div className="absolute inset-0 bg-gradient-to-t from-bg via-transparent to-bg" />
    </div>
  )
}

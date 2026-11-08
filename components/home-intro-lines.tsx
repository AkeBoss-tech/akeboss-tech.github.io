'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import styles from './home-intro-lines.module.css'

// The first two lines always introduce the page before the shuffled rotation.
const lines = [
  'I love life.',
  'I build, research, and stay curious.',
  'I study computer science and mathematics.',
  'I build software for real people.',
  'I turn questions into projects.',
  'I make tools I wish existed.',
  'I build Scarlet Sync.',
  'I help build Lykke.',
  'I research how robots plan and move.',
  'I work on AI systems.',
  'I explore how machines learn.',
  'I turn messy data into something useful.',
  'I care about making learning easier.',
  'I like math that changes how I think.',
  'I connect ideas across disciplines.',
  'I learn by building things.',
  'I follow questions down rabbit holes.',
  'I care about the people using my work.',
  'I look for the story in the data.',
  'I enjoy a good debugging mystery.',
  'I believe useful things can be beautiful.',
  'I like turning complexity into clarity.',
  'I care about tools that give people time.',
  'I make room for experiments.',
  'I build things, then make them better.',
  'I find inspiration away from my screen.',
  'I notice the light in ordinary places.',
  'I collect moments as well as ideas.',
  'I like seeing a city from a new angle.',
  'I think a walk can help untangle a problem.',
  'I care about sharing what I learn.',
  'I am a student, builder, and researcher.',
  'I ask how things could work better.',
  'I like projects that cross boundaries.',
  'I am happiest when an idea becomes real.',
  'I am still learning. Always.',
] as const

export function HomeIntroLines() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const reducedMotion = useReducedMotion()
  const remaining = useRef<number[]>([1])
  const firstShuffle = useRef(true)
  const currentIndex = useRef(0)

  useEffect(() => {
    if (paused || reducedMotion) return

    const timer = window.setInterval(() => {
      if (document.hidden) return

      if (remaining.current.length === 0) {
        const deck = lines.map((_, i) => i).filter(i => !firstShuffle.current || i > 1)
        for (let i = deck.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1))
          ;[deck[i], deck[j]] = [deck[j], deck[i]]
        }
        // Avoid repeating the last line at the boundary between shuffled decks.
        if (deck[0] === currentIndex.current) {
          ;[deck[0], deck[1]] = [deck[1], deck[0]]
        }
        remaining.current = deck
        firstShuffle.current = false
      }

      const next = remaining.current.shift()!
      currentIndex.current = next
      setIndex(next)
    }, 4500)

    return () => window.clearInterval(timer)
  }, [paused, reducedMotion])

  const visibleIndex = reducedMotion ? 0 : index

  return (
    <p className={styles.intro}>
      <span className="sr-only">I love life. I build, research, and stay curious.</span>
      <span className={styles.viewport} aria-hidden="true">
        {/* Reserve the tallest line at every width so the links never jump. */}
        {lines.map(line => <span className={styles.sizer} key={line}>{line}</span>)}
        <AnimatePresence initial={false} mode="wait">
          <motion.span
            key={visibleIndex}
            className={styles.line}
            initial={reducedMotion ? false : { opacity: 0, y: 8, rotateX: -12 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            exit={reducedMotion ? { opacity: 1 } : { opacity: 0, y: -6, rotateX: 12 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            {lines[visibleIndex]}
          </motion.span>
        </AnimatePresence>
      </span>
      <button
        className={styles.toggle}
        type="button"
        aria-label={paused ? 'Resume introduction rotation' : 'Pause introduction rotation'}
        aria-pressed={paused}
        onClick={() => setPaused(value => !value)}
        title={paused ? 'Resume introductions' : 'Pause introductions'}
      >
        <svg aria-hidden="true" viewBox="0 0 16 16" fill="currentColor">
          {paused
            ? <path d="M5 3.5 12 8l-7 4.5z" />
            : <path d="M4 3h3v10H4zm5 0h3v10H9z" />}
        </svg>
      </button>
    </p>
  )
}

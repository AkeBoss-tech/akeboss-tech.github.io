'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import type { Project } from '@/lib/content'

type HomeYoshiCard = {
  slug: string
  x: number
  y: number
  w: number
  dx: number
  dy: number
  project: Project
}

type HomeYoshiChapter = {
  title: string
  accent: string
  glow: string
  cards: HomeYoshiCard[]
}

type HomeYoshiSceneProps = {
  chapters: HomeYoshiChapter[]
}

const heroLinks = [
  { label: 'GitHub', href: 'https://github.com/akeboss-tech' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/akash-dubey-399a1a290/' },
  { label: 'Email', href: 'mailto:akashdubey0@gmail.com' },
  { label: 'Resume', href: '/resume' },
]

const gallerySlots = [
  { x: 8, y: 16, w: 11.5, ratio: 1.15 },
  { x: 22, y: 13, w: 10.5, ratio: 0.84 },
  { x: 37, y: 18, w: 11.5, ratio: 1.24 },
  { x: 51, y: 12, w: 10.5, ratio: 0.8 },
  { x: 66, y: 16, w: 11.5, ratio: 1.12 },
  { x: 81, y: 14, w: 10.5, ratio: 0.9 },
  { x: 91, y: 19, w: 8.5, ratio: 1.24 },
  { x: 12, y: 38, w: 10.5, ratio: 1.08 },
  { x: 28, y: 35, w: 11.5, ratio: 1.28 },
  { x: 43, y: 40, w: 9.75, ratio: 0.78 },
  { x: 57, y: 35, w: 11.25, ratio: 1.12 },
  { x: 72, y: 39, w: 10.5, ratio: 1.25 },
  { x: 86, y: 35, w: 9.5, ratio: 0.82 },
  { x: 18, y: 59, w: 11, ratio: 0.8 },
  { x: 34, y: 61, w: 10.25, ratio: 1.18 },
  { x: 48, y: 56, w: 12, ratio: 1.28 },
  { x: 63, y: 61, w: 10.25, ratio: 0.84 },
  { x: 78, y: 57, w: 11.5, ratio: 1.16 },
  { x: 91, y: 60, w: 8.75, ratio: 1.04 },
  { x: 8, y: 78, w: 9.75, ratio: 1.18 },
  { x: 24, y: 82, w: 11.75, ratio: 0.8 },
  { x: 41, y: 80, w: 9.5, ratio: 1.16 },
  { x: 57, y: 83, w: 10.5, ratio: 0.86 },
  { x: 73, y: 80, w: 9.75, ratio: 1.18 },
  { x: 88, y: 83, w: 11.25, ratio: 0.82 },
] as const

const promptText = 'scroll down to see my projects :)'

function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value))
}

export function HomeYoshiScene({ chapters }: HomeYoshiSceneProps) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [progress, setProgress] = useState(0)
  const [typedCount, setTypedCount] = useState(0)
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null)

  const cards = useMemo(
    () =>
      chapters.flatMap((chapter, chapterIndex) =>
        chapter.cards.map((card, cardIndex) => ({
          ...card,
          category: chapter.title,
          accent: chapter.accent,
          glow: chapter.glow,
          chapterIndex,
          cardIndex,
        })),
      ),
    [chapters],
  )

  const hoveredCard = cards.find((card) => card.project.slug === hoveredSlug) ?? null
  const hoveredCategory = hoveredCard?.category ?? null

  useEffect(() => {
    const node = sectionRef.current
    if (!node) return

    let frame = 0

    const update = () => {
      frame = 0
      const rect = node.getBoundingClientRect()
      const total = Math.max(node.offsetHeight - window.innerHeight, 1)
      const next = clamp(-rect.top / total)
      setProgress(next)
    }

    const onScroll = () => {
      if (frame) return
      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  useEffect(() => {
    let frame = 0
    let timeout = 0

    const tick = () => {
      setTypedCount((count) => {
        if (count >= promptText.length) return count
        timeout = window.setTimeout(() => {
          frame = window.requestAnimationFrame(tick)
        }, count > 18 ? 38 : 54)
        return count + 1
      })
    }

    frame = window.requestAnimationFrame(tick)

    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      if (timeout) window.clearTimeout(timeout)
    }
  }, [])

  const heroFade = clamp(progress / 0.24)
  const scribbleProgress = clamp((progress - 0.22) / 0.16)
  const blackout = clamp((progress - 0.3) / 0.12)
  const galleryReveal = clamp((progress - 0.4) / 0.18)
  const galleryDrift = clamp((progress - 0.48) / 0.52)

  return (
    <section ref={sectionRef} className="relative h-[340vh] bg-[#02040a] text-text">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 hero-image-shell">
          <div
            className="hero-image-bg absolute inset-0"
            style={{
              backgroundImage: 'url(/hero-nyc.png)',
              opacity: 1 - heroFade * 0.85,
              filter: `brightness(${1 - heroFade * 0.22}) saturate(${1 - heroFade * 0.08})`,
            }}
          />
          <div className="hero-image-dim absolute inset-0" style={{ opacity: 0.75 + heroFade * 0.18 }} />
          <div className="hero-image-leftfade absolute inset-0" style={{ opacity: 1 - heroFade * 0.15 }} />
        </div>

        <div className="pointer-events-none absolute inset-0">
          {Array.from({ length: 24 }).map((_, index) => (
            <span
              key={index}
              className="absolute rounded-full bg-white"
              style={{
                left: `${6 + ((index * 17) % 88)}%`,
                top: `${7 + ((index * 13) % 42)}%`,
                width: index % 5 === 0 ? 2.5 : 1.5,
                height: index % 5 === 0 ? 2.5 : 1.5,
                opacity: 0.18 + ((index * 7) % 10) * 0.035 - heroFade * 0.12,
                boxShadow: index % 6 === 0 ? '0 0 12px rgba(255,255,255,0.45)' : 'none',
              }}
            />
          ))}
        </div>

        <div
          className="absolute inset-0 z-10"
          style={{
            opacity: scribbleProgress * 0.92,
            background: `linear-gradient(180deg, rgba(0, 0, 0, ${0.08 + blackout * 0.2}) 0%, rgba(0, 0, 0, ${0.58 + blackout * 0.34}) 100%)`,
          }}
        >
          {Array.from({ length: 14 }).map((_, index) => {
            const width = 28 + (index % 4) * 16
            const offset = (index * 7) % 88
            return (
              <span
                key={index}
                className="absolute rounded-full bg-[#040608]"
                style={{
                  left: `${offset - 8}%`,
                  top: `${12 + index * 5.3}%`,
                  width: `${width}%`,
                  height: `${8 + (index % 3) * 2}px`,
                  opacity: clamp(scribbleProgress * 1.1 - index * 0.04, 0, 0.9),
                  transform: `rotate(${index % 2 === 0 ? -12 : 11}deg) scaleX(${0.3 + scribbleProgress * 0.7})`,
                  transformOrigin: index % 2 === 0 ? 'left center' : 'right center',
                  filter: 'blur(1px)',
                }}
              />
            )
          })}
        </div>

        <div
          className="absolute inset-0 bg-[#020305]"
          style={{ opacity: clamp((progress - 0.34) / 0.1, 0, 1) * 0.96 }}
        />

        <div
          className="relative z-20 flex h-full items-start px-6 pt-10 sm:px-10 lg:px-16"
          style={{
            opacity: 1 - heroFade * 1.12,
            transform: `translate3d(0, ${heroFade * -24}px, 0)`,
          }}
        >
          <div className="max-w-[34rem] pt-10 sm:pt-14 lg:pt-16">
            <h1 className="max-w-[9ch] text-[clamp(4rem,7vw,7.25rem)] font-light tracking-[-0.08em] text-[#f4efeb]">
              Akash Dubey
            </h1>
            <div className="mt-5 h-px w-16 bg-[#c4a1a6]/70" />
            <p className="mt-8 max-w-[26ch] text-[clamp(1.15rem,1.75vw,1.95rem)] leading-[1.45] text-[#ece6e1]">
              I&apos;ve been writing code since before I was legally allowed to drive, balancing a decade of
              software experience with my current studies in Computer Science and Mathematics at Rutgers.
            </p>
            <p className="mt-8 text-[clamp(0.98rem,1.25vw,1.32rem)] text-[#d9c9c4]">
              <span className="text-[#cfa4aa]">What I build:</span> Math · Computer Science · Robotics
            </p>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-[clamp(1rem,1.1vw,1.2rem)] text-[#ece6e1]">
              {heroLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                  className="hero-link"
                >
                  {link.label} <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
            <div className="typed-prompt mt-10 text-[clamp(1rem,1.2vw,1.22rem)] text-[#9e9ca9]">
              <span className="scroll-cue">{promptText.slice(0, typedCount)}</span>
            </div>
            <div className="mt-2 text-[2.5rem] leading-none text-[#ece6e1]">↓</div>
          </div>
        </div>

        <div
          className="yoshi-scene absolute inset-0 z-30"
          style={{
            opacity: galleryReveal,
            transform: `scale(${0.985 + galleryReveal * 0.015})`,
          }}
        >
          <div className="yoshi-noise absolute inset-0" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_52%,rgba(126,92,188,0.12),transparent_32%),linear-gradient(180deg,#02040a_0%,#03050c_100%)]" />

          <div className="pointer-events-none absolute inset-0 opacity-35">
            {Array.from({ length: 14 }).map((_, index) => (
              <span
                key={index}
                className="absolute rounded-full bg-white"
                style={{
                  left: `${8 + ((index * 11) % 82)}%`,
                  top: `${11 + ((index * 17) % 72)}%`,
                  width: 2,
                  height: 2,
                  opacity: 0.16 + (index % 4) * 0.08,
                }}
              />
            ))}
          </div>

          <div className="absolute inset-0">
            {cards.map((card, index) => {
              const slot = gallerySlots[index % gallerySlots.length]
              const hovered = hoveredSlug === card.project.slug
              const inHoveredCategory = hoveredCategory !== null && hoveredCategory === card.category
              const idleOpacity = hoveredCategory === null ? 0.76 : inHoveredCategory ? 0.82 : 0.34
              const opacity = hovered ? 1 : idleOpacity
              const glow = hovered
                ? `0 0 42px ${card.glow}, 0 22px 60px rgba(0, 0, 0, 0.38)`
                : inHoveredCategory
                  ? `0 0 28px ${card.glow}, 0 18px 42px rgba(0, 0, 0, 0.3)`
                  : '0 12px 34px rgba(0, 0, 0, 0.24)'

              const driftX = (card.dx * 3.5 + (index % 5 - 2) * 10) * galleryDrift
              const driftY = (card.dy * 4.5 + (index % 4 - 1.5) * 12) * galleryDrift
              const rotate = (index % 2 === 0 ? -1.6 : 1.4) + galleryDrift * (index % 3 - 1) * 1.8

              return (
                <a
                  key={`${card.category}-${card.project.slug}-${index}`}
                  href={`/projects/${card.project.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  onMouseEnter={() => setHoveredSlug(card.project.slug)}
                  onMouseLeave={() => setHoveredSlug((current) => (current === card.project.slug ? null : current))}
                  onFocus={() => setHoveredSlug(card.project.slug)}
                  onBlur={() => setHoveredSlug((current) => (current === card.project.slug ? null : current))}
                  className="absolute block overflow-hidden rounded-[1.8rem] border border-white/7 bg-[#070b12]/88 outline-none"
                  style={{
                    left: `${slot.x}%`,
                    top: `${slot.y}%`,
                    width: `${slot.w}%`,
                    aspectRatio: `${slot.ratio}`,
                    opacity,
                    boxShadow: glow,
                    transform: `translate(-50%, -50%) translate3d(${driftX}px, ${driftY}px, 0) rotate(${rotate}deg) scale(${hovered ? 1.045 : inHoveredCategory ? 1.018 : 1})`,
                    transition:
                      'opacity 220ms ease, transform 260ms ease, box-shadow 260ms ease, border-color 220ms ease, filter 220ms ease',
                    borderColor: hovered ? `${card.accent}55` : inHoveredCategory ? `${card.accent}32` : 'rgba(255,255,255,0.07)',
                    filter: hovered ? 'brightness(1.06)' : inHoveredCategory ? 'brightness(1.02)' : 'brightness(0.9)',
                  }}
                >
                  <img
                    src={card.project.image || '/images/portfolio/home.png'}
                    alt={card.project.title}
                    className="h-full w-full object-cover"
                  />
                  <div
                    className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,10,16,0.05)_0%,rgba(6,10,16,0.16)_48%,rgba(4,7,12,0.86)_100%)]"
                    style={{ opacity: hovered ? 1 : 0.82 }}
                  />
                  <div
                    className="absolute inset-x-0 bottom-0 px-4 pb-3 pt-10 text-[#f4efeb]"
                    style={{ opacity: hovered ? 1 : 0, transition: 'opacity 180ms ease' }}
                  >
                    <div className="text-[clamp(0.9rem,0.95vw,1.2rem)] leading-tight">{card.project.title}</div>
                    <div className="mt-2 text-[0.78rem] uppercase tracking-[0.2em] text-white/76">Open project ↗</div>
                  </div>
                </a>
              )
            })}
          </div>

          <div
            className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex justify-center px-6"
            style={{
              opacity: hoveredCategory ? 1 : 0,
              transform: `translate3d(0, ${hoveredCategory ? 0 : 12}px, 0)`,
              transition: 'opacity 180ms ease, transform 220ms ease',
            }}
          >
            <div
              className="rounded-full border border-white/10 bg-[#05070d]/78 px-5 py-2 text-[0.9rem] uppercase tracking-[0.28em] text-white/85 backdrop-blur-md"
              style={{
                boxShadow: hoveredCard ? `0 0 34px ${hoveredCard.glow}` : '0 16px 40px rgba(0,0,0,0.3)',
                color: hoveredCard?.accent ?? '#f2f2f2',
              }}
            >
              {hoveredCategory}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

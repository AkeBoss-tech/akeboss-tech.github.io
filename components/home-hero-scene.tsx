'use client'

import { animate, stagger } from 'animejs'
import { useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

type HomeHeroSceneProps = {
  heroFade: number
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function seededRange(index: number, min: number, max: number) {
  const value = Math.sin(index * 999.17) * 10000
  return min + (value - Math.floor(value)) * (max - min)
}

export function HomeHeroScene({ heroFade }: HomeHeroSceneProps) {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const reducedMotion = useReducedMotion()
  const [svgMarkup, setSvgMarkup] = useState('')

  useEffect(() => {
    let cancelled = false

    fetch('/nyc-hero.svg')
      .then((response) => response.text())
      .then((markup) => {
        if (!cancelled) setSvgMarkup(markup)
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (reducedMotion || !rootRef.current || !svgMarkup) return

    const svg = rootRef.current.querySelector('#nyc-hero-background')
    if (!svg) return

    svg.classList.remove('native-animate')
    rootRef.current.querySelectorAll<SVGElement>('#starfield .star').forEach((star, index) => {
      star.style.transformOrigin = 'center'
      star.style.opacity = String(seededRange(index, 0.18, 0.82))
    })

    rootRef.current.querySelectorAll<SVGElement>('#windows .window').forEach((windowLight, index) => {
      windowLight.style.opacity = String(seededRange(index + 31, 0.16, 0.72))
    })

    const animations = [
      animate('#starfield .star', {
        opacity: (_target: unknown, index: number) => [seededRange(index, 0.14, 0.42), seededRange(index + 100, 0.48, 0.92)],
        scale: (_target: unknown, index: number) => [0.9, seededRange(index + 200, 1.08, 1.42)],
        duration: (_target: unknown, index: number) => seededRange(index + 300, 2600, 7600),
        delay: stagger(67, { from: 'random' }),
        loop: true,
        alternate: true,
        ease: 'inOutSine',
      }),
      animate('#aurora .aurora-band', {
        translateX: () => [rand(-26, -10), rand(22, 48)],
        translateY: () => [rand(-12, 2), rand(2, 18)],
        opacity: () => [rand(0.24, 0.42), rand(0.42, 0.68)],
        duration: () => rand(15000, 26000),
        delay: stagger(1400),
        loop: true,
        alternate: true,
        ease: 'inOutSine',
      }),
      animate('#windows .window', {
        opacity: (_target: unknown, index: number) => [seededRange(index + 400, 0.14, 0.38), seededRange(index + 500, 0.44, 0.86)],
        duration: (_target: unknown, index: number) => seededRange(index + 600, 2600, 9400),
        delay: stagger(33, { from: 'random' }),
        loop: true,
        alternate: true,
        ease: 'inOutSine',
      }),
      animate('#water-reflections .reflection', {
        opacity: () => [rand(0.04, 0.12), rand(0.12, 0.24)],
        scaleY: () => [0.85, rand(1.05, 1.32)],
        duration: () => rand(3300, 6700),
        delay: stagger(420),
        loop: true,
        alternate: true,
        ease: 'inOutSine',
      }),
      animate('#water-lines .ripple', {
        translateX: () => [rand(-46, -12), rand(22, 74)],
        opacity: () => [rand(0.03, 0.08), rand(0.12, 0.26)],
        duration: () => rand(4200, 8200),
        delay: stagger(95, { from: 'random' }),
        loop: true,
        alternate: true,
        ease: 'inOutSine',
      }),
      animate('.beacon', {
        opacity: [0.25, 1],
        scale: [0.75, 1.65],
        duration: 1800,
        delay: stagger(400),
        loop: true,
        alternate: true,
        ease: 'inOutSine',
      }),
    ]

    return () => {
      animations.forEach((animation) => animation.pause())
    }
  }, [reducedMotion, svgMarkup])

  useEffect(() => {
    const root = rootRef.current
    if (!root || !svgMarkup) return

    const stars = root.querySelector<SVGElement>('#starfield')
    const aurora = root.querySelector<SVGElement>('#aurora')
    const haze = root.querySelector<SVGElement>('#low-haze')
    const city = root.querySelector<SVGElement>('#city')
    const water = root.querySelector<SVGElement>('#water-reflections')

    if (stars) {
      stars.style.opacity = String(1 - heroFade * 0.56)
      stars.style.transform = `translate3d(0, ${heroFade * -18}px, 0)`
    }

    if (aurora) {
      aurora.style.opacity = String(0.98 - heroFade * 0.72)
      aurora.style.transform = `translate3d(${heroFade * 26}px, ${heroFade * -58}px, 0) scale(${1 + heroFade * 0.05})`
    }

    if (haze) {
      haze.style.opacity = String(0.78 - heroFade * 0.54)
      haze.style.transform = `translate3d(0, ${heroFade * -20}px, 0)`
    }

    if (city) {
      city.style.transform = `translate3d(0, ${heroFade * 72}px, 0)`
    }

    if (water) {
      water.style.opacity = String(1 - heroFade * 0.5)
      water.style.transform = `translate3d(0, ${heroFade * 34}px, 0)`
    }
  }, [heroFade, svgMarkup])

  return (
    <div
      ref={rootRef}
      className="absolute inset-0 overflow-hidden bg-[#02070d]"
      style={{
        opacity: 1 - heroFade * 0.82,
        filter: `brightness(${1 - heroFade * 0.14}) saturate(${1.02 - heroFade * 0.08})`,
      }}
    >
      <div className="hero-atmosphere hero-aurora-field" style={{ opacity: 1 - heroFade * 0.65 }} />
      <div className="hero-atmosphere hero-haze-field" style={{ opacity: 1 - heroFade * 0.5 }} />
      <div
        className="relative z-10 h-full w-full"
        dangerouslySetInnerHTML={{ __html: svgMarkup }}
      />
      <div className="hero-atmosphere hero-night-vignette" />
    </div>
  )
}

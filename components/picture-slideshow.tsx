'use client'

import { useEffect, useRef, useState } from 'react'
import posthog from 'posthog-js'
import { ResponsiveImage } from '@/components/responsive-image'
import type { MultimediaSlide } from '@/lib/multimedia'

const AUTO_ADVANCE_MS = 5500

type PictureSlideshowProps = {
  slides: MultimediaSlide[]
  label: string
}

type SlideAction = 'previous' | 'next' | 'dot' | 'swipe' | 'keyboard'

export function PictureSlideshow({ slides, label }: PictureSlideshowProps) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [visible, setVisible] = useState(false)
  const region = useRef<HTMLElement>(null)
  const swipe = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncMotion = () => setPlaying(!reducedMotion.matches)
    syncMotion()
    reducedMotion.addEventListener('change', syncMotion)
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.2 })
    if (region.current) observer.observe(region.current)
    return () => {
      reducedMotion.removeEventListener('change', syncMotion)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!playing || hovered || focused || !visible || slides.length < 2) return
    const timer = window.setInterval(() => {
      if (!document.hidden) setIndex((current) => (current + 1) % slides.length)
    }, AUTO_ADVANCE_MS)
    return () => window.clearInterval(timer)
  }, [playing, hovered, focused, visible, slides.length])

  if (!slides.length) return null

  const slide = slides[index]
  const goTo = (next: number, action: SlideAction) => {
    const resolved = (next + slides.length) % slides.length
    setPlaying(false)
    setIndex(resolved)
    posthog.capture('slideshow_control_selected', {
      action,
      index: resolved,
      title: slides[resolved]?.title,
    })
  }

  const togglePlayback = () => {
    setPlaying((current) => {
      const next = !current
      posthog.capture('slideshow_control_selected', {
        action: next ? 'play' : 'pause',
        index,
        title: slide.title,
      })
      return next
    })
  }

  return (
    <section
      ref={region}
      className="picture-slideshow mt-6 overflow-hidden rounded-[28px] border border-text/10 bg-text/[0.03]"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(true)
      }}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false)
      }}
      onPointerDown={(event) => {
        if ((event.target as HTMLElement).closest('button')) return
        swipe.current = { x: event.clientX, y: event.clientY }
      }}
      onPointerUp={(event) => {
        const start = swipe.current
        swipe.current = null
        if (!start) return
        const deltaX = event.clientX - start.x
        const deltaY = event.clientY - start.y
        if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY)) return
        goTo(index + (deltaX < 0 ? 1 : -1), 'swipe')
      }}
      onKeyDown={(event) => {
        if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
        event.preventDefault()
        goTo(index + (event.key === 'ArrowRight' ? 1 : -1), 'keyboard')
      }}
    >
      <div className="bg-[#0b0b10] [&_img]:block [&_img]:aspect-[16/10] [&_img]:h-auto [&_img]:w-full [&_img]:object-contain [&_picture]:block">
        <figure className="m-0" aria-roledescription="slide" aria-label={`${index + 1} of ${slides.length}: ${slide.title}`}>
          <ResponsiveImage
            src={slide.src}
            alt={slide.alt}
            sizes="(max-width: 1024px) 92vw, 64rem"
            loading="eager"
          />
        </figure>
      </div>
      <div className="px-4 pb-2 pt-5 sm:px-6" aria-live={playing ? 'off' : 'polite'} aria-atomic="true">
        <p className="eyebrow">
          {String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
        </p>
        <h3 className="mt-2 text-2xl tracking-[-0.03em] text-text sm:text-3xl">{slide.title}</h3>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-text-muted sm:text-base">{slide.caption}</p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 px-3 pb-4 pt-3 sm:px-5 sm:pb-5">
        <div className="flex max-w-full flex-wrap" role="group" aria-label="Choose a photo">
          {slides.map((item, position) => (
            <button
              key={item.src}
              type="button"
              className="picture-slideshow-dot"
              aria-label={`Show photo ${position + 1}: ${item.title}`}
              aria-current={index === position ? 'true' : undefined}
              onClick={() => goTo(position, 'dot')}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className="slideshow-control" onClick={() => goTo(index - 1, 'previous')} aria-label="Previous photo">
            Previous
          </button>
          <button type="button" className="slideshow-control" onClick={togglePlayback} aria-pressed={playing} aria-label={playing ? 'Pause slideshow' : 'Play slideshow'}>
            {playing ? 'Pause' : 'Play'}
          </button>
          <button type="button" className="slideshow-control" onClick={() => goTo(index + 1, 'next')} aria-label="Next photo">
            Next
          </button>
        </div>
      </div>
    </section>
  )
}

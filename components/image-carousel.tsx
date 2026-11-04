'use client'

import { useEffect, useRef, useState } from 'react'
import { ResponsiveImage } from '@/components/responsive-image'

type Slide = { src: string; alt: string; title: string; caption: string }

export function ImageCarousel({ slides, label }: { slides: Slide[]; label: string }) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [visible, setVisible] = useState(false)
  const region = useRef<HTMLElement>(null)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncMotion = () => setPlaying(!reducedMotion.matches)
    syncMotion()
    reducedMotion.addEventListener('change', syncMotion)
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.15 })
    if (region.current) observer.observe(region.current)
    return () => {
      reducedMotion.removeEventListener('change', syncMotion)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!playing || hovered || !visible || slides.length < 2) return
    const timer = window.setInterval(() => {
      if (!document.hidden) setIndex(current => (current + 1) % slides.length)
    }, 6500)
    return () => window.clearInterval(timer)
  }, [playing, hovered, visible, slides.length])

  if (!slides.length) return null
  const slide = slides[index]
  const goTo = (next: number) => {
    setPlaying(false)
    setIndex((next + slides.length) % slides.length)
  }

  return (
    <section
      ref={region}
      className="product-carousel"
      aria-roledescription="carousel"
      aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={event => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPlaying(false)
      }}
      onKeyDown={event => {
        if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
          event.preventDefault()
          goTo(index + (event.key === 'ArrowRight' ? 1 : -1))
        }
      }}
    >
      <div className="product-carousel-screen">
        <div className="product-window-bar" aria-hidden="true"><i /><i /><i /><span>Scarlet Sync / Product tour</span></div>
        <figure aria-roledescription="slide" aria-label={`${index + 1} of ${slides.length}`}>
          <ResponsiveImage src={slide.src} alt={slide.alt} sizes="(max-width: 1024px) 90vw, 46rem" loading="eager" />
        </figure>
      </div>
      <div className="product-carousel-description" aria-live={playing ? 'off' : 'polite'} aria-atomic="true">
        <p className="product-media-eyebrow">{String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</p>
        <h4>{slide.title}</h4>
        <p>{slide.caption}</p>
      </div>
      <div className="product-carousel-controls">
        <div className="product-carousel-dots" aria-label="Choose a slide">
          {slides.map((item, position) => (
            <button key={item.src} type="button" aria-label={`Show slide ${position + 1}: ${item.title}`} aria-current={index === position ? 'true' : undefined} onClick={() => goTo(position)} />
          ))}
        </div>
        <div className="product-carousel-buttons">
          <button type="button" onClick={() => goTo(index - 1)} aria-label="Previous slide">←</button>
          <button type="button" onClick={() => setPlaying(current => !current)} aria-label={playing ? 'Pause slideshow' : 'Play slideshow'}>{playing ? 'Pause' : 'Play'}</button>
          <button type="button" onClick={() => goTo(index + 1)} aria-label="Next slide">→</button>
        </div>
      </div>
    </section>
  )
}

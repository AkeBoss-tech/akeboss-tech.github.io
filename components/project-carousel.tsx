'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { ProjectCard } from '@/components/project-card'
import type { Project } from '@/lib/content'

type ProjectCarouselProps = {
  projects: Project[]
}

export function ProjectCarousel({ projects }: ProjectCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number | null>(null)
  const pauseRef = useRef(false)
  const [isReady, setIsReady] = useState(false)

  const loopedProjects = useMemo(() => (
    projects.length > 1 ? [...projects, ...projects] : projects
  ), [projects])

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const track = trackRef.current
    if (!track) return

    setIsReady(true)
    if (projects.length <= 1 || media.matches) return

    const step = () => {
      const node = trackRef.current
      if (!node) return

      if (!pauseRef.current) {
        const halfway = node.scrollWidth / 2
        node.scrollLeft += 0.45
        if (node.scrollLeft >= halfway) {
          node.scrollLeft -= halfway
        }
      }

      frameRef.current = window.requestAnimationFrame(step)
    }

    frameRef.current = window.requestAnimationFrame(step)

    return () => {
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current)
    }
  }, [projects.length])

  return (
    <div className="relative">
      {isReady ? (
        <>
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#080b11] via-[rgba(8,11,17,0.8)] to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#080b11] via-[rgba(8,11,17,0.8)] to-transparent" />
        </>
      ) : null}

      <div
        ref={trackRef}
        className="project-strip flex items-start gap-5 overflow-x-auto pb-2"
        onMouseEnter={() => { pauseRef.current = true }}
        onMouseLeave={() => { pauseRef.current = false }}
        onFocus={() => { pauseRef.current = true }}
        onBlur={() => { pauseRef.current = false }}
      >
        {loopedProjects.map((project, index) => (
          <div
            key={`${project.slug}-${index}`}
            data-project-card
            aria-hidden={projects.length > 1 && index >= projects.length}
            className="flex w-[20rem] shrink-0 snap-start"
          >
            <ProjectCard project={project} compact />
          </div>
        ))}
      </div>
    </div>
  )
}

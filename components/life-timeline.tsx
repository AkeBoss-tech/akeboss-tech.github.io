'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import Link from 'next/link'

import { ResponsiveImage } from '@/components/responsive-image'
import { lifeKinds } from '@/lib/life-timeline'
import type { LifeEvent, LifeKind } from '@/lib/life-timeline'

function EventCard({ event, side }: { event: LifeEvent; side: 'left' | 'right' }) {
  const kind = lifeKinds[event.kind]
  const body = (
    <>
      {event.image ? (
        <span className="lt-card-media">
          <ResponsiveImage src={event.image} alt="" sizes="(max-width: 900px) 80vw, 24rem" />
        </span>
      ) : null}
      <span className="lt-card-body">
        <span className="lt-card-top">
          <span className="lt-kind">{kind.label}</span>
          <span className="lt-when">{event.when}</span>
        </span>
        <span className="lt-card-title">
          {event.logo ? (
            <span className="lt-logo">
              <img src={event.logo} alt="" width={28} height={28} loading="lazy" />
            </span>
          ) : null}
          {event.title}
        </span>
        {event.role ? <span className="lt-role">{event.role}</span> : null}
        <span className="lt-text">{event.body}</span>
        {event.href ? <span className="lt-more">Read more →</span> : null}
      </span>
    </>
  )

  return (
    <li
      className={`lt-item lt-${side} ${event.upcoming ? 'lt-upcoming' : ''}`}
      data-year={event.start.slice(0, 4)}
      style={{ '--lt-hue': kind.hue } as CSSProperties}
    >
      <span className="lt-dot" aria-hidden="true" />
      {event.href ? (
        <Link href={event.href} className="lt-card" data-spotlight>
          {body}
        </Link>
      ) : (
        <div className="lt-card" data-spotlight>
          {body}
        </div>
      )}
    </li>
  )
}

export function LifeTimeline({ events }: { events: LifeEvent[] }) {
  const [filter, setFilter] = useState<LifeKind | 'all'>('all')
  const [year, setYear] = useState(events[0]?.start.slice(0, 4) ?? '')
  const listRef = useRef<HTMLOListElement | null>(null)

  const visible = useMemo(
    () => (filter === 'all' ? events : events.filter((event) => event.kind === filter)),
    [events, filter],
  )

  // Group consecutive events by year so each year gets one marker.
  const groups = useMemo(() => {
    const byYear: Array<{ year: string; events: Array<{ event: LifeEvent; side: 'left' | 'right' }> }> = []
    visible.forEach((event, i) => {
      const y = event.start.slice(0, 4)
      const item = { event, side: i % 2 === 0 ? ('left' as const) : ('right' as const) }
      const last = byYear[byYear.length - 1]
      if (last && last.year === y) last.events.push(item)
      else byYear.push({ year: y, events: [item] })
    })
    return byYear
  }, [visible])

  // Track the year of the entry nearest the middle of the viewport.
  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        const y = (hit?.target as HTMLElement | undefined)?.dataset.year
        if (y) setYear(y)
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    list.querySelectorAll('[data-year]').forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [groups])

  return (
    <div className="lt-wrap">
      <div className="lt-filters" role="group" aria-label="Filter the timeline">
        {(['all', ...Object.keys(lifeKinds)] as Array<LifeKind | 'all'>).map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={filter === key}
            className={filter === key ? 'active' : undefined}
            style={key === 'all' ? undefined : ({ '--lt-hue': lifeKinds[key].hue } as CSSProperties)}
            onClick={() => setFilter(key)}
          >
            {key === 'all' ? 'Everything' : lifeKinds[key].label}
          </button>
        ))}
      </div>

      <div className="lt-stage">
        <p className="lt-year-ghost" aria-hidden="true" key={year}>
          {year}
        </p>

        <ol className="lt" ref={listRef} key={filter}>
          <li className="lt-spine" aria-hidden="true">
            <span className="lt-spine-fill" />
          </li>
          {groups.map((group) => (
            <li key={group.year} className="lt-year-group">
              <h2 className="lt-year" data-year={group.year}>{group.year}</h2>
              <ol>
                {group.events.map(({ event, side }) => (
                  <EventCard key={`${event.start}-${event.title}`} event={event} side={side} />
                ))}
              </ol>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

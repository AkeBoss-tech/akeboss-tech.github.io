'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

import type { WikiPage } from '@/lib/wiki'

type WikiSearchItem = Pick<WikiPage, 'slug' | 'title' | 'subtitle' | 'domain' | 'difficulty' | 'tags'>

// Stable per-domain hue so each domain gets its own accent color.
function domainHue(domain: string) {
  let hash = 0
  for (const char of domain) hash = (hash * 31 + char.charCodeAt(0)) % 360
  return hash
}

export function WikiSearch({ pages }: { pages: WikiSearchItem[] }) {
  const [query, setQuery] = useState('')
  const [domain, setDomain] = useState('All')
  const domains = useMemo(() => ['All', ...Array.from(new Set(pages.map((page) => page.domain)))], [pages])

  const filteredPages = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    return pages.filter((page) => {
      const matchesDomain = domain === 'All' || page.domain === domain
      if (!matchesDomain) return false
      if (!normalizedQuery) return true
      const haystack = `${page.title} ${page.subtitle} ${page.domain} ${page.difficulty} ${page.tags.join(' ')}`.toLowerCase()
      return haystack.includes(normalizedQuery)
    })
  }, [domain, pages, query])

  return (
    <section className="wiki-search-panel" aria-label="Search wiki explainers">
      <label className="wiki-search-box">
        <span className="sr-only">Search explainers</span>
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search: RAG, swerve, q-binomial, transit…"
        />
      </label>
      <div className="wiki-domain-chips" role="group" aria-label="Filter by domain">
        {domains.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={domain === item}
            className={domain === item ? 'active' : undefined}
            onClick={() => setDomain(item)}
          >
            {item}
          </button>
        ))}
      </div>
      <p className="wiki-search-count">{filteredPages.length} of {pages.length}</p>
      <div className="wiki-card-grid">
        {filteredPages.map((page) => (
          <Link
            key={page.slug}
            href={`/wiki/${page.slug}`}
            className="wiki-card reveal"
            data-spotlight
            style={{ '--wiki-hue': domainHue(page.domain) } as React.CSSProperties}
          >
            <span>{page.domain}</span>
            <h2>{page.title}</h2>
            <p>{page.subtitle}</p>
            <em>{page.difficulty}</em>
          </Link>
        ))}
      </div>
    </section>
  )
}

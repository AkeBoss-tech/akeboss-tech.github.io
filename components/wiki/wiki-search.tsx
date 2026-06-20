'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

import type { WikiPage } from '@/lib/wiki'

type WikiSearchItem = Pick<WikiPage, 'slug' | 'title' | 'subtitle' | 'domain' | 'difficulty' | 'tags'>

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
      <div className="wiki-search-row">
        <label className="wiki-search-box">
          <span>Search explainers</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try RAG, swerve, q-binomial, transit..."
          />
        </label>
        <label className="wiki-search-box">
          <span>Domain</span>
          <select value={domain} onChange={(event) => setDomain(event.target.value)}>
            {domains.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
      </div>
      <p className="wiki-search-count">{filteredPages.length} of {pages.length} explainers</p>
      <div className="wiki-card-grid">
        {filteredPages.map((page) => (
          <Link key={page.slug} href={`/wiki/${page.slug}`} className="wiki-card">
            <span>{page.domain}</span>
            <h2>{page.title}</h2>
            <p>{page.subtitle}</p>
            <div>
              {page.tags.slice(0, 3).map((tag) => <small key={tag}>{tag}</small>)}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

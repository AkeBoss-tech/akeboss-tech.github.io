'use client'

import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import Link from 'next/link'

import type { Project } from '@/lib/content'
import { formatDate } from '@/lib/format'

const semanticAliases: Record<string, string[]> = {
  ai: ['llm', 'llms', 'language model', 'language models', 'rag', 'retrieval', 'agent', 'agents', 'transformer'],
  llm: ['ai', 'language model', 'language models', 'transformer'],
  math: ['mathematics', 'proof', 'theory', 'equation', 'calculus', 'algebra', 'graph theory', 'optimization'],
  economics: ['econ', 'economic', 'finance', 'forecasting', 'econometrics', 'market'],
  finance: ['economics', 'quant', 'quantitative', 'econometrics', 'market'],
  health: ['healthtech', 'healthcare', 'medical', 'wellness', 'biomedical'],
  robotics: ['robot', 'autonomous', 'motion planning', 'control', 'vision', 'frc'],
  biology: ['bio', 'genome', 'genomics', 'hic', 'chromatin', 'computational biology'],
  research: ['paper', 'study', 'experiment', 'analysis', 'benchmark'],
  web: ['frontend', 'full stack', 'website', 'browser', 'react', 'next'],
  data: ['analysis', 'analytics', 'dataset', 'scraping', 'pipeline', 'visualization'],
  scheduling: ['planner', 'planning', 'course', 'timetable', 'calendar'],
}

function normalizeSearchText(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function tokenize(value: string) {
  return normalizeSearchText(value).split(' ').filter((token) => token.length > 1)
}

function stemToken(token: string) {
  if (token.endsWith('ies') && token.length > 4) return `${token.slice(0, -3)}y`
  if (token.endsWith('ing') && token.length > 5) return token.slice(0, -3)
  if (token.endsWith('ed') && token.length > 4) return token.slice(0, -2)
  if (token.endsWith('s') && token.length > 3) return token.slice(0, -1)
  return token
}

function expandQueryTerms(query: string) {
  const baseTokens = tokenize(query)
  const expanded = new Set<string>()

  for (const token of baseTokens) {
    expanded.add(token)
    expanded.add(stemToken(token))

    const aliases = semanticAliases[token] ?? semanticAliases[stemToken(token)] ?? []
    for (const alias of aliases) {
      expanded.add(normalizeSearchText(alias))
      for (const aliasToken of tokenize(alias)) {
        expanded.add(aliasToken)
        expanded.add(stemToken(aliasToken))
      }
    }
  }

  const normalizedQuery = normalizeSearchText(query)
  if (normalizedQuery) expanded.add(normalizedQuery)

  return [...expanded].filter(Boolean)
}

function getProjectSearchFields(project: Project) {
  return {
    title: normalizeSearchText(project.title),
    excerpt: normalizeSearchText(project.excerpt),
    tags: project.tags.map((tag) => normalizeSearchText(tag)),
    lead: normalizeSearchText(project.lead),
    sections: project.sections.map((section) => normalizeSearchText(`${section.title} ${section.summary}`)),
    content: normalizeSearchText(project.content),
    links: project.links.map((link) => normalizeSearchText(`${link.label} ${link.url}`)),
  }
}

function getProjectSearchScore(project: Project, query: string) {
  if (!query) return 1

  const fields = getProjectSearchFields(project)
  const expandedTerms = expandQueryTerms(query)
  const normalizedQuery = normalizeSearchText(query)
  let score = 0

  if (normalizedQuery && fields.title.includes(normalizedQuery)) score += 14
  if (normalizedQuery && fields.excerpt.includes(normalizedQuery)) score += 8
  if (normalizedQuery && fields.lead.includes(normalizedQuery)) score += 8
  if (normalizedQuery && fields.sections.some((section) => section.includes(normalizedQuery))) score += 7
  if (normalizedQuery && fields.content.includes(normalizedQuery)) score += 5

  for (const term of expandedTerms) {
    if (!term) continue

    if (fields.tags.some((tag) => tag === term || tag.includes(term))) score += 8
    if (fields.title.includes(term)) score += 6
    if (fields.excerpt.includes(term)) score += 4
    if (fields.lead.includes(term)) score += 4
    if (fields.sections.some((section) => section.includes(term))) score += 3
    if (fields.links.some((link) => link.includes(term))) score += 2
    if (fields.content.includes(term)) score += 1
  }

  return score
}

function ProjectFeedCard({ project, favorite = false }: { project: Project; favorite?: boolean }) {
  return (
    <article className={`project-feed-card ${favorite ? 'project-feed-card-favorite' : ''}`}>
      <Link href={`/projects/${project.slug}`} className="project-feed-image" aria-label={`View ${project.title}`}>
        <img src={project.image || '/images/portfolio/home.png'} alt={project.title} />
      </Link>

      <div className="project-feed-body">
        <div className="project-feed-meta">
          <div className="flex flex-wrap items-center gap-2">
            {favorite ? (
              <span className="project-heart" aria-hidden="true">
                ♥
              </span>
            ) : null}
            {project.tags.map((tag) => (
              <span key={tag} className="project-feed-tag">
                {tag}
              </span>
            ))}
          </div>
          <time dateTime={project.date}>{formatDate(project.date)}</time>
        </div>

        <h2>
          <Link href={`/projects/${project.slug}`}>{project.title}</Link>
        </h2>
        <p>{project.excerpt}</p>

        <Link href={`/projects/${project.slug}`} className="project-feed-link">
          View Project →
        </Link>
      </div>
    </article>
  )
}

function ProjectSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="project-feed-section">
      <div className="project-feed-section-heading">
        <p className="eyebrow">{title}</p>
      </div>
      <div className="project-feed-list">{children}</div>
    </section>
  )
}

function matchesProject(project: Project, query: string, activeTag: string) {
  const matchesTag = !activeTag || project.tags.some((tag) => tag.toLowerCase() === activeTag)

  if (!matchesTag) return false
  if (!query) return true

  return getProjectSearchScore(project, query) > 0
}

export function ProjectFeedSearch({
  favoriteProjects,
  recentProjects,
}: {
  favoriteProjects: Project[]
  recentProjects: Project[]
}) {
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState('')

  const normalizedQuery = query.trim().toLowerCase()
  const allTags = useMemo(
    () => [...new Set([...favoriteProjects, ...recentProjects].flatMap((project) => project.tags))].sort(),
    [favoriteProjects, recentProjects],
  )

  function getVisibleProjects(projects: Project[]) {
    const filtered = projects.filter((project) => matchesProject(project, normalizedQuery, activeTag))

    if (!normalizedQuery) return filtered

    return [...filtered].sort((a, b) => getProjectSearchScore(b, normalizedQuery) - getProjectSearchScore(a, normalizedQuery))
  }

  const visibleFavorites = useMemo(
    () => getVisibleProjects(favoriteProjects),
    [favoriteProjects, normalizedQuery, activeTag],
  )
  const visibleRecent = useMemo(
    () => getVisibleProjects(recentProjects),
    [recentProjects, normalizedQuery, activeTag],
  )

  const hasResults = visibleFavorites.length > 0 || visibleRecent.length > 0

  return (
    <>
      <section className="project-search-shell">
        <label className="project-search-box">
          <span className="sr-only">Search projects or labels</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search projects or labels"
            className="project-search-input"
          />
        </label>

        <div className="project-search-tags" aria-label="Project labels">
          <button
            type="button"
            className={`project-search-tag ${activeTag === '' ? 'project-search-tag-active' : ''}`}
            onClick={() => setActiveTag('')}
          >
            All
          </button>
          {allTags.map((tag) => {
            const normalizedTag = tag.toLowerCase()
            return (
              <button
                key={tag}
                type="button"
                className={`project-search-tag ${activeTag === normalizedTag ? 'project-search-tag-active' : ''}`}
                onClick={() => setActiveTag(activeTag === normalizedTag ? '' : normalizedTag)}
              >
                {tag}
              </button>
            )
          })}
        </div>
      </section>

      <div className="project-feed mt-12">
        {visibleFavorites.length > 0 ? (
          <ProjectSection title="Favorites">
            {visibleFavorites.map((project) => (
              <ProjectFeedCard key={project.slug} project={project} favorite />
            ))}
          </ProjectSection>
        ) : null}

        {visibleRecent.length > 0 ? (
          <ProjectSection title="Recent">
            {visibleRecent.map((project) => (
              <ProjectFeedCard key={project.slug} project={project} />
            ))}
          </ProjectSection>
        ) : null}

        {!hasResults ? (
          <section className="project-feed-empty">
            <p className="eyebrow">No matches</p>
            <p>Try another project name, keyword, or label.</p>
          </section>
        ) : null}
      </div>
    </>
  )
}

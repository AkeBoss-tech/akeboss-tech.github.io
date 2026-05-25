'use client'

import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import Link from 'next/link'

import type { Project } from '@/lib/content'
import { formatDate } from '@/lib/format'

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

  const haystack = [project.title, project.excerpt, ...project.tags].join(' ').toLowerCase()
  return haystack.includes(query)
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

  const visibleFavorites = useMemo(
    () => favoriteProjects.filter((project) => matchesProject(project, normalizedQuery, activeTag)),
    [favoriteProjects, normalizedQuery, activeTag],
  )
  const visibleRecent = useMemo(
    () => recentProjects.filter((project) => matchesProject(project, normalizedQuery, activeTag)),
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

'use client'

import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import Link from 'next/link'

import { ResponsiveImage } from '@/components/responsive-image'
import type { Project } from '@/lib/content'
import { formatDate } from '@/lib/format'

const semanticAliases: Record<string, string[]> = {
  ai: ['llm', 'llms', 'language model', 'language models', 'rag', 'retrieval', 'agent', 'agents', 'transformer'],
  llm: ['ai', 'language model', 'language models', 'transformer'],
  math: ['mathematics', 'proof', 'theory', 'equation', 'calculus', 'algebra', 'graph theory', 'optimization'],
  economics: ['econ', 'economic', 'finance', 'forecasting', 'econometrics', 'market'],
  finance: ['economics', 'quant', 'quantitative', 'econometrics', 'market'],
  health: ['healthtech', 'healthcare', 'medical', 'wellness', 'biomedical'],
  robotics: ['robot', 'autonomous', 'motion planning', 'control', 'vision', 'frc', 'tamp', 'dual arm'],
  biology: ['bio', 'genome', 'genomics', 'hic', 'chromatin', 'computational biology'],
  research: ['paper', 'study', 'experiment', 'analysis', 'benchmark'],
  web: ['frontend', 'full stack', 'website', 'browser', 'react', 'next'],
  data: ['analysis', 'analytics', 'dataset', 'scraping', 'pipeline', 'visualization'],
  scheduling: ['planner', 'planning', 'course', 'timetable', 'calendar', 'scheduler', 'cp sat'],
  infrastructure: ['runtime', 'mcp', 'knowledge', 'provenance', 'workflow', 'agent tools', 'control plane', 'integrity'],
}

const selectedWorkSlugs = [
  'clean-your-data',
  'hic-tad-analysis',
  'llm-research',
  'top-coder-challenge',
  'personal-assistant',
  'puerto-rico-migration',
  'rutgers-bus-analysis',
]

const selectedWorkSlugSet = new Set(selectedWorkSlugs)

const curatedViews = [
  {
    key: 'all',
    label: 'All Projects',
    description: 'Full portfolio across featured work, deeper builds, and archive experiments.',
    matches: () => true,
  },
  {
    key: 'featured',
    label: 'Featured',
    description: 'The projects that define the headline story.',
    matches: (project: Project) => project.featured,
  },
  {
    key: 'ai-systems',
    label: 'AI Systems',
    description: 'Agents, model work, and AI-powered product systems.',
    matches: (project: Project) =>
      project.tags.some((tag) => ['ai', 'infrastructure', 'healthtech'].includes(tag.toLowerCase())) || project.featured,
  },
  {
    key: 'data-research',
    label: 'Data + Research',
    description: 'Analysis-heavy builds, technical investigations, and research projects.',
    matches: (project: Project) =>
      project.tags.some((tag) => ['data', 'research', 'math', 'algorithms'].includes(tag.toLowerCase())),
  },
  {
    key: 'products',
    label: 'Startups / Products',
    description: 'Productized tools, platforms, and developer-facing apps.',
    matches: (project: Project) =>
      ['lykke', 'scarlet-sync', 'clean-your-data', 'grokipedia-api', 'personal-assistant', 'flamingo'].includes(project.slug),
  },
  {
    key: 'math-algorithms',
    label: 'Math + Algorithms',
    description: 'Optimization, proofs, algorithm demos, and quantitative reasoning.',
    matches: (project: Project) =>
      ['drp-spring-2025', 'path-finder', 'calculus-generator', 'top-coder-challenge', 'llm-research', 'tamp-research'].includes(project.slug) ||
      project.tags.some((tag) => ['math', 'algorithms'].includes(tag.toLowerCase())),
  },
  {
    key: 'early-builds',
    label: 'Early Builds',
    description: 'Smaller projects, competition work, and older experiments.',
    matches: (project: Project) => {
      const year = getProjectYear(project)
      return year !== null && year <= 2024 && !project.featured && !selectedWorkSlugSet.has(project.slug)
    },
  },
] as const

type CuratedViewKey = (typeof curatedViews)[number]['key']

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

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, ' ').trim()
}

function shortenText(value: string, maxLength = 190) {
  const normalized = normalizeWhitespace(value)
  if (normalized.length <= maxLength) return normalized
  return `${normalized.slice(0, maxLength).trimEnd()}...`
}

function getSentence(value: string, fallback: string, maxLength = 180) {
  const normalized = normalizeWhitespace(value)
  if (!normalized) return fallback
  const match = normalized.match(/.+?[.!?](?=\s|$)/)
  const sentence = match?.[0] ?? normalized
  return shortenText(sentence, maxLength)
}

function dedupeText(values: string[]) {
  const seen = new Set<string>()
  const unique: string[] = []

  for (const value of values) {
    const normalized = normalizeSearchText(value)
    if (!normalized || seen.has(normalized)) continue
    seen.add(normalized)
    unique.push(value)
  }

  return unique
}

function getProjectYear(project: Project) {
  const parsed = Date.parse(project.date)
  if (!Number.isNaN(parsed)) return new Date(parsed).getFullYear()
  const match = project.date.match(/\b(20\d{2})\b/)
  return match ? Number(match[1]) : null
}

function getFeatureHighlights(project: Project) {
  return dedupeText([
    getSentence(project.lead, project.excerpt, 160),
    ...project.sections.slice(0, 3).map((section) => getSentence(section.summary, project.excerpt, 160)),
    getSentence(project.excerpt, project.excerpt, 160),
  ]).slice(0, 3)
}

function matchesProject(project: Project, query: string, activeTag: string, activeView: CuratedViewKey) {
  const matchesTag = !activeTag || project.tags.some((tag) => tag.toLowerCase() === activeTag)
  const view = curatedViews.find((item) => item.key === activeView)
  const matchesView = view ? view.matches(project) : true

  if (!matchesTag || !matchesView) return false
  if (!query) return true

  return getProjectSearchScore(project, query) > 0
}

function sortProjects(projects: Project[], query: string) {
  if (!query) return projects
  return [...projects].sort((a, b) => getProjectSearchScore(b, query) - getProjectSearchScore(a, query))
}

function ProjectSection({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
}) {
  return (
    <section className="project-tier-section">
      <div className="project-tier-heading">
        <p className="eyebrow">{title}</p>
        {description ? <p>{description}</p> : null}
      </div>
      {children}
    </section>
  )
}

function getFeaturedDateLabel(project: Project) {
  if (project.slug === 'scarlet-sync') return 'JAN 2025 - PRESENT'
  return formatDate(project.date)
}

function FeaturedCaseStudy({ project, index }: { project: Project; index: number }) {
  const highlights = getFeatureHighlights(project)
  const mediaImages = project.mediaImages.length > 0 ? project.mediaImages : [project.image || '/images/portfolio/home.png']
  const [coverImage, ...collageImages] = mediaImages

  return (
    <article className="featured-case-study">
      <Link href={`/projects/${project.slug}`} className="featured-case-study-media" aria-label={`Read ${project.title} case study`}>
        <div className="featured-case-study-media-top">
          <ResponsiveImage src={coverImage} alt={project.title} sizes="(max-width: 1024px) 92vw, 38rem" loading="eager" />
        </div>
        {collageImages.length > 0 ? (
          <div className="featured-case-study-collage">
            {collageImages.slice(0, 3).map((image, imageIndex) => (
              <div
                key={image}
                className={`featured-case-study-collage-item featured-case-study-collage-item-${imageIndex + 1}`}
              >
                <ResponsiveImage src={image} alt={`${project.title} detail ${imageIndex + 1}`} sizes="(max-width: 1024px) 30vw, 12rem" />
              </div>
            ))}
          </div>
        ) : null}
      </Link>

      <div className="featured-case-study-copy">
        <div className="featured-case-study-meta">
          <div className="featured-case-study-meta-left">
            <span>{String(index + 1).padStart(2, '0')}</span>
            <div className="featured-case-study-meta-tags">
              {project.tags.map((tag) => (
                <span key={tag} className="project-feed-tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <time dateTime={project.date}>{getFeaturedDateLabel(project)}</time>
        </div>

        <h2>{project.title}</h2>
        <p className="featured-case-study-excerpt">{project.excerpt}</p>

        <ul className="featured-case-study-points">
          {highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>

        <Link href={`/projects/${project.slug}`} className="project-feed-link">
          Read Case Study →
        </Link>
      </div>
    </article>
  )
}

function SelectedWorkCard({
  project,
}: {
  project: Project
}) {
  return (
    <article className="selected-work-card">
      <Link href={`/projects/${project.slug}`} className="selected-work-media" aria-label={`View ${project.title}`}>
        <ResponsiveImage src={project.image || '/images/portfolio/home.png'} alt={project.title} sizes="(max-width: 1024px) 92vw, 32rem" />
      </Link>

      <div className="selected-work-body">
        <div className="project-feed-meta">
          <div className="flex flex-wrap items-center gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="project-feed-tag">
                {tag}
              </span>
            ))}
          </div>
          <time dateTime={project.date}>{formatDate(project.date)}</time>
        </div>

        <h3>{project.title}</h3>
        <p>{project.excerpt}</p>

        <div className="selected-work-actions">
          <Link href={`/projects/${project.slug}`} className="project-feed-link">
            View Project →
          </Link>
        </div>
      </div>
    </article>
  )
}

function ArchiveTile({ project }: { project: Project }) {
  const year = getProjectYear(project)

  return (
    <Link href={`/projects/${project.slug}`} className="archive-project-tile">
      <div className="archive-project-tile-media">
        <ResponsiveImage src={project.image || '/images/portfolio/home.png'} alt={project.title} sizes="(max-width: 768px) 92vw, 18rem" />
      </div>
      <div className="archive-project-tile-body">
        <div className="archive-project-tile-meta">
          <span>{year ?? 'Archive'}</span>
          <span>{project.tags.slice(0, 2).join(' · ')}</span>
        </div>
        <h3>{project.title}</h3>
        <p>{shortenText(project.excerpt, 110)}</p>
      </div>
    </Link>
  )
}

function TimelineMarker({ isLast }: { isLast: boolean }) {
  return (
    <div className={`project-timeline-marker ${isLast ? 'project-timeline-marker-last' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 28 28" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="projectTimelineNode" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f4efeb" />
            <stop offset="52%" stopColor="#efe8e1" />
            <stop offset="100%" stopColor="#8fe0d0" />
          </radialGradient>
        </defs>
        <circle cx="14" cy="14" r="9" className="project-timeline-node-glow" />
        <circle cx="14" cy="14" r="5.4" className="project-timeline-node-core" />
      </svg>
    </div>
  )
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
  const [activeView, setActiveView] = useState<CuratedViewKey>('all')

  const normalizedQuery = query.trim().toLowerCase()
  const allProjects = useMemo(
    () => [...favoriteProjects, ...recentProjects],
    [favoriteProjects, recentProjects],
  )
  const allTags = useMemo(
    () => [...new Set(allProjects.flatMap((project) => project.tags))].sort(),
    [allProjects],
  )

  const featuredProjects = useMemo(
    () => allProjects.filter((project) => project.featured),
    [allProjects],
  )
  const selectedProjects = useMemo(
    () => allProjects.filter((project) => selectedWorkSlugSet.has(project.slug)),
    [allProjects],
  )
  const archiveProjects = useMemo(
    () => allProjects.filter((project) => !project.featured && !selectedWorkSlugSet.has(project.slug)),
    [allProjects],
  )

  function getVisibleProjects(projects: Project[]) {
    return sortProjects(
      projects.filter((project) => matchesProject(project, normalizedQuery, activeTag, activeView)),
      normalizedQuery,
    )
  }

  const visibleFeatured = useMemo(
    () => getVisibleProjects(featuredProjects),
    [featuredProjects, normalizedQuery, activeTag, activeView],
  )
  const visibleSelected = useMemo(
    () => getVisibleProjects(selectedProjects),
    [selectedProjects, normalizedQuery, activeTag, activeView],
  )
  const visibleArchive = useMemo(
    () => getVisibleProjects(archiveProjects),
    [archiveProjects, normalizedQuery, activeTag, activeView],
  )
  const visibleTimeline = useMemo(
    () => sortProjects(
      allProjects.filter((project) => matchesProject(project, normalizedQuery, activeTag, activeView)),
      normalizedQuery,
    ),
    [allProjects, normalizedQuery, activeTag, activeView],
  )

  const timelineByYear = useMemo(() => {
    const grouped = new Map<number, Project[]>()

    for (const project of visibleTimeline) {
      const year = getProjectYear(project)
      if (year === null) continue
      const current = grouped.get(year) ?? []
      current.push(project)
      grouped.set(year, current)
    }

    return [...grouped.entries()].sort((a, b) => b[0] - a[0])
  }, [visibleTimeline])

  const hasResults =
    visibleFeatured.length > 0 ||
    visibleSelected.length > 0 ||
    visibleArchive.length > 0

  const activeViewMeta = curatedViews.find((view) => view.key === activeView) ?? curatedViews[0]

  return (
    <>
      <section className="project-search-shell">
        <label className="project-search-box">
          <span className="sr-only">Search projects or labels</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search projects, tools, research areas, or labels"
            className="project-search-input"
          />
        </label>

        <div className="project-curated-views" aria-label="Curated views">
          {curatedViews.map((view) => (
            <button
              key={view.key}
              type="button"
              className={`project-view-pill ${activeView === view.key ? 'project-view-pill-active' : ''}`}
              onClick={() => setActiveView(view.key)}
            >
              {view.label}
            </button>
          ))}
        </div>
        <div className="project-search-tags" aria-label="Project labels">
          <button
            type="button"
            className={`project-search-tag ${activeTag === '' ? 'project-search-tag-active' : ''}`}
            onClick={() => setActiveTag('')}
          >
            All labels
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
        {visibleFeatured.length > 0 ? (
          <ProjectSection
            title="Featured Case Studies"
            description="The projects carrying the strongest product story, technical depth, and overall impact."
          >
            <div className="featured-case-study-list">
              {visibleFeatured.map((project, index) => (
                <FeaturedCaseStudy key={project.slug} project={project} index={index} />
              ))}
            </div>
          </ProjectSection>
        ) : null}

        {visibleSelected.length > 0 ? (
          <ProjectSection
            title="Selected Work"
          >
            <div className="selected-work-grid">
              {visibleSelected.map((project) => (
                <SelectedWorkCard
                  key={project.slug}
                  project={project}
                />
              ))}
            </div>
          </ProjectSection>
        ) : null}

        {visibleArchive.length > 0 ? (
          <ProjectSection
            title="Project Archive"
          >
            <div className="archive-project-grid">
              {visibleArchive.map((project) => (
                <ArchiveTile key={project.slug} project={project} />
              ))}
            </div>
          </ProjectSection>
        ) : null}

        {timelineByYear.length > 0 ? (
          <ProjectSection
            title="Timeline"
            description="A chronological scan of how the work has evolved from early experiments into larger systems."
          >
            <div className="project-timeline">
              {timelineByYear.map(([year, projects], index) => (
                <div key={year} className="project-timeline-row">
                  <TimelineMarker isLast={index === timelineByYear.length - 1} />
                  <div className="project-timeline-year">{year}</div>
                  <div className="project-timeline-links">
                    {projects.map((project) => (
                      <Link key={project.slug} href={`/projects/${project.slug}`}>
                        {project.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ProjectSection>
        ) : null}

        {!hasResults ? (
          <section className="project-feed-empty">
            <p className="eyebrow">No matches</p>
            <p>Try another project name, label, or curated view.</p>
          </section>
        ) : null}
      </div>
    </>
  )
}

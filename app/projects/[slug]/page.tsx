import { LlmMarkdown } from '@/components/llm-markdown'
import { ResponsiveImage } from '@/components/responsive-image'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ViewTransition } from 'react'
import { Markdown } from '@/components/markdown'
import { RevealTitle } from '@/components/reveal-title'
import { getProject, getProjects } from '@/lib/content'
import type { Project } from '@/lib/content'
import { buildProjectLlmMarkdown } from '@/lib/llm'
import { getNextProject, getProjectExplainers, getRelatedProjects, headingId, projectHue } from '@/lib/project-relations'
import { absoluteUrl, buildBreadcrumbList, buildPageMetadata, siteName } from '@/lib/seo'

function formatYear(date: string) {
  const time = Date.parse(date)
  return Number.isNaN(time) ? '' : String(new Date(time).getUTCFullYear())
}

function ProjectTile({ project }: { project: Project }) {
  return (
    <Link href={`/projects/${project.slug}`} className="pj-tile reveal" data-spotlight style={{ '--pj-hue': projectHue(project.slug) } as React.CSSProperties}>
      <span className="pj-tile-media">
        {project.image ? (
          <ViewTransition name={`project-cover-${project.slug}`}>
            <ResponsiveImage src={project.image} alt="" sizes="(max-width: 768px) 92vw, 26rem" />
          </ViewTransition>
        ) : null}
      </span>
      <span className="pj-tile-body">
        <span className="pj-tile-tags">{project.tags.slice(0, 2).join(' · ')}</span>
        <span className="pj-tile-title">{project.title}</span>
        <span className="pj-tile-excerpt">{project.excerpt}</span>
      </span>
    </Link>
  )
}

export function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)

  if (!project) {
    return buildPageMetadata({
      title: 'Project',
      description: 'Project not found.',
      path: `/projects/${slug}`,
      noIndex: true,
    })
  }

  return buildPageMetadata({
    title: project.title,
    description: project.excerpt || project.lead,
    path: `/projects/${project.slug}`,
    image: `/projects/${project.slug}/opengraph-image`,
  })
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) return notFound()
  const llmMarkdown = buildProjectLlmMarkdown(project)
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CreativeWork',
        headline: project.title,
        name: project.title,
        description: project.excerpt || project.lead,
        url: absoluteUrl(`/projects/${project.slug}`),
        image: project.image ? [absoluteUrl(project.image)] : undefined,
        author: {
          '@type': 'Person',
          name: siteName,
        },
        datePublished: project.date,
        keywords: project.tags.join(', '),
        inLanguage: 'en-US',
      },
      buildBreadcrumbList([
        { name: 'Home', path: '/' },
        { name: 'Projects', path: '/projects' },
        { name: project.title, path: `/projects/${project.slug}` },
      ]),
    ],
  }

  const projects = getProjects()
  const next = getNextProject(projects, project.slug)
  const related = getRelatedProjects(projects, project, next ? [next.slug] : [])
  const explainers = getProjectExplainers(project.slug)
  const liveLink = project.links.find((link) => !/github\.com/i.test(link.url))
  const sourceLink = project.links.find((link) => /github\.com/i.test(link.url))
  const year = formatYear(project.date)
  const toc = project.sections.map((section) => ({ id: headingId(section.title), title: section.title.replace(/[*_`]/g, '') }))

  return (
    <div className="pj" style={{ '--pj-hue': projectHue(project.slug) } as React.CSSProperties}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <LlmMarkdown content={llmMarkdown} />
      <div className="wiki-progress" aria-hidden="true" />

      <header className="pj-hero container-wide">
        <Link href="/projects" className="pj-back">← All projects</Link>
        <p className="pj-meta">
          {[year, ...project.tags.slice(0, 3), project.reading].filter(Boolean).map((item) => <span key={item}>{item}</span>)}
        </p>
        <RevealTitle text={project.title} className="pj-title" />
        {project.excerpt ? <p className="pj-lede">{project.excerpt}</p> : null}
        {liveLink || sourceLink ? (
          <div className="pj-actions">
            {liveLink ? (
              <a href={liveLink.url} target="_blank" rel="noreferrer" className="pj-btn pj-btn-primary">
                {/^check it out|^here$|^link$/i.test(liveLink.label) ? 'Open the project' : liveLink.label} ↗
              </a>
            ) : null}
            {sourceLink ? (
              <a href={sourceLink.url} target="_blank" rel="noreferrer" className="pj-btn">
                Source code ↗
              </a>
            ) : null}
          </div>
        ) : null}
      </header>

      <figure className="pj-cover container-wide">
        <div className="pj-cover-frame">
          <ViewTransition name={`project-cover-${project.slug}`}>
            <ResponsiveImage
              src={project.image || '/images/portfolio/home.png'}
              alt={`${project.title} cover`}
              sizes="(max-width: 1024px) 94vw, 72rem"
              loading="eager"
              fetchPriority="high"
            />
          </ViewTransition>
        </div>
      </figure>

      <div className={`pj-layout container-wide ${toc.length > 1 ? '' : 'pj-layout-solo'}`}>
        {toc.length > 1 ? (
          <nav className="pj-toc" aria-label="On this page">
            <strong>On this page</strong>
            <ol>
              {toc.map((item) => <li key={item.id}><a href={`#${item.id}`}>{item.title}</a></li>)}
            </ol>
          </nav>
        ) : null}
        <article className="pj-body">
          <Markdown content={project.content} className="project-prose pj-prose" />
        </article>
      </div>

      <section className="pj-more container-wide" aria-label="Keep exploring">
        {next ? (
          <Link href={`/projects/${next.slug}`} className="pj-next reveal" data-spotlight style={{ '--pj-hue': projectHue(next.slug) } as React.CSSProperties}>
            <span className="pj-next-copy">
              <span className="pj-next-label">Next project →</span>
              <span className="pj-next-title">{next.title}</span>
              <span className="pj-next-excerpt">{next.excerpt}</span>
            </span>
            {next.image ? (
              <span className="pj-next-media">
                <ViewTransition name={`project-cover-${next.slug}`}>
                  <ResponsiveImage src={next.image} alt="" sizes="(max-width: 768px) 92vw, 34rem" />
                </ViewTransition>
              </span>
            ) : null}
          </Link>
        ) : null}

        {related.length ? (
          <div className="pj-related">
            <h2>Related projects</h2>
            <div className="pj-related-grid">
              {related.map((item) => <ProjectTile key={item.slug} project={item} />)}
            </div>
          </div>
        ) : null}

        {explainers.length ? (
          <div className="pj-related">
            <h2>How it works</h2>
            <p className="pj-related-sub">Interactive explainers for ideas behind this project.</p>
            <div className="pj-explainers">
              {explainers.map((page) => (
                <Link key={page.slug} href={`/wiki/${page.slug}`} className="pj-explainer reveal" data-spotlight>
                  <span>{page.domain}</span>
                  <strong>{page.title}</strong>
                  <em>{page.subtitle}</em>
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        <p className="pj-all">
          <Link href="/projects">Browse all {projects.length} projects →</Link>
        </p>
      </section>
    </div>
  )
}

import { LlmMarkdown } from '@/components/llm-markdown'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Markdown } from '@/components/markdown'
import { getProject, getProjects } from '@/lib/content'
import { buildProjectLlmMarkdown } from '@/lib/llm'
import { absoluteUrl, buildPageMetadata, siteName } from '@/lib/seo'

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
    image: project.image,
  })
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) return notFound()
  const llmMarkdown = buildProjectLlmMarkdown(project)
  const scarletSyncVideo = project.slug === 'scarlet-sync' ? '/videos/scarlet-sync-demo.mp4' : null
  const structuredData = {
    '@context': 'https://schema.org',
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
  }

  return (
    <div className="container-wide py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <LlmMarkdown content={llmMarkdown} />
      <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <div className="max-w-3xl">
          <Link href="/projects" className="eyebrow inline-flex items-center gap-2 text-text-soft hover:text-text">
            ← Back to projects
          </Link>
          <div className="mt-6 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="mt-6 text-5xl text-text sm:text-7xl">{project.title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-text-muted">{project.excerpt}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            {project.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/12 bg-white/[0.04] px-5 py-3 text-sm text-text-muted hover:border-white/25 hover:text-text"
              >
                {link.label}
              </a>
            ))}
          </div>

        </div>

        <div className="panel-soft aspect-video overflow-hidden rounded-[32px] bg-black lg:mt-56">
          {scarletSyncVideo ? (
            <video
              src={scarletSyncVideo}
              poster={project.image || '/images/portfolio/home.png'}
              controls
              muted
              playsInline
              preload="metadata"
              className="h-full w-full object-contain"
            />
          ) : (
            <img src={project.image || '/images/portfolio/home.png'} alt={project.title} className="h-full w-full object-contain" />
          )}
        </div>
      </section>

      <article className="project-glass-panel mt-12 rounded-[32px] px-6 py-7 sm:px-10 sm:py-10 lg:px-14">
        <Markdown content={project.content} className="project-prose" />
      </article>
    </div>
  )
}

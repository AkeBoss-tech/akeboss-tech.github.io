import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProjects } from '@/lib/content'
import { Markdown } from '@/components/markdown'
import { Reveal } from '@/components/reveal'

export function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }))
}

function chunkTags(tags: string[]) {
  return {
    primary: tags.slice(0, 3),
    secondary: tags.slice(3),
  }
}

function getLinkLabel(label: string) {
  const lower = label.toLowerCase()
  if (lower.includes('repo')) return 'Repository'
  if (lower.includes('demo')) return 'Live demo'
  if (lower.includes('website')) return 'Website'
  return label
}

function getRelatedProjects(slug: string, tags: string[]) {
  return getProjects()
    .filter((project) => project.slug !== slug)
    .map((project) => ({
      project,
      score: project.tags.filter((tag) => tags.includes(tag)).length,
    }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.project.rank - b.project.rank)
    .slice(0, 3)
    .map((entry) => entry.project)
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const projects = getProjects()
  const project = projects.find((entry) => entry.slug === slug)
  if (!project) return notFound()

  const { primary, secondary } = chunkTags(project.tags)
  const related = getRelatedProjects(project.slug, project.tags)
  const heroLinks = project.links.slice(0, 2)
  const narrativeSections = project.sections.slice(0, 5)

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
      <section className="relative overflow-hidden py-8 sm:py-10 lg:py-16">
        <div className="hero-orb hero-orb-a" />
        <div className="hero-lines" />
        <div className="grid gap-8 lg:grid-cols-[1fr_.92fr] lg:items-start">
          <Reveal>
            <div className="relative z-10">
              <Link href="/projects" className="inline-flex rounded-full border border-border bg-bg-elevated/80 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted backdrop-blur">
                ← Back to projects
              </Link>
              <div className="mt-5 flex flex-wrap gap-2">
                {primary.map((tag) => (
                  <span key={tag} className="rounded-full border border-border bg-accent-soft px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">
                    {tag}
                  </span>
                ))}
                {secondary.length ? (
                  <span className="rounded-full border border-border bg-bg-strong/75 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">
                    +{secondary.length} more
                  </span>
                ) : null}
              </div>
              <h1 className="mt-5 font-display text-4xl tracking-[-0.06em] sm:text-5xl lg:text-6xl text-balance">{project.title}</h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-text-muted">{project.excerpt}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                {heroLinks.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-accent px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5"
                  >
                    {getLinkLabel(link.label)}
                  </a>
                ))}
                <a href="#case-study" className="glass rounded-full px-5 py-3 text-sm font-medium transition hover:-translate-y-0.5">
                  Read case study
                </a>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="glass rounded-[24px] p-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">Project type</p>
                  <p className="mt-3 text-sm leading-7 text-text-muted">{primary.join(' · ') || 'Technical build'}</p>
                </div>
                <div className="glass rounded-[24px] p-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">Read time</p>
                  <p className="mt-3 text-sm leading-7 text-text-muted">{project.reading}</p>
                </div>
                <div className="glass rounded-[24px] p-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">Story map</p>
                  <p className="mt-3 text-sm leading-7 text-text-muted">{project.sections.length || 1} beats across the build.</p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="grid gap-4">
              {project.image ? (
                <div className="glass rounded-[32px] p-3 sm:p-4">
                  <div className="media-frame aspect-[4/3] overflow-hidden rounded-[26px] border-0">
                    <img src={project.image} alt={project.title} className="h-full w-full object-cover" />
                  </div>
                </div>
              ) : null}
              <div className="glass rounded-[28px] p-5 sm:p-6 project-lead-card">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">Quick take</p>
                <p className="mt-3 text-sm leading-7 text-text-muted">{project.lead || project.excerpt}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="grid gap-8 pb-20 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
        <Reveal className="lg:sticky lg:top-24">
          <aside className="grid gap-4">
            {narrativeSections.length ? (
              <div className="glass rounded-[28px] p-5 sm:p-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">Story map</p>
                <div className="mt-4 grid gap-3">
                  {narrativeSections.map((section, index) => (
                    <a key={section.id} href={`#${section.id}`} className="story-map-item rounded-[22px] border border-border bg-bg-strong/70 px-4 py-4 transition hover:border-accent/30 hover:-translate-y-0.5">
                      <div className="flex items-start gap-3">
                        <span className="story-map-number flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl text-xs font-medium">{String(index + 1).padStart(2, '0')}</span>
                        <div>
                          <p className="text-sm font-medium text-text">{section.title}</p>
                          {section.summary ? <p className="mt-2 text-sm leading-6 text-text-muted line-clamp-3">{section.summary}</p> : null}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="glass rounded-[28px] p-5 sm:p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">Project tags</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-border bg-bg-strong/70 px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-text-muted">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {project.links.length ? (
              <div className="glass rounded-[28px] p-5 sm:p-6">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">Links</p>
                <div className="mt-4 grid gap-2">
                  {project.links.map((link) => (
                    <a key={link.url} href={link.url} target="_blank" rel="noreferrer" className="rounded-[18px] border border-border bg-bg-strong/70 px-4 py-3 text-sm text-text-muted transition hover:border-accent/30 hover:text-text">
                      {getLinkLabel(link.label)} ↗
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </aside>
        </Reveal>

        <Reveal delay={0.05}>
          <div id="case-study" className="glass rounded-[32px] p-6 sm:p-8 lg:p-10">
            <div className="mb-8 border-b border-border pb-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">Case study</p>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-text-muted">
                The project itself, plus the constraints, system choices, and tradeoffs that made it interesting.
              </p>
            </div>
            <Markdown content={project.content} />
          </div>
        </Reveal>
      </section>

      {related.length ? (
        <section className="pb-20">
          <Reveal>
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">Related work</p>
                <h2 className="mt-2 font-display text-3xl tracking-[-0.05em] sm:text-4xl">More projects in the same orbit.</h2>
              </div>
              <Link href="/projects" className="text-sm text-accent">All projects →</Link>
            </div>
          </Reveal>
          <div className="grid gap-4 md:grid-cols-3">
            {related.map((entry, index) => (
              <Reveal key={entry.slug} delay={0.04 * index}>
                <Link href={`/projects/${entry.slug}`} className="glass group block h-full rounded-[28px] p-5 transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(17,19,24,0.12)]">
                  <div className="mb-3 flex flex-wrap gap-2">
                    {entry.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded-full border border-border bg-bg-strong/70 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-text-muted">{tag}</span>
                    ))}
                  </div>
                  <h3 className="font-display text-2xl tracking-tight group-hover:text-accent">{entry.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-text-muted">{entry.excerpt}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}

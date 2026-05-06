import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProject, getProjects } from '@/lib/content'
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

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const projects = getProjects()
  const project = projects.find((entry) => entry.slug === slug)
  if (!project) return notFound()

  const { primary, secondary } = chunkTags(project.tags)
  const currentIndex = projects.findIndex((entry) => entry.slug === project.slug)
  const previousProject = currentIndex > 0 ? projects[currentIndex - 1] : null
  const nextProject = currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null

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
              </div>
              <h1 className="mt-5 font-display text-4xl tracking-[-0.06em] sm:text-5xl lg:text-6xl">{project.title}</h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-text-muted">{project.excerpt}</p>
              <div className="mt-7 flex flex-wrap gap-3">
                {project.links.slice(0, 2).map((link) => (
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
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">Sections</p>
                  <p className="mt-3 text-sm leading-7 text-text-muted">{project.sections.length || 1} story beats</p>
                </div>
              </div>
            </div>
          </Reveal>

          {project.image ? (
            <Reveal delay={0.08}>
              <div className="glass rounded-[32px] p-3 sm:p-4">
                <div className="media-frame aspect-[4/3] overflow-hidden rounded-[26px] border-0">
                  <img src={project.image} alt={project.title} className="h-full w-full object-cover" />
                </div>
              </div>
            </Reveal>
          ) : null}
        </div>
      </section>

      <section className="grid gap-8 pb-20 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
        <Reveal className="lg:sticky lg:top-24">
          <aside className="grid gap-4">
            <div className="glass rounded-[28px] p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">What this page is for</p>
              <p className="mt-3 text-sm leading-7 text-text-muted">
                Not just screenshots — the project with intent, constraints, and a point of view.
              </p>
            </div>
            {project.sections.length ? (
              <div className="glass rounded-[28px] p-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">Jump to</p>
                <div className="mt-4 grid gap-2">
                  {project.sections.map((section) => (
                    <a key={section.id} href={`#${section.id}`} className="rounded-[18px] border border-border bg-bg-strong/70 px-4 py-3 text-sm text-text-muted transition hover:border-accent/30 hover:text-text">
                      {section.title}
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
            <div className="glass rounded-[28px] p-5">
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
              <div className="glass rounded-[28px] p-5">
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
          <div className="glass rounded-[32px] p-6 sm:p-8 lg:p-10">
            <div className="mb-8 border-b border-border pb-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">Case study</p>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-text-muted">
                One example of building technical systems that are clearer, more usable, and more real.
              </p>
            </div>
            <Markdown content={project.content} />
          </div>
        </Reveal>
      </section>

      {(previousProject || nextProject) ? (
        <section className="pb-20">
          <Reveal>
            <div className="grid gap-4 md:grid-cols-2">
              {previousProject ? (
                <Link href={`/projects/${previousProject.slug}`} className="glass group rounded-[28px] p-6 transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(17,19,24,0.12)]">
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">Previous project</p>
                  <h3 className="mt-3 font-display text-2xl tracking-tight group-hover:text-accent">{previousProject.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-text-muted">{previousProject.excerpt}</p>
                </Link>
              ) : <div />}
              {nextProject ? (
                <Link href={`/projects/${nextProject.slug}`} className="glass group rounded-[28px] p-6 transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(17,19,24,0.12)]">
                  <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">Next project</p>
                  <h3 className="mt-3 font-display text-2xl tracking-tight group-hover:text-accent">{nextProject.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-text-muted">{nextProject.excerpt}</p>
                </Link>
              ) : <div />}
            </div>
          </Reveal>
        </section>
      ) : null}
    </div>
  )
}

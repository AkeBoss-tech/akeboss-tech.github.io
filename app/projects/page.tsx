import Link from 'next/link'
import { getProjects } from '@/lib/content'
import { ProjectCard } from '@/components/project-card'

const signalSlugs = ['scarlet-sync', 'lykke', 'economic-grapher', 'robot-code']

export default function ProjectsPage() {
  const projects = getProjects()
  const bySlug = new Map(projects.map((project) => [project.slug, project]))
  const signal = signalSlugs
    .map((slug) => bySlug.get(slug))
    .filter((project): project is NonNullable<(typeof projects)[number]> => Boolean(project))
  const featured = projects.filter((project) => project.featured)
  const rest = projects.filter((project) => !project.featured)
  const highlighted = rest.slice(0, 3)
  const archive = rest.slice(3)

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-10">
      <section className="py-10 lg:py-16">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">Projects</p>
        <h1 className="mt-3 max-w-4xl font-display text-5xl tracking-[-0.05em] sm:text-6xl">A builder portfolio with range.</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-text-muted">
          Product work, AI systems, robotics, scientific computing, and the occasional oddly specific tool that was too useful not to build.
        </p>
      </section>

      <section className="grid gap-4 pb-10 md:grid-cols-2 xl:grid-cols-4">
        {signal.map((project) => (
          <Link key={project.slug} href={`/projects/${project.slug}`} className="glass group rounded-[28px] p-5 transition hover:-translate-y-1">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">Signal project</p>
            <h2 className="mt-4 font-display text-2xl tracking-tight group-hover:text-accent">{project.title}</h2>
            <p className="mt-3 text-sm leading-6 text-text-muted">{project.excerpt}</p>
          </Link>
        ))}
      </section>

      <section className="space-y-6 pb-8">
        {featured.map((project) => <ProjectCard key={project.slug} project={project} featured />)}
      </section>

      <section className="py-10">
        <div className="mb-6 flex items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">More work</p>
            <h2 className="mt-3 font-display text-3xl tracking-tight">A wider slice of what Akash builds.</h2>
          </div>
        </div>
        <div className="grid gap-6 xl:grid-cols-3">
          {highlighted.map((project) => <ProjectCard key={project.slug} project={project} />)}
        </div>
      </section>

      <section className="py-8 lg:py-12">
        <h2 className="font-display text-3xl tracking-tight">Project archive</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {archive.map((project) => <ProjectCard key={project.slug} project={project} />)}
        </div>
      </section>
    </div>
  )
}

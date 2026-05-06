import { getProjects } from '@/lib/content'
import { ProjectCard } from '@/components/project-card'
import { Reveal } from '@/components/reveal'

export default function ProjectsPage() {
  const projects = getProjects()
  const featured = projects.filter((project) => project.featured)
  const rest = projects.filter((project) => !project.featured)

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
      <section className="py-16 lg:py-24">
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">Portfolio</p>
          <h1 className="mt-4 max-w-4xl font-display text-5xl tracking-tight sm:text-7xl">
            A archive of systems
            <br />
            and experiments.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-text-muted">
            From production-grade AI infrastructure to experimental robotics and mathematical tooling. 
            Focused on clarity and technical rigor.
          </p>
        </Reveal>
      </section>

      {/* Featured Projects - Large Visuals */}
      <section className="space-y-8 pb-20">
        <Reveal>
          <div className="mb-8 flex items-center gap-4">
            <h2 className="font-display text-2xl tracking-tight">Core Infrastructure</h2>
            <div className="h-px flex-1 bg-border" />
          </div>
        </Reveal>
        <div className="grid gap-8">
          {featured.map((project, i) => (
            <Reveal key={project.slug} delay={i * 0.1}>
              <ProjectCard project={project} featured />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Archive - Grid */}
      <section className="py-20">
        <Reveal>
          <div className="mb-12 flex items-center gap-4">
            <h2 className="font-display text-2xl tracking-tight">Experimental Archive</h2>
            <div className="h-px flex-1 bg-border" />
          </div>
        </Reveal>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {rest.map((project, i) => (
            <Reveal key={project.slug} delay={i * 0.05}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  )
}

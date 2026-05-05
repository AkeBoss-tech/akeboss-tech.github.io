import { getProjects } from '@/lib/content'
import { ProjectCard } from '@/components/project-card'

export default function ProjectsPage() {
  const projects = getProjects()
  const featured = projects.filter((project) => project.featured)
  const rest = projects.filter((project) => !project.featured)
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-10">
      <section className="py-10 lg:py-16">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">Projects</p>
        <h1 className="mt-3 font-display text-5xl tracking-[-0.05em]">A cross-disciplinary builder portfolio.</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-text-muted">AI systems, robotics, scientific computing, full-stack apps, and the occasional weird challenge that was too fun to ignore.</p>
      </section>
      <section className="space-y-6 pb-8">
        {featured.map((project) => <ProjectCard key={project.slug} project={project} featured />)}
      </section>
      <section className="py-8 lg:py-12">
        <h2 className="font-display text-3xl tracking-tight">Project archive</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {rest.map((project) => <ProjectCard key={project.slug} project={project} />)}
        </div>
      </section>
    </div>
  )
}

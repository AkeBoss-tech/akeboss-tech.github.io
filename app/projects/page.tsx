import { ProjectCard } from '@/components/project-card'
import { getProjects } from '@/lib/content'
import { getProjectsByCategory } from '@/lib/site-data'

export default function ProjectsPage() {
  const grouped = getProjectsByCategory(getProjects())

  return (
    <div className="container-wide py-10 sm:py-14">
      <section className="max-w-4xl">
        <p className="eyebrow">Projects</p>
        <h1 className="mt-4 text-5xl text-text sm:text-7xl">A curated journey through code, math, robotics, and research.</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-text-muted">
          Not one giant list. More like a long night walk through the things I kept building: products, research tools, data work, systems, and the early experiments that started the obsession.
        </p>
      </section>

      <div className="mt-12 space-y-14 sm:space-y-16">
        {grouped.map((category) => (
          <section key={category.title}>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className={`eyebrow ${category.accent}`}>{category.title}</p>
                <h2 className="mt-3 text-3xl text-text sm:text-4xl">{category.description}</h2>
              </div>
              <p className="text-sm uppercase tracking-[0.2em] text-text-soft">scroll sideways ↓</p>
            </div>

            <div className="project-strip flex snap-x gap-5 overflow-x-auto pb-2">
              {category.projects.map((project) => (
                <div key={project.slug} className={category.glow}>
                  <ProjectCard project={project} compact />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

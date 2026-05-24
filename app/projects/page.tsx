import { ProjectCarousel } from '@/components/project-carousel'
import { getProjects } from '@/lib/content'
import { getProjectsByCategory } from '@/lib/site-data'

export default function ProjectsPage() {
  const grouped = getProjectsByCategory(getProjects())

  return (
    <div className="container-wide py-10 sm:py-14">
      <section className="max-w-4xl">
        <h1 className="text-5xl text-text sm:text-7xl">Projects.</h1>
      </section>

      <div className="mt-12 space-y-14 sm:space-y-16">
        {grouped.map((category) => (
          <section key={category.title}>
            <div className="mb-6">
              <div className="max-w-2xl">
                <p className={`eyebrow ${category.accent}`}>{category.title}</p>
              </div>
            </div>

            <ProjectCarousel projects={category.projects} />
          </section>
        ))}
      </div>
    </div>
  )
}

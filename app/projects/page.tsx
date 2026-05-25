import { ProjectFeedSearch } from '@/components/project-feed-search'
import { getProjects } from '@/lib/content'

function sortNewestFirst(a: { date: string; rank: number }, b: { date: string; rank: number }) {
  const aTime = Date.parse(a.date)
  const bTime = Date.parse(b.date)

  if (Number.isNaN(aTime) || Number.isNaN(bTime)) {
    return a.date < b.date ? 1 : -1
  }

  return bTime - aTime || a.rank - b.rank
}
export default function ProjectsPage() {
  const projects = getProjects()
  const favoriteProjects = projects.filter((project) => project.favorite).sort(sortNewestFirst)
  const recentProjects = projects.filter((project) => !project.favorite).sort(sortNewestFirst)

  return (
    <div className="container-wide py-10 sm:py-14">
      <section className="max-w-4xl">
        <h1 className="text-5xl text-text sm:text-7xl">Projects.</h1>
        <p className="mt-3 max-w-2xl text-text-soft">Things I&apos;m building and exploring.</p>
      </section>

      <ProjectFeedSearch favoriteProjects={favoriteProjects} recentProjects={recentProjects} />
    </div>
  )
}

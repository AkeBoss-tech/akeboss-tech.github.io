import Link from 'next/link'
import { ResponsiveImage } from '@/components/responsive-image'
import type { Project } from '@/lib/content'

function getStatus(project: Project) {
  if (project.featured) return 'Active'
  if (project.tags.some((tag) => /research|analysis|math/i.test(tag))) return 'Research'
  return 'Archive'
}

export function ProjectCard({
  project,
  compact = false,
}: {
  project: Project
  compact?: boolean
}) {
  const status = getStatus(project)

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={`group panel-soft block overflow-hidden rounded-[30px] border border-white/10 shadow-none ${compact ? 'w-[20rem] shrink-0 snap-start' : ''}`}
    >
      <div className="relative overflow-hidden border-b border-white/8">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-90" />
        <ResponsiveImage
          src={project.image || '/images/portfolio/home.png'}
          alt={project.title}
          className={`w-full object-cover transition duration-500 group-hover:scale-[1.03] ${compact ? 'h-52' : 'h-64 sm:h-72'}`}
          sizes={compact ? '(max-width: 768px) 92vw, 20rem' : '(max-width: 768px) 92vw, 28rem'}
        />
      </div>

      <div className="flex flex-col p-5 sm:p-6">
        <h3 className={`text-text transition group-hover:text-white ${compact ? 'text-2xl' : 'text-3xl sm:text-4xl'}`}>
          {project.title}
        </h3>
        <p className="mt-4 text-sm leading-7 text-text-muted">{project.excerpt}</p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="tag">{status}</span>
          {project.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>

      </div>
    </Link>
  )
}

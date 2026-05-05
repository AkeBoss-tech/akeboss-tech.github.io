import Link from 'next/link'
import type { Project } from '@/lib/content'

export function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  return (
    <Link href={`/projects/${project.slug}`} className={`group glass overflow-hidden rounded-[28px] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(17,19,24,0.12)] ${featured ? 'grid gap-0 lg:grid-cols-[1.05fr_.95fr]' : 'flex flex-col'}`}>
      {project.image ? (
        <div className={`project-card-media ${featured ? 'order-first min-h-[280px] lg:min-h-[100%]' : 'aspect-[16/10]'}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={project.image} alt={project.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />
          <div className="project-card-overlay" />
          <div className="absolute left-4 top-4 z-10 flex flex-wrap gap-2">
            {project.tags.slice(0, featured ? 4 : 3).map((tag) => (
              <span key={tag} className="rounded-full border border-white/15 bg-slate-950/55 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-white/80 backdrop-blur-md">{tag}</span>
            ))}
          </div>
        </div>
      ) : null}

      <div className={`${featured ? 'p-8 lg:p-10' : 'p-6'}`}>
        {!project.image ? (
          <div className="mb-4 flex flex-wrap gap-2">
            {project.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="rounded-full border border-border bg-accent-soft px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">{tag}</span>
            ))}
          </div>
        ) : null}
        <h3 className={`font-display tracking-tight ${featured ? 'text-3xl' : 'text-xl'} group-hover:text-accent`}>{project.title}</h3>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-text-muted">{project.excerpt}</p>
        <div className="mt-6 flex items-center gap-2 text-sm font-medium text-accent">
          View case study <span className="transition group-hover:translate-x-1">→</span>
        </div>
      </div>
    </Link>
  )
}

import Link from 'next/link'
import type { Project } from '@/lib/content'

export function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  return (
    <Link href={`/projects/${project.slug}`} className={`group glass overflow-hidden rounded-[28px] transition duration-300 hover:-translate-y-1 ${featured ? 'grid gap-6 lg:grid-cols-[1.1fr_.9fr]' : 'flex flex-col'}`}>
      <div className={`${featured ? 'p-8 lg:p-10' : 'p-6'}`}>
        <div className="mb-4 flex flex-wrap gap-2">
          {project.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="rounded-full border border-border bg-accent-soft px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">{tag}</span>
          ))}
        </div>
        <h3 className={`font-display tracking-tight ${featured ? 'text-3xl' : 'text-xl'} group-hover:text-accent`}>{project.title}</h3>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-text-muted">{project.excerpt}</p>
        <div className="mt-6 flex items-center gap-2 text-sm font-medium text-accent">
          View case study <span className="transition group-hover:translate-x-1">→</span>
        </div>
      </div>
      {project.image ? (
        <div className={`${featured ? 'min-h-[280px]' : 'aspect-[16/10]'} overflow-hidden border-t border-border lg:border-l lg:border-t-0`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={project.image} alt={project.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
        </div>
      ) : null}
    </Link>
  )
}

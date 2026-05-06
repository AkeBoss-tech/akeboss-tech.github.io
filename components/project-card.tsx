import Link from 'next/link'
import type { Project } from '@/lib/content'
import { DynamicProjectVisual } from './visuals'

export function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  return (
    <Link href={`/projects/${project.slug}`} className={`group glass overflow-hidden rounded-[32px] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(17,19,24,0.12)] ${featured ? 'grid gap-0 lg:grid-cols-[1.1fr_.9fr]' : 'flex flex-col'}`}>
      <div className={`project-card-media p-3 ${featured ? 'order-last lg:order-first' : ''}`}>
        <div className="relative overflow-hidden rounded-[24px]">
          <DynamicProjectVisual slug={project.slug} />
        </div>
      </div>

      <div className={`${featured ? 'p-8 lg:p-10 flex flex-col justify-center' : 'p-6 pt-2'}`}>
        <div className="mb-4 flex flex-wrap gap-2">
          {project.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="rounded-full border border-border bg-bg-strong/50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-text-muted">{tag}</span>
          ))}
        </div>
        <h3 className={`font-display tracking-tight ${featured ? 'text-4xl' : 'text-2xl'} group-hover:text-accent transition-colors`}>{project.title}</h3>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-text-muted">{project.excerpt}</p>
        <div className="mt-6 flex items-center gap-2 text-sm font-medium text-accent">
          View case study <span className="transition group-hover:translate-x-1">→</span>
        </div>
      </div>
    </Link>
  )
}

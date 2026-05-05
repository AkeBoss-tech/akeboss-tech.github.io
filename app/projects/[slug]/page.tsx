import { notFound } from 'next/navigation'
import { getProject, getProjects } from '@/lib/content'
import { Markdown } from '@/components/markdown'

export function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }))
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) return notFound()
  return (
    <div className="mx-auto max-w-6xl px-6 lg:px-10">
      <section className="grid gap-8 py-10 lg:grid-cols-[1fr_.9fr] lg:py-16">
        <div>
          <div className="mb-4 flex flex-wrap gap-2">{project.tags.map((tag) => <span key={tag} className="rounded-full border border-border bg-accent-soft px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">{tag}</span>)}</div>
          <h1 className="font-display text-5xl tracking-[-0.05em]">{project.title}</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-text-muted">{project.excerpt}</p>
        </div>
        {project.image ? <div className="media-frame aspect-[4/3]">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={project.image} alt={project.title} /></div> : null}
      </section>
      <section className="pb-20"><Markdown content={project.content} /></section>
    </div>
  )
}

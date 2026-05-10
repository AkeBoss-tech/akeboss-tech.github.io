import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Markdown } from '@/components/markdown'
import { getProjects } from '@/lib/content'

export function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }))
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = getProjects().find((entry) => entry.slug === slug)
  if (!project) return notFound()

  return (
    <div className="container-wide py-10 sm:py-14">
      <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
        <div className="max-w-3xl">
          <Link href="/projects" className="eyebrow inline-flex items-center gap-2 text-text-soft hover:text-text">
            ← Back to projects
          </Link>
          <div className="mt-6 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
          <h1 className="mt-6 text-5xl text-text sm:text-7xl">{project.title}</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-text-muted">{project.excerpt}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            {project.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/12 bg-white/[0.04] px-5 py-3 text-sm text-text-muted hover:border-white/25 hover:text-text"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="panel mt-8 rounded-[28px] p-5">
            <p className="eyebrow">Case study shape</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-sm text-text-soft">Lead</p>
                <p className="mt-2 text-sm leading-7 text-text-muted">{project.lead || 'A technical build shaped by iteration and hard constraints.'}</p>
              </div>
              <div>
                <p className="text-sm text-text-soft">Sections</p>
                <p className="mt-2 text-sm leading-7 text-text-muted">{project.sections.length || 1} chapters in the writeup.</p>
              </div>
              <div>
                <p className="text-sm text-text-soft">Read time</p>
                <p className="mt-2 text-sm leading-7 text-text-muted">{project.reading}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="panel-soft overflow-hidden rounded-[32px]">
          <img src={project.image || '/images/portfolio/home.png'} alt={project.title} className="h-full w-full object-cover" />
        </div>
      </section>

      <section className="mt-12 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="panel-soft h-fit rounded-[28px] p-5 sm:p-6">
          <p className="eyebrow">Chapter map</p>
          <div className="mt-4 space-y-3">
            {project.sections.map((section) => (
              <a key={section.id} href={`#${section.id}`} className="block rounded-[18px] border border-white/8 bg-black/20 px-4 py-3 text-sm text-text-muted hover:border-white/14 hover:text-text">
                {section.title}
              </a>
            ))}
          </div>
        </aside>

        <article className="panel rounded-[32px] px-6 py-7 sm:px-8 sm:py-9">
          <Markdown content={project.content} />
        </article>
      </section>
    </div>
  )
}

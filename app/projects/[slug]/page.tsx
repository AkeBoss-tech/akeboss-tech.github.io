import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getProjects } from '@/lib/content'
import { Markdown } from '@/components/markdown'
import { Reveal } from '@/components/reveal'
import { DynamicProjectVisual } from '@/components/visuals'
import { MeshHero, InfiniteStream } from '@/components/hero-variants'
import { FinalReveal } from '@/components/reveal-animation'

export function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }))
}

function getLinkLabel(label: string) {
  const lower = label.toLowerCase()
  if (lower.includes('repo')) return 'Repository'
  if (lower.includes('demo')) return 'Live Demo'
  if (lower.includes('website')) return 'Website'
  return label
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const projects = getProjects()
  const project = projects.find((entry) => entry.slug === slug)
  if (!project) return notFound()

  const heroLinks = project.links.slice(0, 2)

  return (
    <div className="relative min-h-screen bg-bg overflow-x-hidden">
      {/* Immersive Background */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.4] dark:opacity-[0.25]">
        <MeshHero />
      </div>
      
      <div className="relative z-10 container-wide">
        {/* Back Button */}
        <div className="pt-12 lg:pt-16">
          <Link href="/projects" className="inline-flex items-center gap-3 text-sm font-mono uppercase tracking-[0.3em] text-[#635bff] font-bold group">
            <span className="transition-transform group-hover:-translate-x-2">←</span> Archive
          </Link>
        </div>

        {/* Project Hero */}
        <section className="relative py-24 lg:py-40">
          <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <Reveal>
              <h1 className="text-[clamp(3.5rem,10vw,7.5rem)] tracking-tightest leading-[0.88] text-balance">
                {project.title}
              </h1>
              <p className="mt-12 max-w-2xl text-2xl lg:text-3xl text-text-muted leading-relaxed font-light opacity-90">
                {project.excerpt}
              </p>
              
              <div className="mt-16 flex flex-wrap gap-8">
                {heroLinks.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-[#635bff] px-12 py-6 text-lg font-bold text-white transition hover:bg-[#7a73ff] hover:shadow-[0_20px_40px_rgba(99,91,255,0.3)] active:scale-95 shadow-xl"
                  >
                    {getLinkLabel(link.label)}
                  </a>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="relative aspect-[4/3] w-full rounded-[40px] overflow-hidden bg-bg-strong border border-border shadow-2xl">
                <DynamicProjectVisual slug={project.slug} />
              </div>
            </Reveal>
          </div>
        </section>

        {/* Focused Case Study */}
        <section className="py-24 lg:py-48 border-t border-border/40">
          <div className="max-w-4xl mx-auto">
            <Reveal>
               <article className="prose prose-lg dark:prose-invert max-w-none">
                  <Markdown content={project.content} />
               </article>
            </Reveal>
          </div>
        </section>

        {/* End Experience */}
        <section className="relative py-48 lg:py-64 border-t border-border/40 overflow-hidden">
          <FinalReveal />
          <div className="relative z-20 text-center -mt-32">
             <Reveal>
               <p className="font-mono text-[11px] uppercase tracking-[0.5em] text-[#635bff] mb-12 font-black">Chapter Complete</p>
               <h2 className="text-5xl sm:text-8xl tracking-tightest mb-16 font-bold">Discover more.</h2>
               <Link href="/projects" className="rounded-full bg-text text-bg px-16 py-8 font-bold text-2xl transition active:scale-95 shadow-2xl inline-block hover:opacity-90">
                  Full Archive
               </Link>
             </Reveal>
          </div>
          <div className="absolute inset-x-0 bottom-0 h-96 opacity-10">
             <InfiniteStream />
          </div>
        </section>
      </div>
    </div>
  )
}

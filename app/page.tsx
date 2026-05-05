import Link from 'next/link'
import { getPosts, getProjects } from '@/lib/content'
import { ProjectCard } from '@/components/project-card'
import { PostCard } from '@/components/post-card'

const statItems = [
  ['4.0 GPA', 'Rutgers Honors College'],
  ['AI + Robotics', 'research + product work'],
  ['Founder / builder', 'systems, apps, and tools'],
]

export default function HomePage() {
  const projects = getProjects()
  const featured = projects.filter((project) => project.featured).concat(projects.filter((p) => !p.featured && ['hic-tad-analysis','personal-assistant','grokipedia-api'].includes(p.slug))).slice(0, 5)
  const posts = getPosts().slice(0, 4)

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-10">
      <section className="grid items-center gap-10 py-12 lg:grid-cols-[1.08fr_.92fr] lg:py-20">
        <div className="section-fade">
          <div className="mb-5 inline-flex rounded-full border border-border bg-accent-soft px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">
            Research editorial × systems minimal
          </div>
          <h1 className="font-display text-5xl leading-none tracking-[-0.05em] sm:text-6xl lg:text-7xl">
            AI systems, robotics, research, and products.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-text-muted">
            I’m Akash Dubey — a computer science and mathematics student at Rutgers Honors College building across agentic AI, motion planning, scientific computing, and useful software products.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/projects" className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5">View Projects</Link>
            <Link href="/resume" className="glass rounded-full px-6 py-3 text-sm font-medium">Resume</Link>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {statItems.map(([value, label]) => (
              <div key={value} className="glass rounded-3xl p-4">
                <div className="font-display text-2xl tracking-tight">{value}</div>
                <div className="mt-1 text-sm text-text-muted">{label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="section-fade relative">
          <div className="pointer-events-none absolute inset-0 -z-10 grid-bg rounded-[2rem] opacity-70" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="media-frame aspect-[4/5] sm:row-span-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/face.jpg" alt="Akash Dubey" className="h-full w-full object-cover" />
            </div>
            <div className="media-frame aspect-[4/3] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/posts/frc24/comp/image2.gif" alt="Robotics demo" className="h-full w-full object-cover" />
            </div>
            <div className="media-frame aspect-[4/3] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/portfolio/bus/buses.gif" alt="Data visualization demo" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 lg:py-14">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">Selected work</p>
            <h2 className="mt-3 font-display text-4xl tracking-[-0.04em]">Featured projects</h2>
          </div>
          <Link href="/projects" className="text-sm text-accent">See all projects →</Link>
        </div>
        <div className="grid gap-6">
          {featured.slice(0, 2).map((project) => <ProjectCard key={project.slug} project={project} featured />)}
          <div className="grid gap-6 md:grid-cols-3">
            {featured.slice(2).map((project) => <ProjectCard key={project.slug} project={project} />)}
          </div>
        </div>
      </section>

      <section className="grid gap-8 py-10 lg:grid-cols-[.95fr_1.05fr] lg:py-16">
        <div className="glass rounded-[32px] p-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">Current focus</p>
          <h2 className="mt-3 font-display text-3xl tracking-tight">Where my energy is going right now</h2>
          <ul className="mt-6 space-y-4 text-sm leading-7 text-text-muted">
            <li><span className="text-text">AI systems</span> — agentic workflows, post-training, retrieval, and practical interfaces for intelligent tools.</li>
            <li><span className="text-text">Robotics</span> — motion planning, GPU acceleration, and vision-language-action systems.</li>
            <li><span className="text-text">Scientific computing</span> — comp bio, chromatin structure, and custom simulation/analysis pipelines.</li>
            <li><span className="text-text">Useful products</span> — scheduling, student tools, data systems, and things real people can actually use.</li>
          </ul>
        </div>
        <div>
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">Writing</p>
              <h2 className="mt-3 font-display text-3xl tracking-tight">Reflections, build logs, and notes</h2>
            </div>
            <Link href="/writing" className="text-sm text-accent">Browse writing →</Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {posts.map((post) => <PostCard key={post.slug} post={post} />)}
          </div>
        </div>
      </section>
    </div>
  )
}

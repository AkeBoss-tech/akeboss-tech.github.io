import Link from 'next/link'
import { getPosts, getProjects } from '@/lib/content'
import { ProjectCard } from '@/components/project-card'
import { PostCard } from '@/components/post-card'
import { Reveal } from '@/components/reveal'
import { AutoVideo } from '@/components/auto-video'

const statItems = [
  ['Rutgers Honors', 'computer science + mathematics'],
  ['Economics Labs', 'research, leadership, and systems thinking'],
  ['Builder energy', 'products, tools, and weird ideas'],
]

const nowCards = [
  {
    title: 'Building AI systems',
    body: 'Agentic workflows, retrieval, post-training ideas, and interfaces that make intelligent tools actually usable.',
  },
  {
    title: 'Working on robotics',
    body: 'Motion planning, GPU-heavy pipelines, and the overlap between autonomy, perception, and real-world control.',
  },
  {
    title: 'Exploring research',
    body: 'Scientific computing, computational biology, Rutgers Economics Labs, and projects that turn messy technical questions into usable systems.',
  },
]

const highlights = [
  'AI systems that feel useful, not just impressive',
  'Robotics demos, motion, and real-world feedback loops',
  'Research projects with visual clarity and product instincts',
]

export default function HomePage() {
  const projects = getProjects()
  const featured = projects
    .filter((project) => project.featured)
    .concat(projects.filter((p) => !p.featured && ['hic-tad-analysis', 'personal-assistant', 'grokipedia-api'].includes(p.slug)))
    .slice(0, 5)
  const posts = getPosts().slice(0, 4)

  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-10">
      <section className="relative overflow-hidden py-10 lg:py-16">
        <div className="hero-orb hero-orb-a" />
        <div className="hero-orb hero-orb-b" />
        <div className="grid items-start gap-10 lg:grid-cols-[1.06fr_.94fr] lg:gap-14">
          <Reveal>
            <div className="mb-5 inline-flex rounded-full border border-border bg-accent-soft px-4 py-2 font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">
              Rutgers • research • products • robotics
            </div>
            <h1 className="font-display text-6xl leading-[0.92] tracking-[-0.08em] sm:text-7xl lg:text-[6.9rem]">
              Hi, I&apos;m Akash.
            </h1>
            <p className="mt-6 max-w-2xl text-2xl leading-[1.3] tracking-[-0.03em] text-text sm:text-3xl">
              I build ambitious systems — AI tools, robotics software, research infrastructure, and products with real momentum.
            </p>
            <p className="mt-6 max-w-2xl text-base leading-8 text-text-muted sm:text-lg">
              I&apos;m a computer science and mathematics student at Rutgers Honors College. My work usually lives where research depth meets product taste: agentic AI, motion planning, comp bio, data systems, and student-facing tools shaped by actual use.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/projects" className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5">See what I&apos;ve built</Link>
              <Link href="/moodboard" className="glass rounded-full px-6 py-3 text-sm font-medium">Visual references</Link>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {statItems.map(([value, label], index) => (
                <Reveal key={value} delay={0.05 * (index + 1)}>
                  <div className="glass rounded-3xl p-4">
                    <div className="font-display text-2xl tracking-tight">{value}</div>
                    <div className="mt-1 text-sm text-text-muted">{label}</div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="relative">
              <div className="pointer-events-none absolute inset-0 -z-10 grid-bg rounded-[2rem] opacity-70" />
              <div className="glass overflow-hidden rounded-[2rem] p-3 shadow-[0_30px_120px_rgba(17,19,24,0.18)]">
                <div className="relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950">
                  <AutoVideo
                    src="/images/posts/frc24/comp/image10.gif"
                    poster="/images/posts/frc24/comp/image3.jpg"
                    className="aspect-[4/3] rounded-[1.35rem] border-0"
                  />
                  <div className="hero-video-overlay absolute inset-0" />
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <div className="glass max-w-md rounded-[1.4rem] border-white/10 bg-slate-950/55 p-4 text-white shadow-none backdrop-blur-xl">
                      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/70">Live energy</p>
                      <p className="mt-2 font-display text-2xl tracking-tight">Software that moves.</p>
                      <p className="mt-2 text-sm leading-7 text-white/75">
                        Robotics footage, interface polish, and systems thinking — the kind of work I&apos;m happiest doing.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-[1.1fr_.9fr]">
                  <div className="glass rounded-[24px] p-5">
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">Current mode</p>
                    <p className="mt-3 font-display text-2xl tracking-tight">Builder, researcher, operator.</p>
                    <ul className="mt-4 space-y-3 text-sm leading-7 text-text-muted">
                      {highlights.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span className="mt-2 h-2 w-2 rounded-full bg-accent" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="media-frame aspect-[4/5] overflow-hidden rounded-[24px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/images/face.jpg" alt="Akash Dubey" className="h-full w-full object-cover object-center" />
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="grid gap-6 py-4 lg:grid-cols-3 lg:py-8">
        {nowCards.map((card, index) => (
          <Reveal key={card.title} delay={0.06 * index}>
            <div className="glass h-full rounded-[28px] p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">Right now</p>
              <h2 className="mt-3 font-display text-2xl tracking-tight">{card.title}</h2>
              <p className="mt-4 text-sm leading-7 text-text-muted">{card.body}</p>
            </div>
          </Reveal>
        ))}
      </section>

      <section className="py-10 lg:py-16">
        <Reveal>
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">Selected work</p>
              <h2 className="mt-3 font-display text-4xl tracking-[-0.04em]">A few things I&apos;m proud of</h2>
            </div>
            <Link href="/projects" className="text-sm text-accent">All projects →</Link>
          </div>
        </Reveal>
        <div className="grid gap-6">
          {featured.slice(0, 2).map((project, index) => (
            <Reveal key={project.slug} delay={0.04 * index}>
              <ProjectCard project={project} featured />
            </Reveal>
          ))}
          <div className="grid gap-6 md:grid-cols-3">
            {featured.slice(2).map((project, index) => (
              <Reveal key={project.slug} delay={0.04 * index}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-8 py-10 lg:grid-cols-[.95fr_1.05fr] lg:py-16">
        <Reveal>
          <div className="glass rounded-[32px] p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">What I care about</p>
            <h2 className="mt-3 font-display text-3xl tracking-tight">Not just one lane.</h2>
            <ul className="mt-6 space-y-4 text-sm leading-7 text-text-muted">
              <li><span className="text-text">Technical depth</span> — I like learning hard systems from the inside out.</li>
              <li><span className="text-text">Range</span> — AI, robotics, math, comp bio, product, and whatever else helps solve the problem.</li>
              <li><span className="text-text">Execution</span> — demos, prototypes, experiments, and real things people can use.</li>
              <li><span className="text-text">Taste</span> — clear writing, strong visuals, and products that feel intentional.</li>
            </ul>
          </div>
        </Reveal>
        <Reveal delay={0.06}>
          <div>
            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">Writing</p>
                <h2 className="mt-3 font-display text-3xl tracking-tight">Notes from the build process</h2>
              </div>
              <Link href="/writing" className="text-sm text-accent">Browse writing →</Link>
            </div>
            <div className="grid gap-5 md:grid-cols-2">
              {posts.map((post, index) => (
                <Reveal key={post.slug} delay={0.04 * index}>
                  <PostCard post={post} />
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  )
}

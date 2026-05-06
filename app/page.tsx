import Link from 'next/link'
import { getProjects } from '@/lib/content'
import { Reveal } from '@/components/reveal'

const introChips = ['AI', 'robotics', 'research', 'products', 'math', 'design']

const storyCards = [
  {
    kicker: 'Build',
    title: 'Real systems.',
    body: 'Robotics, research tools, AI products, and student software that have to work outside a slide deck.',
  },
  {
    kicker: 'Think',
    title: 'Structure first.',
    body: 'Messy inputs get turned into workflows, interfaces, and decisions that feel simpler than the underlying problem.',
  },
  {
    kicker: 'Care',
    title: 'Taste matters.',
    body: 'The work should be useful, but it should also feel deliberate, calm, and worth showing to people.',
  },
]

const signalCards = [
  {
    href: '/projects/scarlet-sync',
    eyebrow: 'Student product',
    title: 'Scarlet Sync',
    note: 'Rutgers scheduling + degree planning.',
  },
  {
    href: '/projects/lykke',
    eyebrow: 'AI systems',
    title: 'Lykke',
    note: 'Course-aware study tooling used by real students.',
  },
  {
    href: '/projects/economic-grapher',
    eyebrow: 'Rutgers Economics Labs',
    title: 'Economics data tooling',
    note: 'Research-friendly visual analysis.',
  },
  {
    href: '/projects/robot-code',
    eyebrow: 'Robotics',
    title: 'FRC motion + control',
    note: 'Code under hardware and time pressure.',
  },
]

const featuredSlugs = ['scarlet-sync', 'lykke', 'hic-tad-analysis', 'personal-assistant', 'grokipedia-api', 'robot-code']

export default function HomePage() {
  const projects = getProjects()
  const bySlug = new Map(projects.map((project) => [project.slug, project]))
  const featured = featuredSlugs
    .map((slug) => bySlug.get(slug))
    .filter((project): project is NonNullable<(typeof projects)[number]> => Boolean(project))
    .slice(0, 6)

  const totalTags = new Set(projects.flatMap((project) => project.tags)).size
  const featuredCount = projects.filter((project) => project.featured).length
  const writtenCount = projects.filter((project) => project.sections.length > 0).length

  const trajectory = [
    {
      step: '01',
      label: 'Find a painful workflow',
      title: 'Build for an obvious user problem.',
      body: 'A lot of the strongest work starts with friction that is easy to feel: course planning, study chaos, messy research data, robotics under match pressure.',
    },
    {
      step: '02',
      label: 'Make the system legible',
      title: 'Turn hidden complexity into a cleaner interface.',
      body: 'Scraping, RAG pipelines, visual analysis, and control code are different technically, but they all reward the same instinct: reduce confusion without dumbing the problem down.',
    },
    {
      step: '03',
      label: 'Pressure-test it',
      title: 'Prefer things that survive contact with reality.',
      body: 'Real students, real datasets, real hardware, real deadlines. That is where taste and engineering both get exposed.',
    },
  ]

  const proofPoints = [
    { value: String(projects.length).padStart(2, '0'), label: 'projects in the archive' },
    { value: String(totalTags).padStart(2, '0'), label: 'distinct domains touched' },
    { value: String(featuredCount).padStart(2, '0'), label: 'deeper case studies' },
    { value: String(writtenCount).padStart(2, '0'), label: 'projects with narrative writeups' },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
      <section className="relative min-h-[92svh] overflow-hidden py-6 sm:py-8 lg:py-12">
        <div className="hero-orb hero-orb-a" />
        <div className="hero-orb hero-orb-b" />
        <div className="hero-lines" />

        <div className="grid items-center gap-8 lg:min-h-[84svh] lg:grid-cols-[1.02fr_0.98fr] lg:gap-12">
          <Reveal className="order-2 lg:order-1">
            <div className="relative z-10 mx-auto max-w-xl lg:mx-0">
              <div className="mb-5 inline-flex rounded-full border border-border bg-bg-elevated/80 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.22em] text-text-muted backdrop-blur">
                Hi, I&apos;m Akash
              </div>
              <h1 className="font-display text-[clamp(4rem,12vw,8.8rem)] leading-[0.84] tracking-[-0.1em] text-balance">
                I build
                <br />
                ambitious things.
              </h1>
              <p className="mt-5 max-w-md text-lg leading-7 text-text-muted sm:text-xl">
                CS, math, robotics, AI, and product — tied together by a love for clear, useful systems.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/projects" className="rounded-full bg-accent px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(41,82,227,0.22)]">
                  See projects
                </Link>
                <Link href="/about" className="glass rounded-full px-5 py-3 text-sm font-medium transition hover:-translate-y-0.5">
                  My story
                </Link>
                <Link href="/resume" className="glass rounded-full px-5 py-3 text-sm font-medium transition hover:-translate-y-0.5">
                  Resume
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                {introChips.map((item, index) => (
                  <span key={item} className="glass rounded-full px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-text-muted" style={{ animationDelay: `${index * 120}ms` }}>
                    {item}
                  </span>
                ))}
              </div>
              <div className="mt-10 hidden items-center gap-3 text-sm text-text-muted sm:flex">
                <span className="h-px w-10 bg-border" />
                Scroll to see more
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08} className="order-1 lg:order-2">
            <div className="relative mx-auto max-w-[32rem] lg:max-w-none">
              <div className="glass relative overflow-hidden rounded-[34px] p-3 sm:p-4 hero-photo-card">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.18),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(96,165,250,0.18),transparent_30%)]" />
                <div className="relative grid gap-3 sm:gap-4">
                  <div className="media-frame aspect-[4/5] overflow-hidden rounded-[28px] border-white/10">
                    <img src="/images/face.jpg" alt="Akash Dubey portrait" className="h-full w-full object-cover object-center" />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-[1.1fr_0.9fr]">
                    <div className="rounded-[24px] border border-border bg-bg-strong/80 p-4 sm:p-5">
                      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">Current focus</p>
                      <p className="mt-3 font-display text-2xl tracking-tight">Builder, researcher, operator.</p>
                    </div>
                    <div className="rounded-[24px] border border-border bg-bg-strong/80 p-4 sm:p-5">
                      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">Based at</p>
                      <p className="mt-3 text-sm leading-7 text-text-muted">Rutgers Honors College · CS + Math.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-8 pt-2 sm:pb-10 lg:pb-14">
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div className="glass h-full rounded-[32px] p-6 sm:p-8 lg:p-10 story-band">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">Story</p>
              <h2 className="mt-3 font-display text-4xl tracking-[-0.06em] sm:text-5xl text-balance">
                Different domains. Same instinct.
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-text-muted">
                The through-line is not just what gets built. It is the preference for systems that become clearer under pressure instead of noisier.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {storyCards.map((card, index) => (
                  <article key={card.title} className="rounded-[24px] border border-border bg-bg-strong/70 p-5" style={{ animationDelay: `${index * 80}ms` }}>
                    <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">{card.kicker}</p>
                    <h3 className="mt-3 font-display text-2xl tracking-tight">{card.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-text-muted">{card.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="glass h-full rounded-[32px] p-6 sm:p-8 lg:p-10">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">Proof</p>
                  <h2 className="mt-3 font-display text-3xl tracking-[-0.05em] sm:text-4xl text-balance">Breadth is real, but it is not random.</h2>
                </div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {proofPoints.map((item) => (
                  <div key={item.label} className="rounded-[24px] border border-border bg-bg-strong/70 p-5">
                    <p className="font-display text-4xl tracking-[-0.06em]">{item.value}</p>
                    <p className="mt-2 text-sm leading-6 text-text-muted">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-8 pt-2 sm:pb-12 lg:pb-16">
        <Reveal>
          <div className="glass rounded-[32px] p-6 sm:p-8 lg:p-10 trajectory-shell">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">Trajectory</p>
                <h2 className="mt-3 font-display text-3xl tracking-[-0.05em] sm:text-5xl text-balance">
                  How the work usually unfolds.
                </h2>
                <p className="mt-5 max-w-xl text-sm leading-7 text-text-muted">
                  The projects look different on the surface, but most of them follow the same arc: spot friction, make the system legible, and test it against reality.
                </p>
              </div>
              <div className="grid gap-4">
                {trajectory.map((item, index) => (
                  <article key={item.step} className="trajectory-step rounded-[28px] border border-border bg-bg-strong/70 p-5 sm:p-6" style={{ animationDelay: `${index * 100}ms` }}>
                    <div className="flex items-start gap-4">
                      <div className="trajectory-number flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-display text-xl">{item.step}</div>
                      <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">{item.label}</p>
                        <h3 className="mt-2 font-display text-2xl tracking-tight">{item.title}</h3>
                        <p className="mt-3 text-sm leading-7 text-text-muted">{item.body}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="pb-8 pt-2 sm:pb-12 lg:pb-16">
        <Reveal>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">Current signal</p>
              <h2 className="mt-2 font-display text-3xl tracking-[-0.05em] sm:text-4xl">The projects that carry the story.</h2>
            </div>
          </div>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {signalCards.map((card, index) => (
            <Reveal key={card.title} delay={0.04 * index}>
              <Link href={card.href} className="signal-card glass group block rounded-[28px] p-5 transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(17,19,24,0.12)]">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">{card.eyebrow}</p>
                <h3 className="mt-4 font-display text-2xl tracking-tight group-hover:text-accent">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-text-muted">{card.note}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="pb-16 pt-2 sm:pb-20">
        <Reveal>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">Selected work</p>
              <h2 className="mt-2 font-display text-3xl tracking-[-0.05em] sm:text-4xl">Dive into the details.</h2>
            </div>
            <Link href="/projects" className="text-sm text-accent">
              All projects →
            </Link>
          </div>
        </Reveal>
        <div className="grid gap-4 lg:grid-cols-4">
          {featured.map((project, index) => (
            <Reveal key={project.slug} delay={0.04 * index} className={index === 0 || index === 1 ? 'lg:col-span-2' : ''}>
              <Link href={`/projects/${project.slug}`} className="glass group block h-full rounded-[28px] p-3 transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(17,19,24,0.12)]">
                <div className="media-frame aspect-[4/3] rounded-[22px] border-0">
                  <img src={project.image} alt={project.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                </div>
                <div className="px-2 pb-2 pt-4">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    {project.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="rounded-full border border-border bg-bg-strong/70 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-text-muted">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h3 className="font-display text-2xl tracking-tight">{project.title}</h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-text-muted">{project.excerpt}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  )
}

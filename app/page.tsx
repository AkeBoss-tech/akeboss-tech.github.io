import Link from 'next/link'
import { getProjects } from '@/lib/content'
import { Reveal } from '@/components/reveal'

const introChips = ['AI', 'robotics', 'research', 'products', 'math', 'design']

const storyCards = [
  {
    kicker: 'Build',
    title: 'Real systems.',
    body: 'Robotics, research tools, AI products, student software.',
  },
  {
    kicker: 'Think',
    title: 'Clear structure.',
    body: 'Messy inputs turned into sharper systems.',
  },
  {
    kicker: 'Care',
    title: 'Taste + momentum.',
    body: 'Work that feels sharp, alive, and worth showing.',
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
    note: 'Course-aware study tooling.',
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

const valuePoints = [
  'AI, robotics, research, and product fit together here.',
  'The through-line is clarity under real constraints.',
  'The goal is useful systems with visual taste.',
]

const currentBlocks = [
  {
    title: 'Rutgers Economics Labs',
    body: 'Research-facing data tools and visual analysis that make messy information easier to work with.',
  },
  {
    title: 'AI systems',
    body: 'Agent workflows, useful interfaces, and product-minded ML work that has to feel real.',
  },
  {
    title: 'Robotics + control',
    body: 'Software under physical constraints, competition pressure, and hardware feedback loops.',
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
        <Reveal>
          <div className="glass overflow-hidden rounded-[32px] p-6 sm:p-8 lg:p-10 story-band">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">Story</p>
                <h2 className="mt-3 font-display text-4xl tracking-[-0.06em] sm:text-5xl lg:text-6xl text-balance">
                  Different domains. Same instinct.
                </h2>
              </div>
              <div className="grid gap-3">
                {valuePoints.map((point, index) => (
                  <div key={point} className="rounded-[22px] border border-border bg-bg-strong/70 px-4 py-4 text-sm leading-6 text-text-muted" style={{ animationDelay: `${index * 100}ms` }}>
                    {point}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="pb-8 pt-2 sm:pb-12 lg:pb-14">
        <div className="grid gap-4 lg:grid-cols-3">
          {storyCards.map((card, index) => (
            <Reveal key={card.title} delay={0.05 * index}>
              <article className="glass h-full rounded-[28px] p-6 transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(17,19,24,0.12)]">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">{card.kicker}</p>
                <h3 className="mt-4 font-display text-2xl tracking-tight">{card.title}</h3>
                <p className="mt-4 text-sm leading-7 text-text-muted">{card.body}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="grid gap-4 pb-10 pt-2 lg:grid-cols-[1.05fr_0.95fr] lg:pb-16">
        <Reveal>
          <div className="glass h-full rounded-[32px] p-3 sm:p-4">
            <div className="media-frame aspect-[16/10] overflow-hidden rounded-[26px] border-0">
              <img src="/images/posts/frc24/comp/image5.jpg" alt="Robotics competition" className="h-full w-full object-cover" />
            </div>
          </div>
        </Reveal>
        <div className="grid gap-4">
          <Reveal delay={0.04}>
            <div className="glass rounded-[28px] p-6 sm:p-7">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">Why these projects fit together</p>
              <p className="mt-4 font-display text-3xl tracking-tight text-balance">AI, robotics, research, and product point to the same taste.</p>
              <p className="mt-4 text-sm leading-7 text-text-muted">
                I like work with real constraints: things that need to move, explain, decide, or survive real users.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="glass rounded-[28px] p-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">What shows up</p>
                <p className="mt-3 text-sm leading-7 text-text-muted">Robotics, AI workflows, scientific tools, dashboards, campus products.</p>
              </div>
              <div className="glass rounded-[28px] p-5">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">What matters</p>
                <p className="mt-3 text-sm leading-7 text-text-muted">Taste, clarity, pressure, curiosity.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-8 pt-2 sm:pb-12 lg:pb-16">
        <Reveal>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">Current signal</p>
              <h2 className="mt-2 font-display text-3xl tracking-[-0.05em] sm:text-4xl">The projects that frame the story.</h2>
            </div>
          </div>
        </Reveal>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {signalCards.map((card, index) => (
            <Reveal key={card.title} delay={0.04 * index}>
              <Link href={card.href} className="glass group block rounded-[28px] p-5 transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(17,19,24,0.12)]">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">{card.eyebrow}</p>
                <h3 className="mt-4 font-display text-2xl tracking-tight group-hover:text-accent">{card.title}</h3>
                <p className="mt-3 text-sm leading-6 text-text-muted">{card.note}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="pb-8 pt-2 sm:pb-12 lg:pb-14">
        <Reveal>
          <div className="glass rounded-[32px] p-6 sm:p-8 lg:p-10">
            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">Right now</p>
                <h2 className="mt-3 font-display text-3xl tracking-[-0.05em] sm:text-4xl text-balance">A few lanes I keep coming back to.</h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-text-muted">
                  Different projects, same taste: systems that have real constraints, real users, or real-world feedback.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <Link href="/about" className="rounded-full bg-accent px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5">
                  More about me
                </Link>
                <Link href="/moodboard" className="glass rounded-full px-5 py-3 text-sm font-medium transition hover:-translate-y-0.5">
                  Moodboard
                </Link>
              </div>
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {currentBlocks.map((block, index) => (
                <div key={block.title} className="rounded-[24px] border border-border bg-bg-strong/70 p-5" style={{ animationDelay: `${index * 90}ms` }}>
                  <p className="font-display text-xl tracking-tight">{block.title}</p>
                  <p className="mt-3 text-sm leading-7 text-text-muted">{block.body}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
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

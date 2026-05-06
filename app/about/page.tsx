import { Reveal } from '@/components/reveal'

const quickFacts = [
  'Rutgers Honors College',
  'Computer science + mathematics',
  'Rutgers Economics Labs',
  'AI systems + robotics',
]

const pillars = [
  {
    title: 'Builder',
    body: 'I like making tools, interfaces, models, and systems people can actually use.',
  },
  {
    title: 'Researcher',
    body: 'A lot of my work starts with ambiguity, hard constraints, and fast learning.',
  },
  {
    title: 'Operator',
    body: 'I like pressure, iteration, demos, and projects that survive contact with reality.',
  },
]

const storyBeats = [
  'AI systems that feel useful, not theoretical.',
  'Robotics work where software has to meet the physical world.',
  'Research and data tooling that make complexity more legible.',
  'Student products with real users, real friction, and real feedback loops.',
]

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-10">
      <section className="grid items-start gap-8 py-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-12 lg:py-16">
        <Reveal>
          <div className="space-y-4">
            <div className="media-frame aspect-[4/5] max-w-md overflow-hidden rounded-[32px]">
              <img src="/images/face.jpg" alt="Akash Dubey" className="h-full w-full object-cover" />
            </div>
            <div className="glass rounded-[28px] p-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">Quick facts</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {quickFacts.map((fact) => (
                  <span key={fact} className="rounded-full border border-border bg-accent-soft px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-text-muted">
                    {fact}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">About</p>
            <h1 className="mt-3 max-w-4xl font-display text-5xl tracking-[-0.06em] sm:text-6xl">
              I like turning messy systems into things people can actually use.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-text-muted">
              I&apos;m Akash Dubey, a computer science and mathematics student at Rutgers Honors College. My work sits between research, engineering, and product — AI systems, robotics, scientific computing, and tools that need to do something real.
            </p>
            <p className="mt-5 max-w-3xl text-base leading-8 text-text-muted">
              Even when the domains change, the pattern stays the same: hard constraints, noisy inputs, and a chance to shape complexity into something sharper.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="grid gap-5 py-4 md:grid-cols-3 lg:py-8">
        {pillars.map((pillar, index) => (
          <Reveal key={pillar.title} delay={0.04 * index}>
            <div className="glass h-full rounded-[28px] p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">0{index + 1}</p>
              <h2 className="mt-3 font-display text-2xl tracking-tight">{pillar.title}</h2>
              <p className="mt-4 text-sm leading-7 text-text-muted">{pillar.body}</p>
            </div>
          </Reveal>
        ))}
      </section>

      <section className="grid gap-6 py-8 lg:grid-cols-[1.08fr_0.92fr] lg:py-10">
        <Reveal>
          <div className="glass rounded-[32px] p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">Story</p>
            <h2 className="mt-3 font-display text-3xl tracking-tight">The mix is the point.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-text-muted">
              This isn&apos;t a narrow specialist portfolio. The interesting part is the crossing between AI, robotics, product, math, and research.
            </p>
            <div className="mt-6 grid gap-3">
              {storyBeats.map((beat) => (
                <div key={beat} className="rounded-[24px] border border-border bg-bg-strong/70 px-5 py-4 text-sm leading-7 text-text-muted">
                  {beat}
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="media-frame aspect-[4/3] overflow-hidden rounded-[28px]">
              <img src="/images/posts/frc24/comp/image2.gif" alt="Robotics work" className="h-full w-full object-cover" />
            </div>
            <div className="glass rounded-[28px] p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">Short version</p>
              <p className="mt-3 font-display text-2xl tracking-tight">Builder, researcher, operator.</p>
              <p className="mt-4 text-sm leading-7 text-text-muted">
                I like projects with pressure, momentum, and enough complexity to force growth.
              </p>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  )
}

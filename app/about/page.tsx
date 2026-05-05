import { Reveal } from '@/components/reveal'

const quickFacts = [
  'Rutgers Honors College',
  'Computer science + mathematics',
  'Rutgers Economics Labs',
  'AI systems + robotics',
]

const pillars = [
  {
    title: 'How I work',
    body: 'I like hard problems with moving parts — code, systems, data, experiments, demos, and real people who need the thing to work.',
  },
  {
    title: 'What I build',
    body: 'A mix of AI systems, robotics, scientific tools, data products, and student-facing software that feels fast, useful, and well-designed.',
  },
  {
    title: 'What drives me',
    body: 'Curiosity, competition, and the fun of turning messy ideas into clean systems people can actually use.',
  },
]

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-10">
      <section className="grid items-start gap-8 py-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-12 lg:py-16">
        <Reveal>
          <div className="space-y-4">
            <div className="media-frame aspect-[4/5] max-w-md overflow-hidden rounded-[32px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
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
              I like building things that make complex systems feel clear, usable, and alive.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-text-muted">
              I&apos;m Akash Dubey, a computer science and mathematics student at Rutgers Honors College. My work sits between research and product — AI systems, robotics, scientific computing, data-heavy tools, and projects that do something real outside a notebook.
            </p>
            <p className="mt-5 max-w-3xl text-base leading-8 text-text-muted">
              That includes work through Rutgers Economics Labs and other research groups across campus, where I keep getting pulled toward the same kind of problem: messy inputs, hard constraints, and a chance to turn them into a sharper system.
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

      <section className="grid gap-6 py-8 pb-20 lg:grid-cols-[1.1fr_0.9fr]">
        <Reveal>
          <div className="glass rounded-[32px] p-8">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">Interests</p>
            <h2 className="mt-3 font-display text-3xl tracking-tight">The mix is the point.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-text-muted">
              I&apos;m not trying to stay in one narrow lane. A lot of the fun is in crossing between AI, robotics, math, comp bio, interfaces, and product thinking until something clicks.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[24px] border border-border bg-bg-strong/70 p-5">
                <h3 className="font-display text-xl tracking-tight">Technical</h3>
                <p className="mt-2 text-sm leading-7 text-text-muted">Agentic AI, motion planning, scientific computing, data systems, computational biology, research tooling.</p>
              </div>
              <div className="rounded-[24px] border border-border bg-bg-strong/70 p-5">
                <h3 className="font-display text-xl tracking-tight">Outside the code</h3>
                <p className="mt-2 text-sm leading-7 text-text-muted">Soccer, cricket, F1, performance culture, ambitious teams, and the energy around building things with other people.</p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="media-frame aspect-[4/3] overflow-hidden rounded-[28px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/posts/frc24/comp/image2.gif" alt="Robotics work" className="h-full w-full object-cover" />
            </div>
            <div className="glass rounded-[28px] p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">Short version</p>
              <p className="mt-3 font-display text-2xl tracking-tight">Builder, researcher, operator.</p>
              <p className="mt-4 text-sm leading-7 text-text-muted">
                I like projects with pressure, momentum, and enough complexity that they force you to level up.
              </p>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  )
}

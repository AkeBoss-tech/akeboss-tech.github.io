const editorialFrames = [
  {
    title: 'Systems + motion',
    image: '/images/posts/frc24/comp/image3.jpg',
    note: 'Robotics visuals that feel fast, intentional, and real.',
  },
  {
    title: 'Maps + layers',
    image: '/images/portfolio/nostradamus/data-layers.png',
    note: 'Spatial interfaces, stacked context, and data you can actually read.',
  },
  {
    title: 'Research as product',
    image: '/images/portfolio/hic-tad/hero.png',
    note: 'Technical work presented with enough clarity to invite curiosity.',
  },
  {
    title: 'Student product energy',
    image: '/images/portfolio/scarlet-sync/home.png',
    note: 'Useful interfaces for real people with busy, messy workflows.',
  },
]

const boards = [
  {
    title: 'Technical inspiration',
    tone: 'interfaces, demos, motion, systems, dense information made legible',
    items: [
      { name: 'animejs', note: 'tasteful motion and interaction timing', href: 'https://animejs.com/' },
      { name: 'Rauno / Vercel-style interfaces', note: 'clarity, polish, systems thinking, clean interaction', href: 'https://rauno.me/' },
      { name: 'Robotics + autonomy demos', note: 'things that feel real, dynamic, and technically alive', href: 'https://www.youtube.com/watch?v=ECMPgEQ7-gQ' },
      { name: 'Palantir-at-home experiments', note: 'maps, systems, spatial thinking, data-as-interface', href: 'https://www.youtube.com/watch?v=ekEDCKihdVk' },
    ],
  },
  {
    title: 'Non-technical inspiration',
    tone: 'competition, editorial rhythm, campus energy, and founder momentum',
    items: [
      { name: 'Sports + performance', note: 'soccer, cricket, F1, competition, repetition, pressure, execution', href: 'https://www.formula1.com/' },
      { name: 'Editorial visuals', note: 'clean magazines, research posters, visual hierarchy, restrained drama', href: 'https://www.nytimes.com/' },
      { name: 'Campus + place', note: 'Rutgers, movement, local energy, student-builder atmosphere', href: 'https://www.youtube.com/watch?v=FCfH46k3kio' },
      { name: 'Founder/operator energy', note: 'products, outreach, teams, momentum, real-world usefulness', href: 'https://www.ycombinator.com/' },
    ],
  },
]

export default function MoodboardPage() {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-10">
      <section className="py-10 lg:py-16">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">Mood board</p>
        <h1 className="mt-3 max-w-4xl font-display text-5xl tracking-[-0.05em]">Things that shape how I build.</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-text-muted">
          Not just projects. This is the mix of interfaces, systems, visuals, competition, media, and ideas that influences what I make — and what I think is worth making.
        </p>
      </section>

      <section className="grid gap-5 pb-10 md:grid-cols-2 xl:grid-cols-4">
        {editorialFrames.map((frame) => (
          <div key={frame.title} className="glass group overflow-hidden rounded-[28px] p-3">
            <div className="media-frame aspect-[4/5] rounded-[22px] border-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={frame.image} alt={frame.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
            </div>
            <div className="px-2 pb-2 pt-4">
              <h2 className="font-display text-xl tracking-tight">{frame.title}</h2>
              <p className="mt-2 text-sm leading-7 text-text-muted">{frame.note}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-8 pb-20 lg:grid-cols-[.9fr_1.1fr]">
        <div className="glass rounded-[32px] p-8">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">Personal direction</p>
          <h2 className="mt-3 font-display text-3xl tracking-tight">What the work should feel like.</h2>
          <ul className="mt-6 space-y-4 text-sm leading-7 text-text-muted">
            <li><span className="text-text">Alive</span> — motion, density, and technical energy without chaos.</li>
            <li><span className="text-text">Grounded</span> — proof of real systems, real experiments, real users, real stakes.</li>
            <li><span className="text-text">Curated</span> — fewer louder moments, stronger hierarchy, cleaner pacing.</li>
            <li><span className="text-text">Personal</span> — Rutgers, robotics, research, product instincts, and competitive energy all show up.</li>
          </ul>
        </div>

        <div className="grid gap-6">
          {boards.map((board) => (
            <div key={board.title} className="glass rounded-[32px] p-8">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="font-display text-3xl tracking-tight">{board.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-text-muted">{board.tone}</p>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {board.items.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-[24px] border border-border bg-bg-strong/60 p-5 transition hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-[0_18px_50px_rgba(17,19,24,0.08)]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-display text-xl tracking-tight">{item.name}</div>
                        <p className="mt-2 text-sm leading-7 text-text-muted">{item.note}</p>
                      </div>
                      <span className="text-sm text-accent">↗</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

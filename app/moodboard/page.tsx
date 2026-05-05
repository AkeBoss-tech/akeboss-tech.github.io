const boards = [
  {
    title: 'Technical inspiration',
    items: [
      { name: 'animejs', note: 'tasteful motion and interaction timing', href: 'https://animejs.com/' },
      { name: 'Vercel / Rauno-style interfaces', note: 'clarity, polish, systems thinking, clean interaction', href: 'https://rauno.me/' },
      { name: 'Robotics + autonomy demos', note: 'things that feel real, dynamic, and technically alive', href: 'https://www.youtube.com/watch?v=ECMPgEQ7-gQ' },
      { name: 'Palantir-at-home experiments', note: 'maps, systems, spatial thinking, data-as-interface', href: 'https://www.youtube.com/watch?v=ekEDCKihdVk' },
    ],
  },
  {
    title: 'Non-technical inspiration',
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
        <h1 className="mt-3 font-display text-5xl tracking-[-0.05em]">Things that shape how I build.</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-text-muted">
          Not just projects. This is the mix of interfaces, systems, visuals, competition, media, and ideas that influence what I make and what I think is worth building.
        </p>
      </section>

      <section className="grid gap-8 pb-20 lg:grid-cols-2">
        {boards.map((board) => (
          <div key={board.title} className="glass rounded-[32px] p-8">
            <h2 className="font-display text-3xl tracking-tight">{board.title}</h2>
            <div className="mt-6 space-y-4">
              {board.items.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="block rounded-[24px] border border-border bg-bg-strong/60 p-5 transition hover:-translate-y-0.5 hover:border-accent/40"
                >
                  <div className="font-display text-xl tracking-tight">{item.name}</div>
                  <p className="mt-2 text-sm leading-7 text-text-muted">{item.note}</p>
                </a>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  )
}

import Link from 'next/link'

const collageTiles = [
  {
    title: 'FRC match energy',
    type: 'video still',
    image: '/images/posts/frc24/comp/image5.jpg',
    span: 'md:col-span-2 md:row-span-2',
    tone: 'Fast, physical, noisy, real.',
  },
  {
    title: 'Autonomy loops',
    type: 'gif',
    image: '/images/posts/frc24/comp/image6.gif',
    tone: 'Motion with proof behind it.',
  },
  {
    title: 'Hi-C research',
    type: 'paper visual',
    image: '/images/portfolio/hic-tad/tad-triangles.png',
    tone: 'Technical density, cleaner framing.',
  },
  {
    title: 'Night maps',
    type: 'interface',
    image: '/images/portfolio/nostradamus/nightvision.png',
    span: 'md:row-span-2',
    tone: 'Spatial systems, layered decisions.',
  },
  {
    title: 'Student app UI',
    type: 'product',
    image: '/images/portfolio/scarlet-sync/home.png',
    tone: 'Useful, social, campus-native.',
  },
  {
    title: 'AI assistant',
    type: 'system design',
    image: '/images/portfolio/personal-assistant/hero.png',
    tone: 'Tools that feel alive instead of static.',
  },
  {
    title: 'Editorial sports rhythm',
    type: 'reference',
    image: '/images/portfolio/racing/grand.png',
    tone: 'Performance, pressure, spectacle.',
  },
  {
    title: 'Newspaper grids',
    type: 'layout',
    image: '/images/portfolio/newspaper/front_page.png',
    span: 'md:col-span-2',
    tone: 'Hierarchy, pacing, clean contrast.',
  },
  {
    title: 'Campus builder vibe',
    type: 'reference',
    image: '/images/portfolio/lykke/discover.png',
    tone: 'Youthful, ambitious, social momentum.',
  },
  {
    title: 'Code + control',
    type: 'ops',
    image: '/images/posts/frc24/bot_prog.png',
    tone: 'A little messy, a lot real.',
  },
  {
    title: 'Data stories',
    type: 'visualization',
    image: '/images/portfolio/clean-your-data/graph.png',
    tone: 'Make complexity readable.',
  },
  {
    title: 'Founder mode',
    type: 'product frame',
    image: '/images/portfolio/grokipedia-api/hero.png',
    span: 'md:col-span-2',
    tone: 'Ambitious systems with momentum.',
  },
]

const webRefs = [
  { label: 'anime.js', note: 'motion timing and elastic restraint', href: 'https://animejs.com/' },
  { label: 'rauno.me', note: 'high-taste interface composition', href: 'https://rauno.me/' },
  { label: 'Formula 1', note: 'speed, drama, contrast, pressure', href: 'https://www.formula1.com/' },
  { label: 'The New York Times', note: 'editorial layering and visual pacing', href: 'https://www.nytimes.com/' },
  { label: 'Y Combinator', note: 'operator ambition and product energy', href: 'https://www.ycombinator.com/' },
  { label: 'MIT CSAIL', note: 'research visuals that still feel current', href: 'https://www.csail.mit.edu/' },
]

export default function MoodboardPage() {
  return (
    <div className="mx-auto max-w-[96rem] px-4 sm:px-6 lg:px-10">
      <section className="py-8 sm:py-10 lg:py-14">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-text-muted">Moodboard</p>
            <h1 className="mt-3 font-display text-5xl tracking-[-0.07em] sm:text-6xl lg:text-7xl">Dense references. Less explaining.</h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-text-muted sm:text-lg">
              A collage of images, interfaces, articles, and atmosphere — more like a feed wall than a slide deck.
            </p>
          </div>
          <Link href="/projects" className="glass w-fit rounded-full px-5 py-3 text-sm font-medium">
            Back to work
          </Link>
        </div>
      </section>

      <section className="pb-20">
        <div className="moodboard-collage grid auto-rows-[170px] gap-3 sm:auto-rows-[210px] sm:gap-4 md:grid-cols-3 lg:auto-rows-[220px] xl:grid-cols-4">
          {collageTiles.map((tile, index) => (
            <article
              key={tile.title}
              className={`mood-tile group relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-950 text-white ${tile.span ?? ''}`}
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <img src={tile.image} alt={tile.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-white/72 backdrop-blur">
                  {tile.type}
                </div>
                <h2 className="mt-3 font-display text-xl tracking-tight sm:text-2xl">{tile.title}</h2>
                <p className="mt-1 text-sm leading-6 text-white/75">{tile.tone}</p>
              </div>
            </article>
          ))}

          <article className="glass md:col-span-2 rounded-[28px] p-5 sm:p-6 xl:col-span-2">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">Reference links</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {webRefs.map((ref) => (
                <a
                  key={ref.label}
                  href={ref.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-[22px] border border-border bg-bg-strong/70 p-4 transition hover:-translate-y-0.5 hover:border-accent/35"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-display text-xl tracking-tight">{ref.label}</div>
                      <p className="mt-1 text-sm leading-6 text-text-muted">{ref.note}</p>
                    </div>
                    <span className="text-sm text-accent">↗</span>
                  </div>
                </a>
              ))}
            </div>
          </article>

          <article className="glass rounded-[28px] p-5 sm:p-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">Desired feeling</p>
            <p className="mt-3 font-display text-3xl tracking-tight">Alive. Layered. Fast.</p>
            <p className="mt-3 text-sm leading-6 text-text-muted">
              More motion and juxtaposition. Less homepage exposition. Details can live one click deeper.
            </p>
          </article>
        </div>
      </section>
    </div>
  )
}

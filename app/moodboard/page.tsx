import Link from 'next/link'
import { AutoVideo } from '@/components/auto-video'

const collageTiles = [
  {
    title: 'FRC match energy',
    href: '/writing/robotics-development',
    span: 'md:col-span-2 md:row-span-2',
    media: <img src="/images/posts/frc24/comp/image5.jpg" alt="FRC match energy" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />,
  },
  {
    title: 'Autonomy loops',
    href: '/writing/robotics-development',
    media: <AutoVideo src="/images/posts/frc24/comp/image6.gif" className="h-full w-full" />,
  },
  {
    title: 'Hi-C research',
    href: '/projects/hic-tad-analysis',
    media: <img src="/images/portfolio/hic-tad/tad-triangles.png" alt="Hi-C research" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />,
  },
  {
    title: 'Night maps',
    href: '/projects/nostradamus',
    span: 'md:row-span-2',
    media: <img src="/images/portfolio/nostradamus/nightvision.png" alt="Night maps" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />,
  },
  {
    title: 'Scarlet Sync live',
    href: 'https://www.youtube.com/@scarletsyncapp',
    media: (
      <iframe
        src="https://www.youtube-nocookie.com/embed/D4D3lKWCRjM?controls=0&modestbranding=1&rel=0"
        title="Scarlet Sync video"
        className="h-full w-full"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    ),
  },
  {
    title: 'AI assistant',
    href: '/projects/personal-assistant',
    media: <img src="/images/portfolio/personal-assistant/hero.png" alt="AI assistant" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />,
  },
  {
    title: 'Editorial sports rhythm',
    href: '/projects/kenny-racing',
    media: <img src="/images/portfolio/racing/grand.png" alt="Editorial sports rhythm" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />,
  },
  {
    title: 'Newspaper grids',
    href: '/projects/newspaper-website',
    span: 'md:col-span-2',
    media: <img src="/images/portfolio/newspaper/front_page.png" alt="Newspaper grids" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />,
  },
  {
    title: 'Campus builder vibe',
    href: '/projects/lykke',
    media: <img src="/images/portfolio/lykke/discover.png" alt="Campus builder vibe" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />,
  },
  {
    title: 'Code + control',
    href: '/writing/robotics-development',
    media: <img src="/images/posts/frc24/bot_prog.png" alt="Code and control" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />,
  },
  {
    title: 'Data stories',
    href: '/projects/clean-your-data',
    media: <img src="/images/portfolio/clean-your-data/graph.png" alt="Data stories" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />,
  },
  {
    title: 'Founder mode',
    href: '/projects/grokipedia-api',
    span: 'md:col-span-2',
    media: <img src="/images/portfolio/grokipedia-api/hero.png" alt="Founder mode" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" />,
  },
  {
    title: 'Robot sprint',
    href: '/writing/robotics-development',
    media: <AutoVideo src="/images/posts/frc24/comp/image7.gif" className="h-full w-full" />,
  },
  {
    title: 'Akash intro',
    href: 'https://youtu.be/BIjPviSJ0Yc',
    span: 'md:col-span-2',
    media: (
      <iframe
        src="https://www.youtube-nocookie.com/embed/BIjPviSJ0Yc?controls=0&modestbranding=1&rel=0"
        title="Akash intro"
        className="h-full w-full"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    ),
  },
  {
    title: 'Robot close-up',
    href: '/writing/robotics-journal',
    media: <AutoVideo src="/images/posts/robotics/image10.gif" className="h-full w-full" />,
  },
  {
    title: 'Palantir-at-home systems',
    href: 'https://youtu.be/ekEDCKihdVk',
    media: (
      <iframe
        src="https://www.youtube-nocookie.com/embed/ekEDCKihdVk?controls=0&modestbranding=1&rel=0"
        title="Palantir at home systems"
        className="h-full w-full"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    ),
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
        <div className="moodboard-collage grid auto-rows-[150px] gap-3 sm:auto-rows-[190px] sm:gap-4 md:grid-cols-3 lg:auto-rows-[210px] xl:grid-cols-4">
          {collageTiles.map((tile, index) => {
            const isExternal = tile.href.startsWith('http')
            return (
              <article
                key={tile.title}
                className={`mood-tile group relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-950 text-white ${tile.span ?? ''}`}
                style={{ animationDelay: `${index * 60}ms` }}
              >
                {isExternal ? (
                  <a href={tile.href} target="_blank" rel="noreferrer" className="block h-full w-full" aria-label={tile.title}>
                    <div className="absolute inset-0">{tile.media}</div>
                    <div className="moodboard-hover absolute inset-0" />
                  </a>
                ) : (
                  <Link href={tile.href} className="block h-full w-full" aria-label={tile.title}>
                    <div className="absolute inset-0">{tile.media}</div>
                    <div className="moodboard-hover absolute inset-0" />
                  </Link>
                )}
              </article>
            )
          })}

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

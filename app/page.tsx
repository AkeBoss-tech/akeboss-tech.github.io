import Link from 'next/link'
import { getProjects } from '@/lib/content'
import { Reveal } from '@/components/reveal'
import { AutoVideo } from '@/components/auto-video'

const floatingFacts = [
  'AI systems',
  'robotics',
  'research',
  'products',
  'motion',
  'interfaces',
]

const visualMoments = [
  {
    title: 'Robotics in motion',
    caption: 'Competition footage, control loops, and the feeling of systems actually working.',
    media: (
      <AutoVideo
        src="/images/posts/frc24/comp/image10.gif"
        poster="/images/posts/frc24/comp/image3.jpg"
        className="h-full w-full object-cover"
      />
    ),
    className: 'md:col-span-2 md:row-span-2',
  },
  {
    title: 'Research, made legible',
    caption: 'Dense technical work translated into something readable and visual.',
    media: <img src="/images/portfolio/hic-tad/hero.png" alt="Research visualization" className="h-full w-full object-cover" />,
  },
  {
    title: 'Maps + systems',
    caption: 'Spatial thinking, layered interfaces, and decision surfaces.',
    media: <img src="/images/portfolio/nostradamus/nightvision.png" alt="Spatial interface" className="h-full w-full object-cover" />,
  },
  {
    title: 'Student product energy',
    caption: 'Useful tools with personality, speed, and real users behind them.',
    media: <img src="/images/portfolio/scarlet-sync/home.png" alt="Student product interface" className="h-full w-full object-cover" />,
  },
  {
    title: 'Face behind the work',
    caption: 'Akash Dubey — builder, researcher, operator.',
    media: <img src="/images/face.jpg" alt="Akash Dubey" className="h-full w-full object-cover object-center" />,
    className: 'md:col-span-2',
  },
]

const selectedSlugs = ['hic-tad-analysis', 'personal-assistant', 'grokipedia-api']

export default function HomePage() {
  const projects = getProjects()
  const featured = projects
    .filter((project) => project.featured)
    .concat(projects.filter((project) => !project.featured && selectedSlugs.includes(project.slug)))
    .slice(0, 4)

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
      <section className="relative min-h-[88svh] overflow-hidden py-6 sm:py-10 lg:flex lg:items-center lg:py-14">
        <div className="hero-orb hero-orb-a" />
        <div className="hero-orb hero-orb-b" />
        <div className="hero-lines" />

        <div className="grid w-full items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-10">
          <Reveal>
            <div className="relative z-10 max-w-xl">
              <div className="mb-5 inline-flex rounded-full border border-border bg-bg-elevated/80 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.22em] text-text-muted backdrop-blur">
                Akash Dubey
              </div>
              <h1 className="font-display text-[clamp(4rem,12vw,8.8rem)] leading-[0.86] tracking-[-0.09em]">
                Akash.
              </h1>
              <p className="mt-4 max-w-md text-lg leading-7 text-text-muted sm:text-xl">
                Computer science, math, robotics, and AI — shaped into sharp, visual systems.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/projects" className="rounded-full bg-accent px-5 py-3 text-sm font-medium text-white transition hover:-translate-y-0.5">
                  Projects
                </Link>
                <Link href="/moodboard" className="glass rounded-full px-5 py-3 text-sm font-medium">
                  Moodboard
                </Link>
              </div>
              <div className="mt-8 flex flex-wrap gap-2">
                {floatingFacts.map((item, index) => (
                  <span key={item} className="glass rounded-full px-3 py-2 text-[11px] uppercase tracking-[0.18em] text-text-muted" style={{ animationDelay: `${index * 120}ms` }}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="relative">
              <div className="hero-stack grid auto-rows-[170px] gap-3 sm:auto-rows-[210px] sm:gap-4 md:grid-cols-2 md:auto-rows-[180px] lg:auto-rows-[190px]">
                {visualMoments.map((moment, index) => (
                  <div
                    key={moment.title}
                    className={`mood-tile group relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-950 text-white ${moment.className ?? ''}`}
                    style={{ animationDelay: `${index * 90}ms` }}
                  >
                    <div className="absolute inset-0">{moment.media}</div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/18 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                      <p className="font-display text-xl tracking-tight sm:text-2xl">{moment.title}</p>
                      <p className="mt-1 max-w-sm text-sm leading-6 text-white/78">{moment.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-8 pt-2 sm:pb-12 lg:pb-16">
        <Reveal>
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">Selected work</p>
              <h2 className="mt-2 font-display text-3xl tracking-[-0.05em] sm:text-4xl">Scroll into the details.</h2>
            </div>
            <Link href="/projects" className="text-sm text-accent">
              All projects →
            </Link>
          </div>
        </Reveal>
        <div className="grid gap-4 lg:grid-cols-4">
          {featured.map((project, index) => (
            <Reveal key={project.slug} delay={0.04 * index} className={index === 0 ? 'lg:col-span-2' : ''}>
              <Link
                href={`/projects#${project.slug}`}
                className="glass group block h-full rounded-[28px] p-3 transition hover:-translate-y-1"
              >
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

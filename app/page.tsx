import Link from 'next/link'
import { getProjects } from '@/lib/content'
import { Reveal } from '@/components/reveal'
import { DynamicProjectVisual } from '@/components/visuals'
import { MeshHero } from '@/components/hero-variants'
import { GhostWindow } from '@/components/ghost-window'
import { FinalReveal } from '@/components/reveal-animation'

export default function HomePage() {
  const projects = getProjects()
  const standout = projects.filter(p => p.featured).slice(0, 4)

  const currentRoles = [
    {
      role: 'President',
      entity: 'Rutgers Economics Labs',
      slug: 'economics-labs',
      title: 'Leading Economic Data Research',
      desc: 'Architecting research-first data infrastructure and visual modeling tools.',
      image: '/images/portfolio/asa-data/Capture.PNG'
    },
    {
      role: 'Founder',
      entity: 'Scarlet Sync',
      slug: 'scarlet-sync',
      title: 'Unified Academic Workflows',
      desc: 'Connecting fragmented course data into an intelligent planning system.',
      image: '/images/portfolio/scarlet-sync/home.png'
    },
    {
      role: 'Researcher',
      entity: 'Rutgers ARC Lab',
      slug: 'path-finder',
      title: 'High-Fidelity Path Planning',
      desc: 'Optimizing robotic search and navigation under hardware constraints.',
      image: '/images/portfolio/robot-code.png'
    },
    {
      role: 'Researcher',
      entity: 'Kwan Lab',
      slug: 'kwan-lab',
      title: 'Computational Biology Modeling',
      desc: 'Decoding biological complexity through graph-based molecular analysis.',
      image: '/images/portfolio/hic-tad/polymer-3d.png'
    },
    {
      role: 'Software Engineer',
      entity: 'Lykke',
      slug: 'lykke',
      title: 'AI Education Infrastructure',
      desc: 'Transforming course materials into persistent, queryable knowledge graphs.',
      image: '/images/portfolio/lykke/hero.png'
    },
  ]

  return (
    <div className="relative overflow-x-hidden bg-white dark:bg-[#0a0c10]">
      {/* 1. Personal Hero - Central Portrait */}
      <section className="relative min-h-[92svh] flex flex-col justify-center py-24 section-slant overflow-hidden">
        <MeshHero />
        <div className="container-wide relative z-10 grid gap-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <Reveal>
            <h1 className="text-[clamp(4.5rem,11vw,10rem)] leading-[0.88] tracking-tightest text-balance mb-12">
              Hi, I&apos;m
              <br />
              Akash Dubey.
            </h1>
            <p className="text-2xl sm:text-4xl text-text-muted leading-tight max-w-2xl opacity-90 mb-16 font-display">
              Building systems at the intersection of 
              <br className="hidden sm:block" />
              Math and Computer Science.
            </p>
            
            <div className="flex items-center gap-10">
              <Link href="/projects" className="rounded-full bg-[#635bff] px-14 py-7 text-xl font-bold text-white transition hover:bg-[#7a73ff] hover:shadow-[0_25px_50px_-12px_rgba(99,91,255,0.4)] active:scale-95 shadow-2xl">
                The Work
              </Link>
              <div className="flex items-center gap-8">
                <a href="https://github.com/AkeBoss-tech" target="_blank" rel="noreferrer" className="text-text-muted hover:text-[#635bff] transition-all transform hover:scale-110">
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
                <a href="https://linkedin.com/in/akash---dubey/" target="_blank" rel="noreferrer" className="text-text-muted hover:text-[#0077b5] transition-all transform hover:scale-110">
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative group perspective-1000">
              <div className="absolute inset-0 bg-[#635bff]/30 blur-[100px] rounded-full group-hover:bg-[#00d4ff]/30 transition-colors duration-1000" />
              <GhostWindow title="Akash Dubey" className="rotate-3 group-hover:rotate-0 transition-all duration-700 shadow-3xl">
                <img src="/images/face.jpg" alt="Akash Dubey" className="w-full aspect-[4/5] object-cover scale-105 group-hover:scale-100 transition-transform duration-700" />
              </GhostWindow>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2. Scroll Narrative - The High-Stakes Timeline */}
      <section className="py-32 lg:py-64 bg-[#f6f9fc] dark:bg-[#0a0c10] border-t border-border/40">
        <div className="container-wide">
          <Reveal>
            <div className="mb-48 max-w-5xl">
              <p className="font-mono text-sm uppercase tracking-[0.4em] text-[#635bff] font-black mb-10">Current Chapters</p>
              <h2 className="text-7xl sm:text-[10rem] leading-[0.85] tracking-tightest mb-12 font-bold">What I am 
              <br />building right now.</h2>
            </div>
          </Reveal>

          <div className="space-y-64 lg:space-y-[40rem]">
            {currentRoles.map((item, i) => (
              <Reveal key={item.slug}>
                <div className={`grid gap-32 lg:grid-cols-2 lg:items-center ${i % 2 === 1 ? 'lg:direction-rtl' : ''}`}>
                  <div className={i % 2 === 1 ? 'lg:order-last text-right' : ''}>
                    <p className="font-mono text-sm uppercase tracking-widest text-[#635bff] font-black mb-8">{item.role} @ {item.entity}</p>
                    <h3 className="text-6xl sm:text-9xl leading-[0.88] tracking-tightest mb-12 text-balance font-bold">{item.title}</h3>
                    <p className="text-2xl sm:text-4xl text-text-muted leading-relaxed max-w-2xl opacity-90 font-light">
                      {item.desc}
                    </p>
                    <Link href={`/projects/${item.slug}`} className="mt-16 inline-flex items-center gap-4 text-[#635bff] font-bold text-2xl hover:translate-x-4 transition-transform group">
                      Dive deeper <span className="text-3xl transition-transform group-hover:translate-x-2">→</span>
                    </Link>
                  </div>
                  <div className="relative group">
                    <GhostWindow title={item.entity} className={i % 2 === 1 ? '-rotate-2 hover:rotate-0' : 'rotate-2 hover:rotate-0'}>
                      <div className="relative aspect-square overflow-hidden bg-bg-strong">
                        <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                           <DynamicProjectVisual slug={item.slug} />
                        </div>
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-100 group-hover:opacity-10 transition-all duration-700 blur-0 group-hover:blur-sm" />
                      </div>
                    </GhostWindow>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Archive Experience */}
      <section className="py-48 lg:py-80 bg-white dark:bg-[#05070a] section-slant-reverse">
        <div className="container-wide">
          <Reveal>
            <div className="mb-32 flex items-end justify-between border-b border-border/40 pb-20">
              <h2 className="text-6xl sm:text-[11rem] tracking-tightest leading-none font-bold">The Archive.</h2>
              <Link href="/projects" className="text-[#635bff] text-2xl font-bold pb-3 border-b-4 border-[#635bff]/20 hover:border-[#635bff] transition-all hidden lg:block">View Full Portfolio</Link>
            </div>
          </Reveal>

          <div className="grid gap-16 md:grid-cols-2">
            {standout.map((project, i) => (
              <Reveal key={project.slug} delay={i * 0.1}>
                <Link href={`/projects/${project.slug}`} className="group block p-16 rounded-[64px] bg-[#f6f9fc] dark:bg-[#0a0c10] border border-border/40 transition hover:-translate-y-6 hover:shadow-4xl">
                   <div className="flex justify-between items-start mb-16">
                      <span className="font-mono text-sm uppercase tracking-widest text-[#635bff] px-6 py-3 bg-white dark:bg-[#111827] rounded-full border border-border/40 shadow-lg font-bold">{project.tags[0]}</span>
                      <svg className="w-12 h-12 text-text-muted group-hover:text-[#635bff] transition-colors" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                   </div>
                   <h3 className="text-5xl sm:text-7xl tracking-tightest leading-tight mb-10 group-hover:text-[#635bff] transition-colors font-bold">{project.title}</h3>
                   <p className="text-2xl text-text-muted leading-relaxed line-clamp-2 font-light opacity-90">{project.excerpt}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Grand Finale Footer */}
      <section className="bg-[#635bff] py-64 lg:py-[32rem] text-white overflow-hidden relative">
        <div className="container-wide relative z-20 text-center">
          <FinalReveal />
          <Reveal>
            <h2 className="text-7xl sm:text-[15rem] tracking-tightest leading-[0.75] mb-32 font-black mt-[-4rem]">Let&apos;s build.</h2>
            <div className="flex flex-wrap justify-center gap-16">
               <a href="mailto:akash.dubey@rutgers.edu" className="bg-white text-[#635bff] px-20 py-10 rounded-full font-black text-3xl transition hover:bg-[#f6f9fc] hover:shadow-4xl active:scale-95">
                 Get in touch
               </a>
               <Link href="/about" className="px-20 py-10 rounded-full border-4 border-white/40 font-black text-3xl transition hover:bg-white/10 active:scale-95">
                 The Story
               </Link>
            </div>
          </Reveal>
        </div>
        
        {/* Immersive Footer Background */}
        <div className="absolute inset-0 opacity-20 scale-150">
           <MeshHero />
        </div>
      </section>
    </div>
  )
}

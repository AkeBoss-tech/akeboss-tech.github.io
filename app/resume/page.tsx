import { Reveal } from '@/components/reveal'

export default function ResumePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
      <section className="relative overflow-hidden py-8 sm:py-10 lg:py-16">
        <div className="hero-orb hero-orb-a" />
        <div className="hero-lines" />
        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-end">
          <Reveal>
            <div className="relative z-10">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">Resume</p>
              <h1 className="mt-3 font-display text-5xl tracking-[-0.06em] sm:text-6xl">One-page view.</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-text-muted sm:text-lg">
                Experience, projects, research, and the cleaner PDF version if you want the formal one.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a href="/files/resume.pdf" target="_blank" rel="noreferrer" className="rounded-full bg-accent px-5 py-3 text-sm font-medium text-white">
                  Open PDF
                </a>
                <a href="/files/resume.pdf" download className="glass rounded-full px-5 py-3 text-sm font-medium">
                  Download
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="glass rounded-[24px] p-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">Focus</p>
                <p className="mt-3 text-sm leading-7 text-text-muted">AI systems, robotics, research, product.</p>
              </div>
              <div className="glass rounded-[24px] p-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">Base</p>
                <p className="mt-3 text-sm leading-7 text-text-muted">Rutgers Honors College · CS + Math.</p>
              </div>
              <div className="glass rounded-[24px] p-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">Style</p>
                <p className="mt-3 text-sm leading-7 text-text-muted">Builder, researcher, operator.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="pb-20">
        <Reveal>
          <div className="glass overflow-hidden rounded-[32px] p-3 sm:p-4">
            <div className="media-frame overflow-hidden rounded-[26px] border border-border bg-white">
              <iframe
                src="/files/resume.pdf#view=FitH"
                title="Akash Dubey Resume PDF"
                className="h-[68vh] min-h-[560px] w-full bg-white md:h-[78vh]"
              />
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  )
}

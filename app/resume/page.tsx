import { Reveal } from '@/components/reveal'

export default function ResumePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
      <section className="relative overflow-hidden py-8 sm:py-10 lg:py-14">
        <div className="hero-orb hero-orb-a" />
        <div className="hero-lines" />
        <Reveal>
          <div className="relative z-10 max-w-3xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">Resume</p>
            <h1 className="mt-3 font-display text-5xl tracking-[-0.06em] sm:text-6xl">The clean one-page version.</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-text-muted sm:text-lg">
              If you just want the formal version, it’s right here in-page — plus the PDF if you want to open or download it directly.
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
      </section>

      <section className="pb-20">
        <Reveal>
          <div className="glass overflow-hidden rounded-[32px] p-3 sm:p-4">
            <div className="media-frame overflow-hidden rounded-[26px] border border-border bg-white">
              <iframe
                src="/files/resume.pdf#view=FitH"
                title="Akash Dubey Resume PDF"
                className="h-[74vh] min-h-[620px] w-full bg-white md:h-[82vh]"
              />
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  )
}

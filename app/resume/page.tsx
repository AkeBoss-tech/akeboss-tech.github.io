export default function ResumePage() {
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-10">
      <section className="py-10 lg:py-16">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">Resume</p>
        <div className="mt-3 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-display text-5xl tracking-[-0.05em]">Resume</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-text-muted">
              View the PDF directly here or download it.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <a href="/files/resume.pdf" target="_blank" rel="noreferrer" className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-white">
              Open PDF
            </a>
            <a href="/files/resume.pdf" download className="glass rounded-full px-6 py-3 text-sm font-medium">
              Download
            </a>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="media-frame overflow-hidden rounded-[32px] border border-border bg-bg-strong shadow-[var(--shadow-soft)]">
          <iframe
            src="/files/resume.pdf#view=FitH"
            title="Akash Dubey Resume PDF"
            className="h-[78vh] min-h-[900px] w-full bg-white"
          />
        </div>
      </section>
    </div>
  )
}

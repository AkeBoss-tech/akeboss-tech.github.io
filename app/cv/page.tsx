export default function CVPage() {
  return (
    <div className="container-wide py-10 sm:py-14">
      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="max-w-3xl">
          <p className="eyebrow">CV</p>
          <h1 className="mt-4 text-5xl text-text sm:text-7xl">The longer record.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-text-muted">
            A fuller archive of research, projects, papers, leadership, and technical work. More complete than the resume, but still intentionally framed.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="/files/Profile%20(5).pdf" target="_blank" rel="noreferrer" className="rounded-full border border-white/12 bg-white/[0.04] px-5 py-3 text-sm text-text-muted hover:border-white/25 hover:text-text">
              Open PDF
            </a>
            <a href="/files/Profile%20(5).pdf" download className="rounded-full border border-white/12 bg-white/[0.04] px-5 py-3 text-sm text-text-muted hover:border-white/25 hover:text-text">
              Download PDF
            </a>
          </div>
        </div>

        <div className="panel rounded-[30px] p-6">
          <p className="eyebrow">What lives here</p>
          <div className="mt-4 grid gap-3 text-sm leading-7 text-text-muted">
            <p>Education, research, talks, papers, leadership, older accomplishments, and the technical work that does not fit into a one-page resume.</p>
            <p>Use the resume for quick screening. Use this page when you want the full arc.</p>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="panel overflow-hidden rounded-[32px] p-3 sm:p-4">
          <iframe
            src="/files/Profile%20(5).pdf#view=FitH"
            title="Akash Dubey CV"
            className="h-[78vh] min-h-[620px] w-full rounded-[24px] bg-white"
          />
        </div>
      </section>
    </div>
  )
}

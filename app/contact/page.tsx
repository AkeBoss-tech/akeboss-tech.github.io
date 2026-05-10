export default function ContactPage() {
  return (
    <div className="container-wide py-10 sm:py-14">
      <section className="max-w-4xl">
        <p className="eyebrow">Contact</p>
        <h1 className="mt-4 text-5xl text-text sm:text-7xl">Open line.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-text-muted">
          For internships, research, product work, collaborations, or just a thoughtful note.
        </p>
      </section>

      <section className="mt-10 grid gap-5 md:grid-cols-3">
        <a href="mailto:akash.dubey@rutgers.edu" className="panel rounded-[28px] p-6">
          <p className="eyebrow">Email</p>
          <p className="mt-4 text-2xl text-text">akash.dubey@rutgers.edu</p>
          <p className="mt-3 text-sm leading-7 text-text-muted">Best for direct outreach, opportunities, and longer conversations.</p>
        </a>
        <a href="https://github.com/AkeBoss-tech" target="_blank" rel="noreferrer" className="panel rounded-[28px] p-6">
          <p className="eyebrow">GitHub</p>
          <p className="mt-4 text-2xl text-text">AkeBoss-tech</p>
          <p className="mt-3 text-sm leading-7 text-text-muted">Code, experiments, repositories, and public project history.</p>
        </a>
        <a href="https://www.linkedin.com/in/akash---dubey/" target="_blank" rel="noreferrer" className="panel rounded-[28px] p-6">
          <p className="eyebrow">LinkedIn</p>
          <p className="mt-4 text-2xl text-text">Professional profile</p>
          <p className="mt-3 text-sm leading-7 text-text-muted">The clean professional snapshot if you prefer that entry point.</p>
        </a>
      </section>
    </div>
  )
}

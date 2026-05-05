export default function ResumePage() {
  return (
    <div className="mx-auto max-w-6xl px-6 lg:px-10">
      <section className="py-10 lg:py-16">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">Resume</p>
        <h1 className="mt-3 font-display text-5xl tracking-[-0.05em]">Experience, research, and projects.</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-text-muted">A concise online resume plus the downloadable PDF from the previous site.</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <a href="/files/resume.pdf" className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-white">Download PDF</a>
          <a href="https://www.linkedin.com/in/akash-dubey-your-boss" className="glass rounded-full px-6 py-3 text-sm font-medium">LinkedIn</a>
        </div>
      </section>
      <section className="grid gap-6 pb-20 md:grid-cols-2">
        <div className="glass rounded-[28px] p-7"><h2 className="font-display text-2xl tracking-tight">Education</h2><ul className="mt-5 space-y-4 text-sm leading-7 text-text-muted"><li><span className="text-text">Rutgers University Honors College</span><br/>B.S. in Computer Science and Mathematics, GPA 4.0</li><li><span className="text-text">Academy for Information Technology</span><br/>Union County Vocational-Technical Schools</li></ul></div>
        <div className="glass rounded-[28px] p-7"><h2 className="font-display text-2xl tracking-tight">Current roles</h2><ul className="mt-5 space-y-4 text-sm leading-7 text-text-muted"><li><span className="text-text">Rutgers Economics Labs</span> — research + leadership</li><li><span className="text-text">Rutgers CS / ARC Lab / Kwan Lab</span> — AI, robotics, computational biology research</li><li><span className="text-text">Scarlet Sync / Lykke</span> — product and systems work</li></ul></div>
      </section>
    </div>
  )
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 lg:px-10">
      <section className="grid gap-8 py-10 lg:grid-cols-[.8fr_1.2fr] lg:py-16">
        <div className="media-frame aspect-[4/5] max-w-sm">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/images/face.jpg" alt="Akash Dubey" /></div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">About</p>
          <h1 className="mt-3 font-display text-5xl tracking-[-0.05em]">A builder who likes hard, useful problems.</h1>
          <div className="prose mt-6">
            <p>I'm Akash Dubey, a computer science and mathematics student at the Rutgers University Honors College. I like working at the intersection of AI systems, robotics, scientific computing, and products people actually use.</p>
            <p>A lot of my work starts the same way: I find a system that feels clunky, underpowered, or unexplored, and I try to rebuild it into something sharper. Sometimes that becomes a student product. Sometimes it becomes a research tool. Sometimes it turns into a strange but fun technical deep-dive.</p>
            <p>Outside the code, I'm also drawn to competition and performance systems — robotics, soccer, cricket, F1, and the ecosystems around building ambitious things with other people.</p>
          </div>
        </div>
      </section>
    </div>
  )
}

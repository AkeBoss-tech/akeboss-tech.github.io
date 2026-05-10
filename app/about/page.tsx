import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="container-wide py-10 sm:py-14">
      <section className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div className="panel-soft overflow-hidden rounded-[32px]">
          <img src="/images/face.jpg" alt="Akash Dubey" className="h-full w-full object-cover" />
        </div>

        <div>
          <p className="eyebrow">About</p>
          <h1 className="mt-4 text-5xl text-text sm:text-7xl">Builder, researcher, operator.</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-text-muted">
            I like turning messy systems into things people can actually use. Even when the domains change, the pattern stays the same: hard constraints, noisy inputs, and a chance to shape complexity into something sharper.
          </p>
          <p className="mt-5 max-w-3xl text-base leading-8 text-text-muted">
            I study Computer Science and Mathematics at Rutgers, and most of my work sits somewhere between engineering, research, and product.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/story" className="rounded-full border border-white/12 bg-white/[0.04] px-5 py-3 text-sm text-text-muted hover:border-white/25 hover:text-text">
              Read the timeline
            </Link>
            <Link href="/projects" className="rounded-full border border-white/12 bg-white/[0.04] px-5 py-3 text-sm text-text-muted hover:border-white/25 hover:text-text">
              Browse projects
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

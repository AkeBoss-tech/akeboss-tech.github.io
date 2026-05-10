import Link from 'next/link'

const nav = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/writing', label: 'Writing' },
  { href: '/resume', label: 'Resume' },
  { href: '/cv', label: 'CV' },
  { href: '/contact', label: 'Contact' },
]

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-bg text-text">
      <div className="pointer-events-none fixed inset-x-0 top-0 z-0 h-80 bg-[radial-gradient(circle_at_top,rgba(132,169,255,0.12),transparent_54%)]" />
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/6 bg-[rgba(7,9,13,0.72)] backdrop-blur-xl">
        <div className="container-wide">
          <div className="flex items-center justify-between gap-4 py-4">
            <Link href="/" className="story-link text-base font-semibold tracking-[-0.04em] text-text sm:text-lg">
              Akash Dubey
            </Link>
            <nav className="hidden items-center gap-6 text-sm text-text-muted md:flex">
              {nav.map((item) => (
                <Link key={item.href} href={item.href} className="story-link">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <nav className="project-strip flex gap-2 overflow-x-auto pb-3 text-xs text-text-muted md:hidden">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="shrink-0 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main className="relative z-10 pt-28 md:pt-20">{children}</main>

      <footer className="relative z-10 mt-20 border-t border-white/6">
        <div className="container-wide py-10">
          <div className="panel rounded-[30px] px-5 py-6 sm:px-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-2xl tracking-[-0.06em] text-text">Akash Dubey</p>
                <p className="mt-2 max-w-2xl text-sm leading-7 text-text-muted">
                  A living archive of what I build, study, write, and keep chasing.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-text-muted">
                <a href="https://github.com/AkeBoss-tech" target="_blank" rel="noreferrer" className="story-link">
                  GitHub
                </a>
                <a href="https://www.linkedin.com/in/akash---dubey/" target="_blank" rel="noreferrer" className="story-link">
                  LinkedIn
                </a>
                <a href="mailto:akash.dubey@rutgers.edu" className="story-link">
                  Email
                </a>
                <Link href="/story" className="story-link">
                  Story
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

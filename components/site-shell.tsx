import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'

const nav = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/writing', label: 'Writing' },
  { href: '/about', label: 'About' },
  { href: '/resume', label: 'Resume' },
]

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg text-text">
      <div className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-bg/75 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-10">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="font-display text-lg font-semibold tracking-tight sm:text-xl">
              Akash Dubey
            </Link>
            <div className="flex items-center gap-3">
              <nav className="hidden items-center gap-6 text-sm text-text-muted md:flex">
                {nav.map((item) => (
                  <Link key={item.href} href={item.href} className="transition hover:text-text">
                    {item.label}
                  </Link>
                ))}
              </nav>
              <ThemeToggle />
            </div>
          </div>
          <nav className="mt-4 flex gap-2 overflow-x-auto pb-1 text-sm text-text-muted md:hidden">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="glass shrink-0 rounded-full px-4 py-2 transition hover:text-text">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <main className="pt-32 md:pt-24">{children}</main>
      <footer className="mx-auto mt-24 max-w-7xl px-6 pb-10 lg:px-10">
        <div className="glass flex flex-col gap-3 rounded-3xl px-6 py-5 text-sm text-text-muted md:flex-row md:items-center md:justify-between">
          <p>Built around Akash&apos;s work across AI systems, robotics, research, and product experiments.</p>
          <div className="flex gap-4">
            <a href="https://github.com/AkeBoss-tech" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://www.linkedin.com/in/akash-dubey-your-boss" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="mailto:akash.dubey@rutgers.edu">Email</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

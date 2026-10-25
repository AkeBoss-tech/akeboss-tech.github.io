'use client'

import { useEffect, useState, ViewTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import posthog from 'posthog-js'

import { ContactIconLinks } from '@/components/contact-icon-links'
import { GradientDescentBackground } from '@/components/gradient-descent-background'
import { Spotlight } from '@/components/spotlight'
import { ThemeToggle } from '@/components/theme-toggle'

const nav = [
  { href: '/projects', label: 'Projects' },
  { href: '/writing', label: 'Writing' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

// Pages that get the home hero's gradient mesh behind their header.
const heroFieldPaths = new Set(['/writing', '/about', '/contact'])

const isActive = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`)

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 28)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('home-clean-body', pathname === '/')
    setMobileNavOpen(false)
    return () => {
      document.body.classList.remove('home-clean-body')
    }
  }, [pathname])

  const captureNavigation = (destination: string, placement: 'brand' | 'desktop_nav' | 'mobile_nav' | 'footer') => {
    posthog.capture('site_navigation_selected', { destination, placement })
  }

  return (
    <div className={`relative min-h-screen text-text ${pathname === '/' ? 'home-clean-shell bg-bg' : 'bg-bg'}`}>
      <a href="#main" className="skip-link">Skip to content</a>
      {heroFieldPaths.has(pathname) ? (
        <div className="page-hero-field" aria-hidden="true">
          <GradientDescentBackground key={pathname} className="home-top-gradient" />
        </div>
      ) : null}
      <header className={`pointer-events-none fixed inset-x-0 z-50 px-3 sm:px-5 ${scrolled ? 'top-2' : 'top-4 sm:top-5'}`}>
        <div
          className={`liquid-glass mx-auto w-[min(94vw,72rem)] pointer-events-auto transition-all duration-500 ${mobileNavOpen ? 'liquid-glass-mobile-open' : ''} ${scrolled ? 'liquid-glass-scrolled' : 'liquid-glass-top'}`}
        >
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <Link href="/" onClick={() => captureNavigation('home', 'brand')} className="story-link text-base font-semibold tracking-[-0.04em] text-text sm:text-lg">
              Akash Dubey
            </Link>
            <button
              type="button"
              aria-expanded={mobileNavOpen}
              aria-controls="mobile-site-nav"
              aria-label={mobileNavOpen ? 'Close navigation menu' : 'Open navigation menu'}
              onClick={() => {
                const nextOpen = !mobileNavOpen
                setMobileNavOpen(nextOpen)
                posthog.capture('mobile_navigation_toggled', { state: nextOpen ? 'opened' : 'closed' })
              }}
              className="story-link flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-text/12 bg-text/[0.04] text-text shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-all duration-300 hover:bg-text/10 md:hidden"
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7">
                <path d={mobileNavOpen ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'} />
              </svg>
            </button>
            <nav aria-label="Main" className="hidden items-center gap-1 text-sm text-text-muted md:flex">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive(pathname, item.href) ? 'page' : undefined}
                  onClick={() => captureNavigation(item.label.toLowerCase(), 'desktop_nav')}
                  className={`rounded-full px-3.5 py-2 transition-colors duration-200 ${isActive(pathname, item.href) ? 'bg-text/10 text-text' : 'story-link hover:bg-text/6 hover:text-text'}`}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/resume"
                aria-current={isActive(pathname, '/resume') ? 'page' : undefined}
                onClick={() => captureNavigation('resume', 'desktop_nav')}
                className="nav-resume-button ml-2"
              >
                Resume
              </Link>
            </nav>
          </div>
          {mobileNavOpen ? (
            <nav id="mobile-site-nav" className="px-3 text-sm text-text-muted md:hidden sm:px-5">
              <div className="grid gap-1 border-t border-text/10 pb-3 pt-2">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive(pathname, item.href) ? 'page' : undefined}
                    onClick={() => {
                      captureNavigation(item.label.toLowerCase(), 'mobile_nav')
                      setMobileNavOpen(false)
                    }}
                    className={`rounded-2xl px-3 py-3 transition-colors duration-200 ${isActive(pathname, item.href) ? 'bg-text/10 text-text' : 'hover:bg-text/8'}`}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/resume"
                  onClick={() => {
                    captureNavigation('resume', 'mobile_nav')
                    setMobileNavOpen(false)
                  }}
                  className="nav-resume-button mt-1 justify-center"
                >
                  Resume
                </Link>
              </div>
            </nav>
          ) : null}
        </div>
      </header>

      <main id="main" className={`relative z-10 ${pathname === '/' ? 'pt-0' : 'pt-28 md:pt-24'}`}>
        <ViewTransition default="page-swap">{children}</ViewTransition>
      </main>
      <Spotlight />

      {pathname !== '/' ? (
        <footer className="relative z-10 mt-20 border-t border-text/6">
          <div className="container-wide py-10">
            <div className="panel footer-panel rounded-[34px] px-5 py-6 sm:px-6 sm:py-7">
              <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-center">
                <div className="min-w-0 self-center">
                  <div className="flex items-center gap-4">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-text/16 bg-text/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.16),0_10px_30px_rgba(0,0,0,0.18)]">
                      <Image
                        src="/icons/apple-icon.png"
                        alt="Akash Dubey icon"
                        fill
                        sizes="56px"
                        className="object-contain p-1.5"
                      />
                    </div>
                    <p className="text-3xl tracking-[-0.06em] text-text sm:text-4xl">Akash Dubey</p>
                  </div>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-text-muted sm:text-base">
                    If you want to talk about research, robotics, startups, math, or a project worth building together,
                    there are a few easy ways to reach me.
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-3">
                    <ThemeToggle />
                    <ContactIconLinks className="footer-contact-icons pb-1" />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <a
                    href="mailto:akash.dubey@rutgers.edu"
                    className="panel-soft footer-contact-card rounded-[24px] px-4 py-4 text-sm text-text-muted hover:text-text"
                  >
                    <div className="eyebrow">Email</div>
                    <div className="footer-contact-value mt-2 text-base text-text">akash.dubey@rutgers.edu</div>
                  </a>
                  <a
                    href="https://www.linkedin.com/in/akash---dubey/"
                    target="_blank"
                    rel="noreferrer"
                    className="panel-soft footer-contact-card rounded-[24px] px-4 py-4 text-sm text-text-muted hover:text-text"
                  >
                    <div className="eyebrow">LinkedIn</div>
                    <div className="footer-contact-value mt-2 text-base text-text">Professional updates ↗</div>
                  </a>
                  <a
                    href="https://github.com/AkeBoss-tech"
                    target="_blank"
                    rel="noreferrer"
                    className="panel-soft footer-contact-card rounded-[24px] px-4 py-4 text-sm text-text-muted hover:text-text"
                  >
                    <div className="eyebrow">GitHub</div>
                    <div className="footer-contact-value mt-2 text-base text-text">Code, experiments, repositories ↗</div>
                  </a>
                  <div className="panel-soft footer-contact-card rounded-[24px] px-4 py-4 text-sm text-text-muted">
                    <div className="eyebrow">Around The Site</div>
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                      <Link href="/projects" onClick={() => captureNavigation('projects', 'footer')} className="story-link text-text-muted hover:text-text">
                        Projects
                      </Link>
                      <Link href="/writing" onClick={() => captureNavigation('writing', 'footer')} className="story-link text-text-muted hover:text-text">
                        Writing
                      </Link>
                      <Link href="/sites" onClick={() => captureNavigation('sites', 'footer')} className="story-link text-text-muted hover:text-text">
                        Sites
                      </Link>
                      <Link href="/wiki" onClick={() => captureNavigation('wiki', 'footer')} className="story-link text-text-muted hover:text-text">
                        Wiki
                      </Link>
                      <Link href="/cv" onClick={() => captureNavigation('cv', 'footer')} className="story-link text-text-muted hover:text-text">
                        CV
                      </Link>
                      <Link href="/experience" onClick={() => captureNavigation('experience', 'footer')} className="story-link text-text-muted hover:text-text">
                        Timeline
                      </Link>
                      <Link href="/resume" onClick={() => captureNavigation('resume', 'footer')} className="story-link text-text-muted hover:text-text">
                        Resume
                      </Link>
                      <Link href="/contact" onClick={() => captureNavigation('contact', 'footer')} className="story-link text-text-muted hover:text-text">
                        Contact
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      ) : null}
    </div>
  )
}

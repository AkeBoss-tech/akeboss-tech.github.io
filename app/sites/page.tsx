import Link from 'next/link'

import { buildPageMetadata } from '@/lib/seo'
import { hostedSites } from '@/lib/site-data'

export const metadata = buildPageMetadata({
  title: 'Hosted Sites by Akash Dubey',
  description: 'Standalone research interfaces, interactive data stories, playable demos, and learning tools built by Akash Dubey.',
  path: '/sites',
  image: '/projects/opengraph-image',
})

export default function SitesPage() {
  return (
    <div className="container-wide py-10 sm:py-14">
      <section className="max-w-4xl">
        <p className="eyebrow">Hosted sites</p>
        <h1 className="mt-4 text-5xl text-text sm:text-7xl">Things you can open and use.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-text-muted">
          Standalone research interfaces, visual stories, games, and tools that live alongside the main portfolio.
        </p>
      </section>

      <section className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3" aria-label="Hosted sites">
        {hostedSites.map((site) => (
          <article key={site.href} className="panel-soft flex min-h-64 flex-col rounded-[28px] p-6">
            <p className="eyebrow">{site.label}</p>
            <h2 className="mt-4 text-3xl tracking-[-0.05em] text-text">{site.title}</h2>
            <p className="mt-4 text-sm leading-7 text-text-muted">{site.description}</p>
            <div className="mt-auto flex flex-wrap gap-4 pt-7 text-sm">
              <a href={site.href} target="_blank" rel="noreferrer" className="story-link text-text hover:text-accent">
                Open site ↗
              </a>
              {site.projectHref ? (
                <Link href={site.projectHref} className="story-link text-text-muted hover:text-text">
                  Read the project
                </Link>
              ) : null}
            </div>
          </article>
        ))}
      </section>
    </div>
  )
}

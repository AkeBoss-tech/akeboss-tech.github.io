import { WikiSearch } from '@/components/wiki/wiki-search'
import { getWikiPages } from '@/lib/wiki'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: 'Wiki Explainers by Akash Dubey',
  description: 'Interactive explainers for concepts across Akash Dubey’s projects: AI, robotics, data, biology, math, and systems.',
  path: '/wiki',
  image: '/opengraph-image',
})

export default function WikiIndexPage() {
  const pages = getWikiPages()
  const domains = [...new Set(pages.map((page) => page.domain))]

  return (
    <div className="container-wide py-10 sm:py-14">
      <section className="wiki-index-hero">
        <p className="eyebrow">Wiki</p>
        <h1>Interactive explainers.</h1>
        <p>
          Concepts from the projects and writing, rebuilt as visual teaching pages with source links,
          worked examples, pitfalls, and quick checks.
        </p>
      </section>

      <section className="wiki-domain-strip" aria-label="Wiki domains">
        {domains.map((domain) => <span key={domain}>{domain}</span>)}
      </section>

      <WikiSearch pages={pages} />
    </div>
  )
}

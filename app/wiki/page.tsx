import { WikiSearch } from '@/components/wiki/wiki-search'
import { ResponsiveImage } from '@/components/responsive-image'
import { wikiVisualWorlds } from '@/components/wiki/wiki-generated-figure'
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
          Concepts from the projects and writing, rebuilt as generated visual worlds with live HTML
          simulations, source-grounded explanations, and worked examples.
        </p>
      </section>

      <section className="wiki-visual-atlas" aria-labelledby="visual-atlas-title">
        <div className="wiki-visual-atlas-heading">
          <p className="eyebrow">Explore the systems</p>
          <h2 id="visual-atlas-title">Four visual worlds. Twenty live models.</h2>
        </div>
        <div className="wiki-visual-atlas-grid">
          {wikiVisualWorlds.map((world) => (
            <article key={world.key}>
              <ResponsiveImage src={world.image} alt={world.alt} sizes="(max-width: 760px) 92vw, 36rem" />
              <div>
                <span>{world.key}</span>
                <h3>{world.title}</h3>
                <p>{world.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="wiki-domain-strip" aria-label="Wiki domains">
        {domains.map((domain) => <span key={domain}>{domain}</span>)}
      </section>

      <WikiSearch pages={pages} />
    </div>
  )
}

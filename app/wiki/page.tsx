import { RevealTitle } from '@/components/reveal-title'
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

  return (
    <div className="container-wide py-10 sm:py-14">
      <section className="wiki-index-hero">
        <p className="eyebrow">Wiki · {pages.length} explainers</p>
        <RevealTitle text="How the things I build work." />
        <p>Short, interactive explainers behind my projects. Pick a topic and play with the model.</p>
      </section>

      <section className="wiki-visual-atlas" aria-label="Topic areas">
        <div className="wiki-visual-atlas-grid">
          {wikiVisualWorlds.map((world) => (
            <article key={world.key}>
              <ResponsiveImage src={world.image} alt={world.alt} sizes="(max-width: 760px) 46vw, 22rem" />
              <div>
                <span>{world.key}</span>
                <h3>{world.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </section>

      <WikiSearch pages={pages} />
    </div>
  )
}

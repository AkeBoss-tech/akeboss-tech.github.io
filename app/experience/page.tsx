import { LifeTimeline } from '@/components/life-timeline'
import { RevealTitle } from '@/components/reveal-title'
import { lifeEvents } from '@/lib/life-timeline'
import { absoluteUrl, buildBreadcrumbList, buildPageMetadata, siteName } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: 'Timeline',
  description:
    'A timeline of Akash Dubey’s work, research, projects, school, and leadership, from his first programs in 2016 to applied AI at New York Life.',
  path: '/experience',
})

export default function ExperiencePage() {
  const firstYear = lifeEvents[0]?.start.slice(0, 4)
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ItemList',
        name: `${siteName} timeline`,
        url: absoluteUrl('/experience'),
        itemListElement: lifeEvents.map((event, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: `${event.when}: ${event.title}${event.role ? ` (${event.role})` : ''}`,
          ...(event.href ? { url: absoluteUrl(event.href) } : {}),
        })),
      },
      buildBreadcrumbList([
        { name: 'Home', path: '/' },
        { name: 'Timeline', path: '/experience' },
      ]),
    ],
  }

  return (
    <div className="container-wide py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <header className="lt-header">
        <p className="pj-meta">
          <span>Timeline</span>
          <span>{firstYear} → now</span>
          <span>{lifeEvents.length} moments</span>
        </p>
        <RevealTitle text="Everything so far." className="lt-title" />
        <p className="pj-lede">School, work, research, and the things I built along the way. Scroll through it, or filter by kind.</p>
      </header>
      <LifeTimeline events={lifeEvents} />
    </div>
  )
}

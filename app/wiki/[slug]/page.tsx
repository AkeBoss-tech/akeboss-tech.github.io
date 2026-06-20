import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { WikiPageRenderer } from '@/components/wiki/wiki-page-renderer'
import { buildBreadcrumbList, buildPageMetadata } from '@/lib/seo'
import { getRelatedWikiPages, getWikiPage, getWikiPages } from '@/lib/wiki'

export function generateStaticParams() {
  return getWikiPages().map((page) => ({ slug: page.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const page = getWikiPage(slug)
  if (!page) {
    return buildPageMetadata({
      title: 'Wiki page not found',
      description: 'The requested wiki explainer could not be found.',
      path: `/wiki/${slug}`,
      noIndex: true,
    })
  }

  return buildPageMetadata({
    title: `${page.title} | Wiki`,
    description: page.subtitle,
    path: `/wiki/${page.slug}`,
    image: '/opengraph-image',
    type: 'article',
  })
}

export default async function WikiTopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = getWikiPage(slug)
  if (!page) notFound()

  const related = getRelatedWikiPages(page.related)
  const structuredData = [
    buildBreadcrumbList([
      { name: 'Home', path: '/' },
      { name: 'Wiki', path: '/wiki' },
      { name: page.title, path: `/wiki/${page.slug}` },
    ]),
    {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: page.title,
      description: page.subtitle,
      url: `https://akashdubey.me/wiki/${page.slug}`,
      about: page.tags,
      proficiencyLevel: page.difficulty,
    },
  ]

  return (
    <div className="container-wide py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <WikiPageRenderer page={page} related={related} />
    </div>
  )
}

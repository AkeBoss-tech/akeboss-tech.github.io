import { LlmMarkdown } from '@/components/llm-markdown'
import { ResponsiveImage } from '@/components/responsive-image'
import Link from 'next/link'
import { buildAboutLlmMarkdown } from '@/lib/llm'
import { buildPageMetadata, siteName, siteUrl } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: 'About Akash Dubey',
  description:
    'About Akash Dubey: builder, researcher, and operator working across software engineering, AI, product, and quantitative research.',
  path: '/about',
  image: '/about/opengraph-image',
})

export default function AboutPage() {
  const llmMarkdown = buildAboutLlmMarkdown()
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteName,
    url: `${siteUrl}/about`,
    image: `${siteUrl}/images/face.jpg`,
    jobTitle: 'Software engineer and researcher',
    sameAs: ['https://github.com/AkeBoss-tech', 'https://www.linkedin.com/in/akash---dubey/'],
  }

  return (
    <div className="container-wide py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <LlmMarkdown content={llmMarkdown} />
      <section className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div className="panel-soft overflow-hidden rounded-[32px]">
          <ResponsiveImage
            src="/images/face.jpg"
            alt="Akash Dubey"
            className="h-full w-full object-cover"
            sizes="(max-width: 1024px) 92vw, 32rem"
            loading="eager"
          />
        </div>

        <div>
          <p className="eyebrow">About</p>
          <h1 className="mt-4 text-5xl text-text sm:text-7xl">Builder, researcher, operator.</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-text-muted">
            I like turning messy systems into tools people can actually use.
          </p>
          <p className="mt-5 max-w-3xl text-base leading-8 text-text-muted">
            I study Computer Science and Mathematics at Rutgers, and most of my work sits between engineering, research, and product.
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

import { LlmMarkdown } from '@/components/llm-markdown'
import { HomeStory } from '@/components/home-story'
import { getProjects } from '@/lib/content'
import { buildHomeLlmMarkdown } from '@/lib/llm'
import { buildPageMetadata, siteName, siteUrl } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: 'Akash Dubey',
  description:
    'Akash Dubey builds software, AI systems, robotics projects, and research-driven products across startups, labs, and student work.',
  path: '/',
  image: '/opengraph-image',
})

export default function HomePage() {
  const projects = getProjects()
  const llmMarkdown = buildHomeLlmMarkdown(projects)
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        name: siteName,
        url: siteUrl,
        image: `${siteUrl}/images/face.jpg`,
        sameAs: ['https://github.com/AkeBoss-tech', 'https://www.linkedin.com/in/akash---dubey/'],
        alumniOf: [
          {
            '@type': 'CollegeOrUniversity',
            name: 'Rutgers University',
          },
        ],
        knowsAbout: ['Software engineering', 'Artificial intelligence', 'Robotics', 'Mathematics', 'Research'],
      },
      {
        '@type': 'WebSite',
        name: siteName,
        url: siteUrl,
      },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <LlmMarkdown content={llmMarkdown} />
      <HomeStory projects={projects} />
    </>
  )
}

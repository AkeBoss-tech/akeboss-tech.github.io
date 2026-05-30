import { LlmMarkdown } from '@/components/llm-markdown'
import Link from 'next/link'
import { buildStoryLlmMarkdown } from '@/lib/llm'
import { storyTimeline } from '@/lib/site-data'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: 'Story of Akash Dubey',
  description:
    'A timeline of Akash Dubey’s projects, ideas, research, robotics work, and product experiments.',
  path: '/story',
  image: '/story/opengraph-image',
})

export default function StoryPage() {
  const llmMarkdown = buildStoryLlmMarkdown()
  return (
    <div className="container-wide py-10 sm:py-14">
      <LlmMarkdown content={llmMarkdown} />
      <section className="max-w-4xl">
        <p className="eyebrow">Story</p>
        <h1 className="mt-4 text-5xl text-text sm:text-7xl">A timeline of projects, ideas, and experiments.</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-text-muted">
          The portfolio makes more sense as a progression: code, math, research, robotics, and product work feeding each other over time.
        </p>
      </section>

      <section className="mt-12 grid gap-5">
        {storyTimeline.map((beat) => (
          <article key={beat.year} className="panel rounded-[30px] p-6 sm:p-7">
            <div className="grid gap-4 lg:grid-cols-[0.2fr_0.8fr]">
              <p className="text-3xl tracking-[-0.06em] text-accent sm:text-4xl">{beat.year}</p>
              <div>
                <h2 className="text-3xl text-text sm:text-4xl">{beat.title}</h2>
                <p className="mt-4 max-w-3xl text-base leading-8 text-text-muted">{beat.body}</p>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="mt-10 flex flex-wrap gap-3">
        <Link href="/projects" className="rounded-full border border-white/12 bg-white/[0.04] px-5 py-3 text-sm text-text-muted hover:border-white/25 hover:text-text">
          Browse projects
        </Link>
        <Link href="/writing" className="rounded-full border border-white/12 bg-white/[0.04] px-5 py-3 text-sm text-text-muted hover:border-white/25 hover:text-text">
          Read the writing
        </Link>
      </section>
    </div>
  )
}

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPost, getPosts } from '@/lib/content'
import { Markdown } from '@/components/markdown'
import { Reveal } from '@/components/reveal'

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }))
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return notFound()
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-10">
      <section className="py-8 sm:py-10 lg:py-16">
        <Reveal>
          <div className="max-w-4xl">
            <Link href="/writing" className="inline-flex rounded-full border border-border bg-bg-elevated/80 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted backdrop-blur">
              ← Back to writing
            </Link>
            <div className="mt-5 flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.reading}</span>
            </div>
            <h1 className="mt-4 font-display text-4xl tracking-[-0.06em] sm:text-5xl lg:text-6xl">{post.title}</h1>
            {post.excerpt ? <p className="mt-5 max-w-3xl text-base leading-7 text-text-muted sm:text-lg">{post.excerpt}</p> : null}
          </div>
        </Reveal>
        {post.image ? (
          <Reveal delay={0.06}>
            <div className="glass mt-8 rounded-[32px] p-3 sm:p-4">
              <div className="media-frame aspect-[16/8] overflow-hidden rounded-[26px] border-0">
                <img src={post.image} alt={post.title} className="h-full w-full object-cover" />
              </div>
            </div>
          </Reveal>
        ) : null}
      </section>
      <section className="pb-20">
        <Reveal>
          <div className="glass rounded-[32px] p-6 sm:p-8 lg:p-10">
            <Markdown content={post.content} />
          </div>
        </Reveal>
      </section>
    </div>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Markdown } from '@/components/markdown'
import { PostCard } from '@/components/post-card'
import { getPost, getPosts } from '@/lib/content'
import { formatDate } from '@/lib/format'
import { absoluteUrl, buildPageMetadata, siteName } from '@/lib/seo'

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)

  if (!post) {
    return buildPageMetadata({
      title: 'Writing',
      description: 'Article not found.',
      path: `/writing/${slug}`,
      noIndex: true,
      type: 'article',
    })
  }

  return buildPageMetadata({
    title: post.title,
    description: post.excerpt || post.lead,
    path: `/writing/${post.slug}`,
    image: post.image,
    type: 'article',
  })
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return notFound()
  const articleDescription = post.excerpt || post.lead
  const relatedPosts = getPosts()
    .filter((candidate) => candidate.slug !== post.slug)
    .map((candidate) => ({
      post: candidate,
      score: candidate.tags.filter((tag) => post.tags.includes(tag)).length,
    }))
    .sort((a, b) => b.score - a.score || (a.post.date < b.post.date ? 1 : -1))
    .slice(0, 3)
    .map(({ post }) => post)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: articleDescription,
    url: absoluteUrl(`/writing/${post.slug}`),
    image: post.image ? [absoluteUrl(post.image)] : undefined,
    author: {
      '@type': 'Person',
      name: siteName,
    },
    datePublished: post.date,
    keywords: post.tags.join(', '),
  }

  return (
    <div className="container-wide py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <section className="max-w-4xl">
        <Link href="/writing" className="eyebrow inline-flex items-center gap-2 text-text-soft hover:text-text">
          ← Back to writing
        </Link>
        <div className="mt-6 flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-text-soft">
          <span>{formatDate(post.date)}</span>
          <span>•</span>
          <span>{post.reading}</span>
        </div>
        <h1 className="mt-4 text-5xl text-text sm:text-7xl">{post.title}</h1>
        {post.excerpt ? <p className="mt-5 max-w-3xl text-lg leading-8 text-text-muted">{post.excerpt}</p> : null}
      </section>

      {post.image ? (
        <section className="mt-8">
          <div className="panel-soft overflow-hidden rounded-[32px]">
            <img src={post.image} alt={post.title} className="max-h-[34rem] w-full object-cover" />
          </div>
        </section>
      ) : null}

      <section className="mt-10">
        <div className="panel-soft rounded-[28px] p-5 sm:p-6">
          <p className="eyebrow">Why it matters</p>
          <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <p className="max-w-3xl text-sm leading-7 text-text-muted">
            The writing pages are part of the portfolio story, not a separate archive. They capture the thinking, context, and personal momentum behind the projects.
            </p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="tag">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        <article className="panel mt-8 rounded-[32px] px-6 py-7 sm:px-8 sm:py-9">
          <Markdown content={post.content} className="writing-prose" />
        </article>

        {relatedPosts.length ? (
          <div className="mt-10">
            <div className="max-w-2xl">
              <p className="eyebrow">Keep Reading</p>
              <h2 className="mt-4 text-3xl text-text sm:text-4xl">Suggested articles</h2>
              <p className="mt-4 text-base leading-8 text-text-muted">
                More notes from the same thread of building, reflecting, and figuring things out.
              </p>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <PostCard key={relatedPost.slug} post={relatedPost} />
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </div>
  )
}

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Markdown } from '@/components/markdown'
import { getPost, getPosts } from '@/lib/content'
import { formatDate } from '@/lib/format'

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }))
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return notFound()

  return (
    <div className="container-wide py-10 sm:py-14">
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

      <section className="mt-10 grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
        <aside className="panel-soft h-fit rounded-[28px] p-5 sm:p-6">
          <p className="eyebrow">Why it matters</p>
          <p className="mt-4 text-sm leading-7 text-text-muted">
            The writing pages are part of the portfolio story, not a separate archive. They capture the thinking, context, and personal momentum behind the projects.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </aside>

        <article className="panel rounded-[32px] px-6 py-7 sm:px-8 sm:py-9">
          <Markdown content={post.content} />
        </article>
      </section>
    </div>
  )
}

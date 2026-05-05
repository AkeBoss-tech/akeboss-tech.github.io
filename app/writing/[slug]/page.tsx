import { notFound } from 'next/navigation'
import { getPost, getPosts } from '@/lib/content'
import { Markdown } from '@/components/markdown'

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }))
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return notFound()
  return (
    <div className="mx-auto max-w-5xl px-6 lg:px-10">
      <section className="py-10 lg:py-16">
        <div className="mb-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted"><span>{post.date}</span><span>•</span><span>{post.reading}</span></div>
        <h1 className="font-display text-5xl tracking-[-0.05em]">{post.title}</h1>
        {post.excerpt ? <p className="mt-5 max-w-3xl text-lg leading-8 text-text-muted">{post.excerpt}</p> : null}
        {post.image ? <div className="media-frame mt-8 aspect-[16/8] max-w-4xl">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={post.image} alt={post.title} /></div> : null}
      </section>
      <section className="pb-20"><Markdown content={post.content} /></section>
    </div>
  )
}

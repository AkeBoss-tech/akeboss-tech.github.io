import { getPosts } from '@/lib/content'
import { PostCard } from '@/components/post-card'

export default function WritingPage() {
  const posts = getPosts()
  return (
    <div className="mx-auto max-w-7xl px-6 lg:px-10">
      <section className="py-10 lg:py-16">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">Writing</p>
        <h1 className="mt-3 font-display text-5xl tracking-[-0.05em]">Reflections, journals, and robotics logs.</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-text-muted">A mix of personal reflections, technical experiments, and long-form documentation of how projects evolved.</p>
      </section>
      <div className="grid gap-5 pb-16 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => <PostCard key={post.slug} post={post} />)}
      </div>
    </div>
  )
}

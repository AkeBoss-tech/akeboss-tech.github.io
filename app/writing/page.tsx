import { getPosts } from '@/lib/content'
import { PostCard } from '@/components/post-card'
import { Reveal } from '@/components/reveal'

export default function WritingPage() {
  const posts = getPosts()
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
      <section className="py-8 sm:py-10 lg:py-16">
        <Reveal>
          <div className="max-w-4xl">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-text-muted">Writing</p>
            <h1 className="mt-3 font-display text-5xl tracking-[-0.06em] sm:text-6xl">Notes, logs, and reflections.</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-text-muted sm:text-lg">
              Build journals, technical reflections, robotics notes, and the occasional longer thought worth keeping.
            </p>
          </div>
        </Reveal>
      </section>
      <div className="grid gap-5 pb-16 md:grid-cols-2 xl:grid-cols-3">
        {posts.map((post, index) => (
          <Reveal key={post.slug} delay={index * 0.03}>
            <PostCard post={post} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}

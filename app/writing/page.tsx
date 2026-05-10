import { PostCard } from '@/components/post-card'
import { getPosts } from '@/lib/content'
import { getWritingGroups } from '@/lib/site-data'

export default function WritingPage() {
  const groups = getWritingGroups(getPosts())

  return (
    <div className="container-wide py-10 sm:py-14">
      <section className="max-w-4xl">
        <p className="eyebrow">Writing</p>
        <h1 className="mt-4 text-5xl text-text sm:text-7xl">Notes from building, studying, and figuring things out.</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-text-muted">
          The writing is a storyboard rather than a generic archive: build logs, school-year reflections, and old journals that explain the person behind the portfolio.
        </p>
      </section>

      <div className="mt-12 space-y-12">
        {groups.map((group) => (
          <section key={group.title}>
            <div className="mb-6 max-w-2xl">
              <p className="eyebrow">{group.title}</p>
              <p className="mt-3 text-base leading-8 text-text-muted">{group.description}</p>
            </div>
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {group.posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

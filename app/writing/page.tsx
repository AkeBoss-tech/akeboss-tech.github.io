import { PostCard } from '@/components/post-card'
import { getPosts } from '@/lib/content'
import { getWritingGroups } from '@/lib/site-data'

export default function WritingPage() {
  const groups = getWritingGroups(getPosts())

  return (
    <div className="container-wide py-10 sm:py-14">
      <section className="max-w-4xl">
        <h1 className="text-5xl text-text sm:text-7xl">Writing.</h1>
      </section>

      <div className="mt-12 space-y-12">
        {groups.map((group) => (
          <section key={group.title}>
            <div className="mb-6 max-w-2xl">
              <p className="eyebrow">{group.title}</p>
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

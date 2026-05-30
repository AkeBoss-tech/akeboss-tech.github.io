import { LlmMarkdown } from '@/components/llm-markdown'
import { PostCard } from '@/components/post-card'
import { getPosts } from '@/lib/content'
import { buildWritingLlmMarkdown } from '@/lib/llm'
import { getWritingGroups } from '@/lib/site-data'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: 'Writing by Akash Dubey',
  description:
    'Writing by Akash Dubey on robotics, programming, school, reflection, and the thinking behind the projects.',
  path: '/writing',
  image: '/writing/opengraph-image',
})

export default function WritingPage() {
  const posts = getPosts()
  const groups = getWritingGroups(posts)
  const llmMarkdown = buildWritingLlmMarkdown(posts)

  return (
    <div className="container-wide py-10 sm:py-14">
      <LlmMarkdown content={llmMarkdown} />
      <section className="max-w-4xl">
        <h1 className="text-5xl text-text sm:text-7xl">Writing.</h1>
        <p className="mt-3 max-w-2xl text-text-soft">Notes on building, research, and how the work comes together.</p>
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

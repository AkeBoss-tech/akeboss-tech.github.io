import Link from 'next/link'
import type { Post } from '@/lib/content'
import { formatDate } from '@/lib/format'

export function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/writing/${post.slug}`} className="group panel-soft block rounded-[28px] p-5 sm:p-6">
      <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-text-soft">
        <span>{formatDate(post.date)}</span>
        <span>•</span>
        <span>{post.reading}</span>
      </div>
      <h3 className="mt-4 text-2xl text-text transition group-hover:text-white sm:text-3xl">{post.title}</h3>
      <p className="mt-4 text-sm leading-7 text-text-muted">
        {post.excerpt || 'Reflections, build notes, and chapters from the longer story behind the work.'}
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        {post.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>
    </Link>
  )
}

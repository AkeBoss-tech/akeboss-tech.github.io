import Link from 'next/link'
import type { Post } from '@/lib/content'

export function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/writing/${post.slug}`} className="glass group flex flex-col rounded-[24px] p-6 transition duration-300 hover:-translate-y-1">
      <div className="mb-3 flex items-center gap-3 text-xs uppercase tracking-[0.16em] text-text-muted">
        <span>{post.date}</span>
        <span>•</span>
        <span>{post.reading}</span>
      </div>
      <h3 className="font-display text-xl tracking-tight group-hover:text-accent">{post.title}</h3>
      <p className="mt-3 text-sm leading-7 text-text-muted">{post.excerpt || 'Reflections, notes, and build logs from different parts of the journey.'}</p>
    </Link>
  )
}

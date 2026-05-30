import Link from 'next/link'
import { ResponsiveImage } from '@/components/responsive-image'
import type { Post } from '@/lib/content'
import { formatDate } from '@/lib/format'

export function PostCard({ post }: { post: Post }) {
  const rawPreview = post.excerpt || post.lead || 'Notes, reflections, and build logs.'
  const normalizedPreview = rawPreview
    .replace(/^\/?\d{1,2}\/\d{1,2}\/\d{2,4}\s*=*\s*/i, '')
    .trim()
  const preview =
    normalizedPreview.length > 150
      ? `${normalizedPreview.slice(0, 147).trimEnd().replace(/\s+\S*$/, '')}...`
      : normalizedPreview

  return (
    <Link href={`/writing/${post.slug}`} className="group panel-soft block overflow-hidden rounded-[28px]">
      <div className="relative overflow-hidden border-b border-white/8">
        <ResponsiveImage
          src={post.image || '/images/posts/doing-things-hero.png'}
          alt={post.title}
          className="h-48 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 92vw, 24rem"
        />
      </div>
      <div className="p-5 sm:p-6">
        <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-soft">
          {formatDate(post.date)}
        </div>
        <h3 className="mt-4 text-2xl text-text transition group-hover:text-white sm:text-3xl">{post.title}</h3>
        <p className="mt-4 line-clamp-3 text-sm leading-7 text-text-muted">
          {preview}
        </p>
      </div>
    </Link>
  )
}

import { notFound } from 'next/navigation'
import { formatDate } from '@/lib/format'
import { getPost, getPosts } from '@/lib/content'
import { renderOgCard } from '@/lib/og'

export const dynamic = 'force-static'

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }))
}

export const alt = 'Writing preview'
export const size = {
  width: 1200,
  height: 630,
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)

  if (!post) notFound()

  return renderOgCard({
    eyebrow: 'Writing',
    title: post.title,
    description: post.excerpt || post.lead,
    variant: 'article',
    imagePath: post.image,
    tags: post.tags,
    dateLabel: formatDate(post.date),
  })
}


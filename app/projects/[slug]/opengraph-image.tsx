import { notFound } from 'next/navigation'
import { getProject } from '@/lib/content'
import { renderOgCard } from '@/lib/og'

export const dynamic = 'force-static'

export const alt = 'Project preview'
export const size = {
  width: 1200,
  height: 630,
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = getProject(slug)

  if (!project) notFound()

  return renderOgCard({
    eyebrow: 'Project',
    title: project.title,
    description: project.excerpt || project.lead,
    variant: 'showcase',
    imagePath: project.image,
    tags: project.tags,
    dateLabel: project.date,
  })
}


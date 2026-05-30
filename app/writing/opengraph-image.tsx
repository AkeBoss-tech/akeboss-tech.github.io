import { renderOgCard } from '@/lib/og'

export const dynamic = 'force-static'

export const alt = 'Writing by Akash Dubey'
export const size = {
  width: 1200,
  height: 630,
}

export default function Image() {
  return renderOgCard({
    eyebrow: 'Writing',
    title: 'Notes on building, research, and momentum.',
    description: 'Writing on robotics, programming, school, reflection, and how the projects come together.',
    variant: 'article',
    imagePath: '/images/posts/doing-things-hero.png',
  })
}


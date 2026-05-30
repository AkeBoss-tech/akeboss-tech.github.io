import { renderOgCard } from '@/lib/og'

export const dynamic = 'force-static'

export const alt = 'Projects by Akash Dubey'
export const size = {
  width: 1200,
  height: 630,
}

export default function Image() {
  return renderOgCard({
    eyebrow: 'Projects',
    title: 'AI, robotics, research, and product work.',
    description: 'Selected software projects spanning startups, labs, interfaces, and technical experiments.',
    variant: 'showcase',
    imagePath: '/images/portfolio/home.png',
    tags: ['AI', 'Robotics', 'Research'],
  })
}


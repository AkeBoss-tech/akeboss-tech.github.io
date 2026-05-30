import { renderOgCard } from '@/lib/og'

export const alt = 'Story of Akash Dubey'
export const size = {
  width: 1200,
  height: 630,
}

export default function Image() {
  return renderOgCard({
    eyebrow: 'Story',
    title: 'A timeline of projects, ideas, and experiments.',
    description: 'How code, math, robotics, research, and product work compound over time.',
    variant: 'timeline',
    imagePath: '/hero-nyc.png',
  })
}


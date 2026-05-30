import { renderOgCard } from '@/lib/og'

export const alt = 'Moodboard'
export const size = {
  width: 1200,
  height: 630,
}

export default function Image() {
  return renderOgCard({
    eyebrow: 'Moodboard',
    title: 'Dense references. Less explaining.',
    description: 'A private visual wall of interfaces, systems, robotics, and editorial energy.',
    variant: 'showcase',
    imagePath: '/images/portfolio/grokipedia-api/hero.png',
  })
}


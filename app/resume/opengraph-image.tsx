import { renderOgCard } from '@/lib/og'

export const dynamic = 'force-static'

export const alt = 'Resume of Akash Dubey'
export const size = {
  width: 1200,
  height: 630,
}

export default function Image() {
  return renderOgCard({
    eyebrow: 'Resume',
    title: 'Software engineering, AI systems, and product work.',
    description: 'A recruiter-facing snapshot of internships, startup work, technical depth, and execution.',
    variant: 'resume',
    imagePath: '/images/portfolio/scarlet-sync/home.png',
  })
}


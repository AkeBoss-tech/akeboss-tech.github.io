import { renderOgCard } from '@/lib/og'

export const dynamic = 'force-static'

export const alt = 'Contact Akash Dubey'
export const size = {
  width: 1200,
  height: 630,
}

export default function Image() {
  return renderOgCard({
    eyebrow: 'Contact',
    title: 'Reach out for internships, research, and product work.',
    description: 'Email, GitHub, and LinkedIn for engineering, AI, startup, and collaboration conversations.',
    variant: 'contact',
    imagePath: '/images/face.jpg',
  })
}


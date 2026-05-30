import { renderOgCard } from '@/lib/og'

export const dynamic = 'force-static'

export const alt = 'About Akash Dubey'
export const size = {
  width: 1200,
  height: 630,
}

export default function Image() {
  return renderOgCard({
    eyebrow: 'About',
    title: 'Builder, researcher, operator.',
    description: 'Software engineering, AI systems, quantitative work, and product-minded research.',
    variant: 'profile',
    imagePath: '/images/face.jpg',
  })
}


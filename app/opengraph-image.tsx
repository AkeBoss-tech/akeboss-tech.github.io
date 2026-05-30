import { renderOgCard } from '@/lib/og'

export const alt = 'Akash Dubey'
export const size = {
  width: 1200,
  height: 630,
}

export default function Image() {
  return renderOgCard({
    eyebrow: 'Home',
    title: 'Akash Dubey',
    variant: 'home',
    imagePath: '/images/face.jpg',
  })
}


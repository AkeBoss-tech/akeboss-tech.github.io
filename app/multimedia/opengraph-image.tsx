import { renderOgCard } from '@/lib/og'

export const dynamic = 'force-static'

export const alt = 'Multimedia on Akash Dubey’s site'
export const size = {
  width: 1200,
  height: 630,
}

export default function Image() {
  return renderOgCard({
    eyebrow: 'Multimedia',
    title: 'Pictures, a film, and a recording.',
    description: 'A photo slideshow, the Kenny’s Racing Game demo, and the November Journal.',
    variant: 'showcase',
    imagePath: '/images/portfolio/racing/grand.png',
  })
}

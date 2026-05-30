import { renderOgCard } from '@/lib/og'

export const dynamic = 'force-static'

export const alt = 'CV of Akash Dubey'
export const size = {
  width: 1200,
  height: 630,
}

export default function Image() {
  return renderOgCard({
    eyebrow: 'CV',
    title: 'Academic and research CV.',
    description: 'Education, labs, leadership, quantitative work, and research experience.',
    variant: 'resume',
    imagePath: '/images/portfolio/hic-tad/hero.png',
  })
}


import { ResponsiveImage } from '@/components/responsive-image'
import type { WikiPage } from '@/lib/wiki'

export const wikiVisualWorlds = [
  {
    key: 'ai',
    title: 'AI & knowledge systems',
    description: 'Evidence, retrieval, agents, and the paths that connect a question to a grounded answer.',
    image: '/images/wiki/ai-knowledge-systems.png',
    alt: 'Documents and retrieval paths converging on a luminous evidence core with connected agent nodes',
  },
  {
    key: 'robotics',
    title: 'Robotics & planning',
    description: 'Motion, sensing, control loops, and plans made visible as a field of forces and trajectories.',
    image: '/images/wiki/robotics-control-planning.png',
    alt: 'Robotic drive chassis with velocity vectors, a planned trajectory, and fiducial field landmarks',
  },
  {
    key: 'science',
    title: 'Genomics & vision',
    description: 'Dense biological and visual signals resolved into structure, geometry, and interpretable layers.',
    image: '/images/wiki/genomics-computer-vision.png',
    alt: 'Hi-C contact map framed by chromatin structure and stereo camera geometry',
  },
  {
    key: 'math',
    title: 'Math, data & systems',
    description: 'Combinatorial structure, time series, transit flows, and compute systems sharing one visual grammar.',
    image: '/images/wiki/math-data-transit.png',
    alt: 'Combinatorial lattice branching into time-series traces and a transit network',
  },
] as const

const worldByArtifact: Record<WikiPage['artifact']['type'], (typeof wikiVisualWorlds)[number]['key']> = {
  'rag-retrieval': 'ai',
  'source-wiki': 'ai',
  'api-backoff': 'ai',
  'feature-engineering': 'ai',
  'model-tradeoff': 'ai',
  'agent-graph': 'ai',
  'astar-grid': 'robotics',
  'swerve-vectors': 'robotics',
  'pid-controller': 'robotics',
  'tamp-pipeline': 'robotics',
  'logging-replay': 'robotics',
  'vehicle-physics': 'robotics',
  'hic-heatmap': 'science',
  'stereo-disparity': 'science',
  'alphagenome': 'science',
  'transit-load': 'math',
  'q-binomial': 'math',
  'economic-series': 'math',
  'schedule-grid': 'math',
  'hpc-queue': 'math',
}

export function WikiGeneratedFigure({ page }: { page: WikiPage }) {
  const worldKey = worldByArtifact[page.artifact.type]
  const world = wikiVisualWorlds.find((candidate) => candidate.key === worldKey) ?? wikiVisualWorlds[0]

  return (
    <figure className="wiki-generated-figure">
      <ResponsiveImage
        src={world.image}
        alt={world.alt}
        className="wiki-generated-figure-image"
        sizes="(max-width: 768px) 100vw, 76rem"
        loading="eager"
        fetchPriority="high"
      />
      <span className="wiki-generated-figure-scrim" aria-hidden="true" />
      <figcaption>
        <span>Generated visual world</span>
        <strong>{world.title}</strong>
        <p>{world.description}</p>
      </figcaption>
    </figure>
  )
}

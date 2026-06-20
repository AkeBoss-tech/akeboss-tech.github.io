import fs from 'fs'
import path from 'path'

const root = process.cwd()
const wikiDir = path.join(root, 'data', 'wiki')

export type WikiSourceLink = {
  label: string
  href: string
}

export type WikiTable = {
  columns: string[]
  rows: string[][]
}

export type WikiSection = {
  heading: string
  body: string[]
  callout?: string
  table?: WikiTable
}

export type WikiContentBlock =
  | {
      type: 'heading'
      level?: 2 | 3 | 4
      text: string
    }
  | {
      type: 'paragraph'
      text: string
    }
  | {
      type: 'markdown' | 'latex' | 'html'
      content: string
    }
  | {
      type: 'callout'
      title?: string
      body: string
    }
  | {
      type: 'table'
      table: WikiTable
    }
  | {
      type: 'demo'
    }

export type WikiQuizQuestion = {
  question: string
  options: string[]
  answer: number
  explanation: string
}

export type WikiPage = {
  slug: string
  title: string
  subtitle: string
  domain: string
  difficulty: 'Foundational' | 'Intermediate' | 'Advanced'
  summary: string
  tags: string[]
  sourceFiles: string[]
  sourceLinks: WikiSourceLink[]
  externalSources: WikiSourceLink[]
  artifact: {
    type:
      | 'rag-retrieval'
      | 'source-wiki'
      | 'hic-heatmap'
      | 'astar-grid'
      | 'swerve-vectors'
      | 'pid-controller'
      | 'stereo-disparity'
      | 'tamp-pipeline'
      | 'transit-load'
      | 'q-binomial'
      | 'api-backoff'
      | 'economic-series'
      | 'schedule-grid'
      | 'feature-engineering'
      | 'alphagenome'
      | 'model-tradeoff'
      | 'agent-graph'
      | 'hpc-queue'
      | 'logging-replay'
      | 'vehicle-physics'
    title: string
    description: string
  }
  contentBlocks?: WikiContentBlock[]
  sections: WikiSection[]
  pitfalls: string[]
  quiz: WikiQuizQuestion[]
  related: string[]
}

function readWikiFile(file: string): WikiPage {
  const raw = fs.readFileSync(path.join(wikiDir, file), 'utf8')
  return JSON.parse(raw) as WikiPage
}

export function getWikiPages() {
  if (!fs.existsSync(wikiDir)) return []
  return fs
    .readdirSync(wikiDir)
    .filter((file) => file.endsWith('.json'))
    .map(readWikiFile)
    .sort((a, b) => a.title.localeCompare(b.title))
}

export function getWikiPage(slug: string) {
  return getWikiPages().find((page) => page.slug === slug)
}

export function getRelatedWikiPages(slugs: string[]) {
  const bySlug = new Map(getWikiPages().map((page) => [page.slug, page]))
  return slugs.map((slug) => bySlug.get(slug)).filter(Boolean) as WikiPage[]
}

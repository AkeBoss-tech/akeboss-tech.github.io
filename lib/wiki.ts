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

export type WikiVisualExperience = {
  image: string
  alt: string
  eyebrow: string
  headline: string
  subhead: string
  steps: Array<{
    label: string
    detail: string
    accent: 'blue' | 'gold' | 'mix'
  }>
}

export type WikiPage = {
  schemaVersion: 2
  slug: string
  title: string
  subtitle: string
  domain: string
  difficulty: 'Foundational' | 'Intermediate' | 'Advanced'
  summary: string
  tags: string[]
  sourceFiles: string[]
  sourceStatus?: {
    label: 'Implemented' | 'In progress' | 'Pilot-ready' | 'Research direction' | 'Illustrative'
    note: string
  }
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
  visualExperience?: WikiVisualExperience
  contentBlocks?: WikiContentBlock[]
  sections: WikiSection[]
  pitfalls: string[]
  related: string[]
}

function readWikiFile(file: string): WikiPage {
  const raw = fs.readFileSync(path.join(wikiDir, file), 'utf8')
  const page = JSON.parse(raw) as WikiPage
  if (page.schemaVersion !== 2) throw new Error(`${file}: unsupported wiki schema version`)
  if (!page.slug || !page.title || !page.subtitle || !page.summary) throw new Error(`${file}: missing required page metadata`)
  if (!page.artifact?.type || !page.artifact?.title || !page.artifact?.description) throw new Error(`${file}: missing teaching artifact metadata`)
  if (!Array.isArray(page.sourceLinks) || page.sourceLinks.length < 1) throw new Error(`${file}: missing site connection`)
  if (!Array.isArray(page.sections) || page.sections.length < 4) throw new Error(`${file}: expected at least four teaching sections`)
  if (!Array.isArray(page.sourceFiles) || page.sourceFiles.length < 1) throw new Error(`${file}: expected at least one repository source`)
  return page
}

export function getWikiPages() {
  if (!fs.existsSync(wikiDir)) return []
  const pages = fs
    .readdirSync(wikiDir)
    .filter((file) => file.endsWith('.json'))
    .map(readWikiFile)
    .sort((a, b) => a.title.localeCompare(b.title))
  const slugs = new Set(pages.map((page) => page.slug))
  for (const page of pages) {
    for (const relatedSlug of page.related) {
      if (!slugs.has(relatedSlug)) throw new Error(`${page.slug}: related wiki page does not exist: ${relatedSlug}`)
    }
  }
  return pages
}

export function getWikiPage(slug: string) {
  return getWikiPages().find((page) => page.slug === slug)
}

export function getRelatedWikiPages(slugs: string[]) {
  const bySlug = new Map(getWikiPages().map((page) => [page.slug, page]))
  return slugs.map((slug) => bySlug.get(slug)).filter(Boolean) as WikiPage[]
}

import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const wikiDir = path.join(root, 'data', 'wiki')
const files = fs.readdirSync(wikiDir).filter((file) => file.endsWith('.json')).sort()
const artifactTypes = new Set([
  'rag-retrieval', 'source-wiki', 'hic-heatmap', 'astar-grid', 'swerve-vectors',
  'pid-controller', 'stereo-disparity', 'tamp-pipeline', 'transit-load', 'q-binomial',
  'api-backoff', 'economic-series', 'schedule-grid', 'feature-engineering', 'alphagenome',
  'model-tradeoff', 'agent-graph', 'hpc-queue', 'logging-replay', 'vehicle-physics',
])
const sourceStatuses = new Set(['Implemented', 'In progress', 'Pilot-ready', 'Research direction', 'Illustrative'])
const pages = files.map((file) => {
  const page = JSON.parse(fs.readFileSync(path.join(wikiDir, file), 'utf8'))
  const fail = (message) => { throw new Error(`${file}: ${message}`) }
  if (page.schemaVersion !== 2) fail('unsupported schema version')
  if (`${page.slug}.json` !== file) fail('filename must match slug')
  if (!page.title || !page.subtitle || !page.summary) fail('missing required metadata')
  if (!page.artifact?.type || !page.artifact?.title || !page.artifact?.description) fail('missing teaching artifact metadata')
  if (!artifactTypes.has(page.artifact.type)) fail(`unknown artifact type: ${page.artifact.type}`)
  if (page.sourceStatus && !sourceStatuses.has(page.sourceStatus.label)) fail(`unknown source status: ${page.sourceStatus.label}`)
  if (!Array.isArray(page.sourceLinks) || page.sourceLinks.length < 1) fail('expected at least one site connection')
  if (!Array.isArray(page.sections) || page.sections.length < 4) fail('expected at least four teaching sections')
  if (!page.sections.some((section) => /^Worked Example(?::|$)/.test(section.heading))) fail('expected an explicit Worked Example section')
  if (!Array.isArray(page.pitfalls) || page.pitfalls.length < 3) fail('expected at least three pitfalls')
  if (!Array.isArray(page.sourceFiles) || page.sourceFiles.length < 1) fail('expected a repository source')
  for (const sourceFile of page.sourceFiles) {
    const resolved = path.resolve(root, sourceFile)
    if (!resolved.startsWith(`${root}${path.sep}`) || !fs.existsSync(resolved)) fail(`missing or unsafe source path: ${sourceFile}`)
  }
  for (const section of page.sections) {
    if (!section.heading || !Array.isArray(section.body) || section.body.length < 1) fail('every section needs a heading and body')
    if (section.table && section.table.rows.some((row) => row.length !== section.table.columns.length)) fail(`table width mismatch in ${section.heading}`)
  }
  for (const source of page.externalSources) {
    if (!/^https:\/\//.test(source.href)) fail(`external source must use HTTPS: ${source.href}`)
  }
  return page
})

const slugs = new Set(pages.map((page) => page.slug))
if (slugs.size !== pages.length) throw new Error('Wiki slugs must be unique')
for (const page of pages) {
  for (const relatedSlug of page.related) {
    if (!slugs.has(relatedSlug)) throw new Error(`${page.slug}: related wiki page does not exist: ${relatedSlug}`)
  }
}

console.log(`Validated ${pages.length} wiki pages and ${pages.reduce((count, page) => count + page.related.length, 0)} related links.`)

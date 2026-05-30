import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const projectRoot = process.cwd()
const outputRoot = path.join(projectRoot, 'public', 'generated-images')
const manifestPath = path.join(projectRoot, 'lib', 'generated-responsive-images.json')
const scanRoots = [
  'app',
  'components',
  'lib',
  '_posts',
  '_portfolio',
  '_pages',
]
const textFileExtensions = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.md', '.html', '.yml', '.yaml'])
const imageReferencePattern = /\/[A-Za-z0-9_./ -]+\.(?:png|jpg|jpeg|webp|avif)/g
const defaultWidths = [160, 320, 640, 960, 1280]
const formats = [
  { name: 'avif', options: { quality: 50 } },
  { name: 'webp', options: { quality: 72 } },
]

async function collectFiles(rootPath) {
  const entries = await fs.readdir(rootPath, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.next' || entry.name === 'out' || entry.name === 'public/generated-images') continue
    const fullPath = path.join(rootPath, entry.name)

    if (entry.isDirectory()) {
      files.push(...await collectFiles(fullPath))
      continue
    }

    if (textFileExtensions.has(path.extname(entry.name))) {
      files.push(fullPath)
    }
  }

  return files
}

function toSourceCandidates(src) {
  const normalized = src.replace(/^\//, '')
  return [
    path.join(projectRoot, normalized),
    path.join(projectRoot, 'public', normalized),
  ]
}

function toGeneratedBasePath(src) {
  const normalized = src.replace(/^\//, '')
  const parsed = path.parse(normalized)
  return path.join(outputRoot, parsed.dir, parsed.name)
}

async function resolveSourcePath(src) {
  for (const candidate of toSourceCandidates(src)) {
    try {
      await fs.access(candidate)
      return candidate
    } catch {}
  }

  throw new Error(`Source image not found for ${src}`)
}

async function discoverReferencedImages() {
  const discovered = new Set()

  for (const root of scanRoots) {
    const absoluteRoot = path.join(projectRoot, root)
    let files = []

    try {
      files = await collectFiles(absoluteRoot)
    } catch {
      continue
    }

    for (const file of files) {
      const content = await fs.readFile(file, 'utf8')
      const matches = content.match(imageReferencePattern) ?? []

      for (const match of matches) {
        if (match.includes('/generated-images/')) continue

        try {
          await resolveSourcePath(match)
          discovered.add(match)
        } catch {}
      }
    }
  }

  return [...discovered].sort()
}

async function getVariantWidths(sourcePath) {
  const metadata = await sharp(sourcePath).metadata()
  const sourceWidth = metadata.width ?? defaultWidths[defaultWidths.length - 1]
  const cappedWidth = Math.min(sourceWidth, defaultWidths[defaultWidths.length - 1])
  const widths = defaultWidths.filter((width) => width < cappedWidth)
  widths.push(cappedWidth)
  return [...new Set(widths)].sort((left, right) => left - right)
}

async function ensureFreshVariant(sourcePath, outputPath, width, format, options) {
  const sourceStats = await fs.stat(sourcePath)

  try {
    const outputStats = await fs.stat(outputPath)
    if (outputStats.mtimeMs >= sourceStats.mtimeMs) {
      return false
    }
  } catch {}

  await fs.mkdir(path.dirname(outputPath), { recursive: true })

  await sharp(sourcePath)
    .rotate()
    .resize({ width, withoutEnlargement: true })
    .toFormat(format, options)
    .toFile(outputPath)

  return true
}

let builtCount = 0
const assets = []
const discoveredImages = await discoverReferencedImages()

for (const src of discoveredImages) {
  const sourcePath = await resolveSourcePath(src)
  const widths = await getVariantWidths(sourcePath)
  const outputBase = toGeneratedBasePath(src)
  assets.push({ src, widths })

  for (const width of widths) {
    for (const format of formats) {
      const outputPath = path.join(outputBase, `w${width}.${format.name}`)
      const didBuild = await ensureFreshVariant(sourcePath, outputPath, width, format.name, format.options)
      if (didBuild) {
        builtCount += 1
      }
    }
  }
}

await fs.writeFile(manifestPath, `${JSON.stringify({ assets }, null, 2)}\n`)

console.log(`Responsive image build complete. ${builtCount} variant${builtCount === 1 ? '' : 's'} updated.`)
process.exit(0)

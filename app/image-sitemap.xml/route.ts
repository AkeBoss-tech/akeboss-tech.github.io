import { readdirSync, statSync } from 'fs'
import path from 'path'
import { getPosts, getProjects } from '@/lib/content'
import { absoluteUrl } from '@/lib/seo'

export const dynamic = 'force-static'

function xmlEscape(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function unique<T>(values: T[]) {
  return [...new Set(values)]
}

const searchableImageExtensions = new Set(['.avif', '.gif', '.jpg', '.jpeg', '.png', '.svg', '.webp'])

function filenameToTitle(value: string) {
  return path
    .basename(value, path.extname(value))
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function walkImages(directory: string, urlPrefix: string, ignoreDirectories = new Set<string>()) {
  const images: string[] = []

  function walk(currentDirectory: string, currentPrefix: string) {
    let entries: string[] = []

    try {
      entries = readdirSync(currentDirectory)
    } catch {
      return
    }

    entries.forEach((entry) => {
      if (ignoreDirectories.has(entry)) return

      const fullPath = path.join(currentDirectory, entry)
      const stats = statSync(fullPath)

      if (stats.isDirectory()) {
        walk(fullPath, `${currentPrefix}/${entry}`)
        return
      }

      if (!stats.isFile() || !searchableImageExtensions.has(path.extname(entry).toLowerCase())) return
      images.push(`${currentPrefix}/${entry}`.replace(/\\/g, '/'))
    })
  }

  walk(directory, urlPrefix.replace(/\/$/, ''))
  return images
}

function getPublicImagePaths() {
  const root = process.cwd()
  const rootImages = walkImages(path.join(root, 'images'), '/images')
  const publicImages = walkImages(path.join(root, 'public'), '', new Set(['generated-images', 'images']))

  return unique([...rootImages, ...publicImages])
}

export function GET() {
  const allPublicImagePaths = getPublicImagePaths()
  const pageImageEntries = [
    { url: absoluteUrl('/'), images: allPublicImagePaths },
    { url: absoluteUrl('/about'), images: ['/images/face.jpg'] },
    { url: absoluteUrl('/contact'), images: ['/images/face.jpg'] },
    { url: absoluteUrl('/story'), images: ['/hero-nyc.png'] },
    { url: absoluteUrl('/resume'), images: ['/images/portfolio/scarlet-sync/home.png'] },
    { url: absoluteUrl('/cv'), images: ['/images/portfolio/hic-tad/hero.png'] },
    { url: absoluteUrl('/projects'), images: ['/images/portfolio/home.png'] },
    { url: absoluteUrl('/writing'), images: ['/images/posts/doing-things-hero.png'] },
  ]

  const projectEntries = getProjects().map((project) => ({
    url: absoluteUrl(`/projects/${project.slug}`),
    images: unique(project.mediaImages),
  }))

  const postEntries = getPosts().map((post) => ({
    url: absoluteUrl(`/writing/${post.slug}`),
    images: unique(post.mediaImages),
  }))

  const entries = [...pageImageEntries, ...projectEntries, ...postEntries]
    .map((entry) => ({
      url: entry.url,
      images: unique(entry.images.filter(Boolean)).map((image) => absoluteUrl(image)),
    }))
    .filter((entry) => entry.images.length > 0)

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries
  .map(
    (entry) => `  <url>
    <loc>${xmlEscape(entry.url)}</loc>
${entry.images.map((image) => `    <image:image><image:loc>${xmlEscape(image)}</image:loc><image:title>${xmlEscape(filenameToTitle(image))}</image:title></image:image>`).join('\n')}
  </url>`,
  )
  .join('\n')}
</urlset>`

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
}

import { getPosts, getProjects } from '@/lib/content'
import { absoluteUrl } from '@/lib/seo'

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

export function GET() {
  const pageImageEntries = [
    { url: absoluteUrl('/'), images: ['/images/face.jpg'] },
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
${entry.images.map((image) => `    <image:image><image:loc>${xmlEscape(image)}</image:loc></image:image>`).join('\n')}
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


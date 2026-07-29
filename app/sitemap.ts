import type { MetadataRoute } from 'next'
import { getPosts, getProjects } from '@/lib/content'
import { absoluteUrl } from '@/lib/seo'
import { getWikiPages } from '@/lib/wiki'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    '/',
    '/about',
    '/projects',
    '/sites',
    '/wiki',
    '/writing',
    '/story',
    '/contact',
    '/resume',
    '/cv',
  ]

  const staticEntries = staticPages.map((path) => ({
    url: absoluteUrl(path),
  }))

  const projectEntries = getProjects().map((project) => ({
    url: absoluteUrl(`/projects/${project.slug}`),
    lastModified: new Date(project.date),
  }))

  const postEntries = getPosts().map((post) => ({
    url: absoluteUrl(`/writing/${post.slug}`),
    lastModified: new Date(post.date),
  }))

  const wikiEntries = getWikiPages().map((page) => ({
    url: absoluteUrl(`/wiki/${page.slug}`),
  }))

  return [
    ...staticEntries,
    ...projectEntries,
    ...postEntries,
    ...wikiEntries,
  ]
}

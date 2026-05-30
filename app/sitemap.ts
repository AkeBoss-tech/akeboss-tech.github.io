import type { MetadataRoute } from 'next'
import { getPosts, getProjects } from '@/lib/content'
import { absoluteUrl } from '@/lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = [
    '/',
    '/about',
    '/projects',
    '/writing',
    '/story',
    '/contact',
    '/resume',
    '/cv',
  ]

  const staticEntries = staticPages.map((path) => ({
    url: absoluteUrl(path),
    lastModified: new Date(),
  }))

  const markdownEntries = staticPages.map((path) => ({
    url: absoluteUrl(path === '/' ? '/markdown' : `/markdown${path}`),
    lastModified: new Date(),
  }))

  const projectEntries = getProjects().map((project) => ({
    url: absoluteUrl(`/projects/${project.slug}`),
    lastModified: new Date(project.date),
  }))

  const projectMarkdownEntries = getProjects().map((project) => ({
    url: absoluteUrl(`/markdown/projects/${project.slug}`),
    lastModified: new Date(project.date),
  }))

  const postEntries = getPosts().map((post) => ({
    url: absoluteUrl(`/writing/${post.slug}`),
    lastModified: new Date(post.date),
  }))

  const postMarkdownEntries = getPosts().map((post) => ({
    url: absoluteUrl(`/markdown/writing/${post.slug}`),
    lastModified: new Date(post.date),
  }))

  return [
    ...staticEntries,
    ...markdownEntries,
    ...projectEntries,
    ...projectMarkdownEntries,
    ...postEntries,
    ...postMarkdownEntries,
  ]
}

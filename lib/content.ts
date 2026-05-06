import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

const root = process.cwd()
const portfolioDir = path.join(root, '_portfolio')
const postsDir = path.join(root, '_posts')

export type Project = {
  slug: string
  title: string
  excerpt: string
  image?: string
  tags: string[]
  rank: number
  featured: boolean
  content: string
  lead: string
  sections: { id: string; title: string; summary: string }[]
  links: { label: string; url: string }[]
  reading: string
}

export type Post = {
  slug: string
  title: string
  excerpt: string
  date: string
  image?: string
  tags: string[]
  content: string
  reading: string
}

function parseTags(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String)
  if (typeof value === 'string') {
    const cleaned = value.trim()
    if (cleaned.startsWith('[') && cleaned.endsWith(']')) {
      return cleaned.slice(1, -1).split(',').map((x) => x.trim().replace(/^['\"]|['\"]$/g, '')).filter(Boolean)
    }
    return cleaned ? [cleaned] : []
  }
  return []
}

function stripQuotes(value: unknown, fallback = '') {
  if (!value) return fallback
  return String(value).replace(/^['\"]|['\"]$/g, '')
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function cleanMarkdownText(value: string) {
  return value
    .replace(/<img[^>]*>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^[>*\-+\d.\s]+/gm, '')
    .replace(/[*_#]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractLead(content: string) {
  const sections = content.split(/\n\s*\n/)
  for (const block of sections) {
    const cleaned = cleanMarkdownText(block)
    if (!cleaned) continue
    if (/^[-=*]{3,}$/.test(cleaned)) continue
    if (/^(images|more resources)$/i.test(cleaned)) continue
    return cleaned
  }
  return ''
}

function extractSections(content: string) {
  const matches = [...content.matchAll(/^##\s+(.+)$/gm)]
  return matches.map((match, index) => {
    const title = match[1].trim()
    const start = match.index ?? 0
    const nextStart = matches[index + 1]?.index ?? content.length
    const body = content.slice(start + match[0].length, nextStart)
    const summary = cleanMarkdownText(body).slice(0, 180).trim()
    return { id: slugify(title), title, summary }
  }).filter((section) => section.title)
}

function extractLinks(content: string) {
  const matches = [...content.matchAll(/\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g)]
  const links = matches.map((match) => ({ label: match[1].trim(), url: match[2].trim() }))
  const seen = new Set<string>()
  return links.filter((link) => {
    if (seen.has(link.url)) return false
    seen.add(link.url)
    return true
  }).slice(0, 4)
}

export function getProjects(): Project[] {
  return fs.readdirSync(portfolioDir).filter((file) => file.endsWith('.md')).map((file) => {
    const raw = fs.readFileSync(path.join(portfolioDir, file), 'utf8')
    const { data, content } = matter(raw)
    return {
      slug: file.replace(/\.md$/, ''),
      title: stripQuotes(data.title),
      excerpt: stripQuotes(data.excerpt),
      image: stripQuotes(data.image),
      tags: parseTags(data.tags),
      rank: Number(data.rank || 999),
      featured: data.featured === true || data.featured === 'true',
      content,
      lead: extractLead(content),
      sections: extractSections(content),
      links: extractLinks(content),
      reading: readingTime(content).text,
    }
  }).sort((a, b) => a.rank - b.rank)
}

export function getProject(slug: string) {
  return getProjects().find((project) => project.slug === slug)
}

export function getPosts(): Post[] {
  return fs.readdirSync(postsDir).filter((file) => file.endsWith('.md')).map((file) => {
    const raw = fs.readFileSync(path.join(postsDir, file), 'utf8')
    const { data, content } = matter(raw)
    return {
      slug: stripQuotes(data.permalink || file.replace(/\.md$/, '')).replace(/^\/posts\//, '').replace(/\/$/, ''),
      title: stripQuotes(data.title),
      excerpt: stripQuotes(data.excerpt || ''),
      date: stripQuotes(data.date),
      image: stripQuotes(data.image),
      tags: parseTags(data.tags),
      content,
      reading: readingTime(content).text,
    }
  }).sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPost(slug: string) {
  return getPosts().find((post) => post.slug === slug)
}

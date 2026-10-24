import type { Project } from '@/lib/content'
import { projectCategories } from '@/lib/site-data'
import { getWikiPages } from '@/lib/wiki'

export { projectHue } from '@/lib/project-hue'

/** Matches rehype-slug (github-slugger) closely enough for plain headings. */
export function headingId(text: string) {
  return text
    .replace(/[*_`]/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .toLowerCase()
    .trim()
    .replace(/[^\p{L}\p{M}\p{N}\p{Pc}\- ]/gu, '')
    .replace(/ /g, '-')
}

function categoriesFor(slug: string) {
  return new Set(projectCategories.filter((category) => (category.slugs as readonly string[]).includes(slug)).map((category) => category.title))
}

/** The next project in portfolio order (rank), wrapping around. */
export function getNextProject(projects: Project[], slug: string) {
  const index = projects.findIndex((project) => project.slug === slug)
  if (index === -1 || projects.length < 2) return undefined
  return projects[(index + 1) % projects.length]
}

/** Up to `limit` projects that share tags or a category, best matches first. */
export function getRelatedProjects(projects: Project[], current: Project, exclude: string[] = [], limit = 3) {
  const tags = new Set(current.tags.map((tag) => tag.toLowerCase()))
  const categories = categoriesFor(current.slug)

  return projects
    .filter((project) => project.slug !== current.slug && !exclude.includes(project.slug))
    .map((project) => {
      const sharedTags = project.tags.filter((tag) => tags.has(tag.toLowerCase())).length
      const sharedCategories = [...categoriesFor(project.slug)].filter((title) => categories.has(title)).length
      const score = sharedTags * 2 + sharedCategories * 3 + (project.featured ? 1 : 0) + (project.image ? 0.5 : 0)
      return { project, score }
    })
    .filter((entry) => entry.score > 1)
    .sort((a, b) => b.score - a.score || a.project.rank - b.project.rank)
    .slice(0, limit)
    .map((entry) => entry.project)
}

/** Wiki explainers whose "where this shows up" links point at this project. */
export function getProjectExplainers(slug: string, limit = 4) {
  const href = `/projects/${slug}`
  return getWikiPages()
    .filter((page) => page.sourceLinks.some((link) => link.href === href))
    .slice(0, limit)
}

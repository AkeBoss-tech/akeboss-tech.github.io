import { getProjects, getPosts } from '@/lib/content'
import { getMarkdownForPath } from '@/lib/llm'

export const dynamic = 'force-static'

export function generateStaticParams() {
  const projects = getProjects().map((p) => ({ slug: ['projects', p.slug] }))
  const posts = getPosts().map((p) => ({ slug: ['writing', p.slug] }))
  return [
    { slug: [] },
    { slug: ['about'] },
    { slug: ['projects'] },
    { slug: ['writing'] },
    { slug: ['story'] },
    { slug: ['resume'] },
    { slug: ['contact'] },
    ...projects,
    ...posts,
  ]
}

export async function GET(_: Request, context: { params: Promise<{ slug?: string[] }> }) {
  const params = await context.params
  const slug = params.slug ?? []
  const pathname = `/${slug.join('/')}`.replace(/\/+$/, '') || '/'
  const markdown = getMarkdownForPath(pathname)

  if (!markdown) {
    return new Response('Not found', { status: 404 })
  }

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  })
}


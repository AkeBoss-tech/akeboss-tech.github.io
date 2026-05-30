import { getMarkdownForPath } from '@/lib/llm'

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


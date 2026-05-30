import { buildLlmsIndex } from '@/lib/llm'

export const dynamic = 'force-static'

export function GET() {
  return new Response(buildLlmsIndex(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}

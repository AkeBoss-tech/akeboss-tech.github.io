import { buildLlmsFull } from '@/lib/llm'

export function GET() {
  return new Response(buildLlmsFull(), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}

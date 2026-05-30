import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { ResponsiveImage } from '@/components/responsive-image'

function fallbackImageAlt(src?: string) {
  if (!src) return 'Content image'

  const rawName = src.split('/').pop()?.split('?')[0]?.split('#')[0] ?? 'content-image'
  const withoutExtension = rawName.replace(/\.[a-z0-9]+$/i, '')
  const cleaned = withoutExtension.replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim()

  if (!cleaned) return 'Content image'
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1)
}

export function Markdown({ content, className }: { content: string; className?: string }) {
  return (
    <div className={`prose prose-neutral max-w-none ${className ?? ''}`.trim()}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeRaw,
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'append' }],
        ]}
        components={{
          iframe: (props) => <div className="media-frame my-8 aspect-video"><iframe {...(props as any)} className="h-full w-full" /></div>,
          img: (props) => (
            <ResponsiveImage
              src={typeof props.src === 'string' ? props.src : ''}
              alt={props.alt?.trim() || fallbackImageAlt(typeof props.src === 'string' ? props.src : undefined)}
              className="my-8 h-auto w-full"
              sizes="(max-width: 1024px) 92vw, 64rem"
              loading="lazy"
            />
          ),
          a: (props) => <a {...props} target={String(props.href).startsWith('http') ? '_blank' : undefined} rel="noreferrer" />,
          h2: (props) => <h2 {...props} className="group scroll-mt-28" />,
          h3: (props) => <h3 {...props} className="group scroll-mt-28" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}

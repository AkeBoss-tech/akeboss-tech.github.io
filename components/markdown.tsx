import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

export function Markdown({ content }: { content: string }) {
  return (
    <div className="prose prose-neutral max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeRaw,
          rehypeSlug,
          [rehypeAutolinkHeadings, { behavior: 'append' }],
        ]}
        components={{
          iframe: (props) => <div className="media-frame my-8 aspect-video"><iframe {...(props as any)} className="h-full w-full" /></div>,
          img: (props) => <img {...props} alt={props.alt ?? ''} className="my-8 h-auto w-full" />,
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

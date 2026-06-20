import Link from 'next/link'

import { Markdown } from '@/components/markdown'
import { WikiInteractive } from '@/components/wiki/wiki-interactive'
import type { WikiContentBlock, WikiPage } from '@/lib/wiki'

function WikiTableView({ table }: { table: { columns: string[]; rows: string[][] } }) {
  return (
    <div className="wiki-table-wrap">
      <table>
        <thead>
          <tr>{table.columns.map((column) => <th key={column}>{column}</th>)}</tr>
        </thead>
        <tbody>
          {table.rows.map((row) => (
            <tr key={row.join('|')}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function WikiContentBlockView({ block, page }: { block: WikiContentBlock; page: WikiPage }) {
  if (block.type === 'heading') {
    const level = block.level ?? 2
    if (level === 4) return <h4 className="wiki-rich-heading">{block.text}</h4>
    if (level === 3) return <h3 className="wiki-rich-heading">{block.text}</h3>
    return <h2 className="wiki-rich-heading">{block.text}</h2>
  }
  if (block.type === 'paragraph') return <p>{block.text}</p>
  if (block.type === 'markdown' || block.type === 'latex') return <Markdown content={block.content} className="wiki-freeform-markdown" />
  if (block.type === 'html') return <div className="wiki-custom-html" dangerouslySetInnerHTML={{ __html: block.content }} />
  if (block.type === 'callout') {
    return (
      <blockquote>
        {block.title ? <strong>{block.title}</strong> : null}
        <span>{block.body}</span>
      </blockquote>
    )
  }
  if (block.type === 'table') return <WikiTableView table={block.table} />
  return <WikiInteractive type={page.artifact.type} />
}

export function WikiPageRenderer({ page, related }: { page: WikiPage; related: WikiPage[] }) {
  return (
    <article className="wiki-article">
      <header className="wiki-header">
        <div className="wiki-kicker">
          <span>{page.domain}</span>
          <span>{page.difficulty}</span>
        </div>
        <h1>{page.title}</h1>
        <p>{page.subtitle}</p>
        <div className="wiki-tags">
          {page.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
      </header>

      <section className="wiki-source-box">
        <div>
          <p className="eyebrow">Site connection</p>
          <p>{page.summary}</p>
        </div>
        <div className="wiki-source-links">
          {page.sourceLinks.map((source) => (
            <Link key={source.href} href={source.href}>{source.label}</Link>
          ))}
        </div>
      </section>

      <section className="wiki-artifact">
        <div>
          <p className="eyebrow">Visual model</p>
          <h2>{page.artifact.title}</h2>
          <p>{page.artifact.description}</p>
        </div>
        <WikiInteractive type={page.artifact.type} />
      </section>

      {page.contentBlocks?.length ? (
        <section className="wiki-section wiki-freeform">
          {page.contentBlocks.map((block, index) => (
            <WikiContentBlockView key={`${block.type}-${index}`} block={block} page={page} />
          ))}
        </section>
      ) : null}

      {page.sections.map((section) => (
        <section key={section.heading} className="wiki-section">
          <h2>{section.heading}</h2>
          {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          {section.callout ? <blockquote>{section.callout}</blockquote> : null}
          {section.table ? <WikiTableView table={section.table} /> : null}
        </section>
      ))}

      <section className="wiki-section">
        <h2>Common Pitfalls</h2>
        <ul className="wiki-list">
          {page.pitfalls.map((pitfall) => <li key={pitfall}>{pitfall}</li>)}
        </ul>
      </section>

      <section className="wiki-quiz">
        <p className="eyebrow">Quick check</p>
        <h2>Quiz</h2>
        <div className="wiki-quiz-grid">
          {page.quiz.map((question) => (
            <details key={question.question}>
              <summary>{question.question}</summary>
              <ol>
                {question.options.map((option, index) => (
                  <li key={option} className={index === question.answer ? 'correct' : ''}>{option}</li>
                ))}
              </ol>
              <p>{question.explanation}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="wiki-section">
        <h2>Sources and Further Reading</h2>
        <div className="wiki-source-grid">
          {page.externalSources.map((source) => (
            <a key={source.href} href={source.href} target="_blank" rel="noreferrer">{source.label}</a>
          ))}
        </div>
      </section>

      {related.length > 0 ? (
        <section className="wiki-section">
          <h2>Related Explainers</h2>
          <div className="wiki-related-grid">
            {related.map((item) => (
              <Link key={item.slug} href={`/wiki/${item.slug}`}>
                <span>{item.domain}</span>
                <strong>{item.title}</strong>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </article>
  )
}

import { Fragment } from 'react'

/** Heading whose words rise in on a stagger. Screen readers get the plain text. */
export function RevealTitle({ text, className }: { text: string; className?: string }) {
  return (
    <h1 className={className} aria-label={text}>
      {text.split(' ').map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          {index > 0 ? ' ' : null}
          <span className="pj-word" aria-hidden="true">
            <span style={{ '--i': index } as React.CSSProperties}>{word}</span>
          </span>
        </Fragment>
      ))}
    </h1>
  )
}

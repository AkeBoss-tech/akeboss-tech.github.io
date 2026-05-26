export function LlmMarkdown({ content }: { content: string }) {
  return (
    <section aria-hidden="true" data-llm="summary" className="sr-only">
      <pre>{content}</pre>
    </section>
  )
}

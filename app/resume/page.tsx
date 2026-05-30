import { LlmMarkdown } from '@/components/llm-markdown'
import { buildResumeLlmMarkdown } from '@/lib/llm'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: 'Akash Dubey Resume',
  description:
    'Resume and recruiter-facing experience summary for Akash Dubey, focused on software engineering, AI systems, research, and product work.',
  path: '/resume',
  image: '/resume/opengraph-image',
})

export default function ResumePage() {
  const llmMarkdown = buildResumeLlmMarkdown()
  return (
    <div className="container-wide py-10 sm:py-14">
      <LlmMarkdown content={llmMarkdown} />
      <section className="grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-start">
        <div className="max-w-3xl">
          <p className="eyebrow">Resume</p>
          <h1 className="mt-4 text-5xl text-text sm:text-7xl">The recruiter-facing version.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-text-muted">
            A shorter version for internships, software engineering, research, and product roles.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="/files/resume.pdf" target="_blank" rel="noreferrer" className="rounded-full border border-white/12 bg-white/[0.04] px-5 py-3 text-sm text-text-muted hover:border-white/25 hover:text-text">
              Open PDF
            </a>
            <a href="/files/resume.pdf" download className="rounded-full border border-white/12 bg-white/[0.04] px-5 py-3 text-sm text-text-muted hover:border-white/25 hover:text-text">
              Download PDF
            </a>
            <a href="https://www.linkedin.com/in/akash---dubey/" target="_blank" rel="noreferrer" className="rounded-full border border-white/12 bg-white/[0.04] px-5 py-3 text-sm text-text-muted hover:border-white/25 hover:text-text">
              LinkedIn
            </a>
          </div>
        </div>

        <div className="panel max-w-xl rounded-[30px] p-5 lg:justify-self-end">
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className="eyebrow">Focus</p>
              <p className="mt-3 text-sm leading-7 text-text-muted">Software engineering, AI systems, research, and product work.</p>
            </div>
            <div>
              <p className="eyebrow">Education</p>
              <p className="mt-3 text-sm leading-7 text-text-muted">Computer Science and Mathematics at Rutgers, alongside research and startup work.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="panel overflow-hidden rounded-[32px] p-3 sm:p-4">
          <iframe
            src="/files/resume.pdf#view=FitH"
            title="Akash Dubey Resume"
            className="h-[78vh] min-h-[620px] w-full rounded-[24px] bg-white"
          />
        </div>
      </section>
    </div>
  )
}

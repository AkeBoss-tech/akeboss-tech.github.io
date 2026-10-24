import fs from 'node:fs'
import path from 'node:path'

import { LlmMarkdown } from '@/components/llm-markdown'
import { RevealTitle } from '@/components/reveal-title'
import { ResumeLink } from '@/components/resume-link'
import { buildResumeLlmMarkdown } from '@/lib/llm'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: 'Akash Dubey Resume',
  description:
    'Resume and recruiter-facing experience summary for Akash Dubey, focused on software engineering, AI systems, research, and product work.',
  path: '/resume',
  image: '/resume/opengraph-image',
})

// Page previews are rendered from files/resume.pdf by scripts/build-resume-preview.swift.
const previewDir = path.join(process.cwd(), 'images/resume')

function getPreviewPages() {
  try {
    return fs
      .readdirSync(previewDir)
      .filter((file) => /^resume-page-\d+\.jpg$/.test(file))
      .sort((a, b) => Number(a.match(/\d+/)?.[0]) - Number(b.match(/\d+/)?.[0]))
      .map((file) => `/images/resume/${file}`)
  } catch {
    return []
  }
}

export default function ResumePage() {
  const llmMarkdown = buildResumeLlmMarkdown()
  const pages = getPreviewPages()

  return (
    <div className="resume-page container-wide py-10 sm:py-14">
      <LlmMarkdown content={llmMarkdown} />

      <header className="resume-header">
        <p className="pj-meta">
          <span>Resume</span>
          {pages.length ? <span>{pages.length} pages</span> : null}
        </p>
        <RevealTitle text="Software, AI, and research, on paper." className="resume-title" />
        <p className="pj-lede">Rutgers CS + Math, May 2027. Recent: applied AI at New York Life, Scarlet Sync, Lykke.</p>
        <div className="pj-actions">
          <ResumeLink source="resume_page" download className="pj-btn pj-btn-primary">
            Download PDF ↓
          </ResumeLink>
          <ResumeLink source="resume_page" className="pj-btn">
            Open in new tab ↗
          </ResumeLink>
          <a href="https://www.linkedin.com/in/akash---dubey/" target="_blank" rel="noreferrer" className="pj-btn">
            LinkedIn ↗
          </a>
        </div>
      </header>

      {pages.length ? (
        <section className="resume-sheets" aria-label="Resume preview">
          {pages.map((src, index) => (
            <ResumeLink key={src} source="resume_page" className="resume-sheet reveal">
              <img
                src={src}
                alt={`Resume page ${index + 1} of ${pages.length}`}
                width={1400}
                height={1811}
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding="async"
              />
              <span className="resume-sheet-label">Page {index + 1}</span>
            </ResumeLink>
          ))}
        </section>
      ) : (
        <section className="resume-sheets">
          <iframe src="/files/resume.pdf#view=FitH" title="Akash Dubey Resume" className="resume-frame" />
        </section>
      )}
    </div>
  )
}

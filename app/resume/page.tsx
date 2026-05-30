import { ContactIconLinks } from '@/components/contact-icon-links'
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

// Shared data from CV or could be abstracted to a content file
const education = [
  {
    school: 'Rutgers University',
    degree: 'B.S. in Computer Science and Mathematics',
    dates: 'Sep 2024 - May 2027',
    details: 'GPA: 4.0 | Minor in Quantitative Economics | Honors College',
  },
]

const experience = [
  {
    company: 'New York Life Insurance',
    role: 'Incoming Software Engineering Intern',
    dates: 'May 2026 - Aug 2026',
    bullets: [
      'Preparing for production-scale systems development and applied data engineering.',
    ],
  },
  {
    company: 'Scarlet Sync',
    role: 'Founder',
    dates: 'Jan 2025 - Present',
    bullets: [
      'Built a Rutgers scheduling product used by hundreds of students.',
      'Created AI ingestion pipelines for legacy university course systems.',
    ],
  },
  {
    company: 'Lykke',
    role: 'Software Engineer',
    dates: 'Sep 2025 - Present',
    bullets: [
      'Developing browser-side RAG and Canvas-connected study tools.',
      'Built local WebGPU-powered retrieval workflows for private AI use.',
    ],
  },
]

const research = [
  {
    lab: 'Rutgers Economics Labs',
    role: 'President',
    dates: 'Oct 2024 - Present',
    bullets: [
      'Leading quantitative research for NJ state agencies and U.S. Census Bureau.',
      'Using Python and R for econometrics, budget scraping, and forecasting.',
    ],
  },
  {
    lab: 'Rutgers CS / ARC Lab',
    role: 'Research Assistant',
    dates: 'Jan 2026 - Present',
    bullets: [
      'Studying second-order optimization and CUDA-based motion planning.',
      'Exploring vision-language-action (VLA) models for robotics.',
    ],
  },
]

const skills = 'Python, C++, CUDA, TypeScript, R, SQL, React, PyTorch, LLMs, Robotics, Data Science'

export default function ResumePage() {
  const llmMarkdown = buildResumeLlmMarkdown()
  
  return (
    <div className="container-wide py-10 sm:py-14">
      <LlmMarkdown content={llmMarkdown} />
      
      {/* Web Header - Hidden in PDF */}
      <section className="no-print mb-12 grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-start">
        <div className="max-w-3xl">
          <p className="eyebrow">Resume</p>
          <h1 className="mt-4 text-5xl text-text sm:text-7xl">The recruiter-facing version.</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-text-muted">
            A shorter version for internships, software engineering, research, and product roles.
            This page automatically syncs with the PDF version.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="/files/resume.pdf" target="_blank" rel="noreferrer" className="rounded-full border border-white/12 bg-white/[0.04] px-5 py-3 text-sm text-text-muted hover:border-white/25 hover:text-text">
              Open PDF
            </a>
            <a href="/files/resume.pdf" download className="rounded-full border border-white/12 bg-white/[0.04] px-5 py-3 text-sm text-text-muted hover:border-white/25 hover:text-text">
              Download PDF
            </a>
          </div>
        </div>

        <div className="panel max-w-xl rounded-[30px] p-5 lg:justify-self-end">
          <p className="eyebrow">Sync Status</p>
          <p className="mt-3 text-sm leading-7 text-text-muted">
            The PDF version is automatically re-generated from this code on every update.
          </p>
        </div>
      </section>

      {/* Actual Resume Content - Captured by PDF Sync */}
      <article className="resume-paper mx-auto max-w-[800px] rounded-[32px] border border-white/8 bg-white/[0.02] p-8 shadow-2xl sm:p-12">
        {/* Contact Info */}
        <header className="border-b border-white/10 pb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-text sm:text-5xl">Akash Dubey</h1>
          <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm text-text-muted">
            <span>Berkeley Heights, NJ</span>
            <span>•</span>
            <span>212-814-3681</span>
            <span>•</span>
            <a href="mailto:akash.dubey@rutgers.edu" className="hover:text-text">akash.dubey@rutgers.edu</a>
          </div>
          <div className="mt-3 flex justify-center">
            <ContactIconLinks className="flex-row gap-4" />
          </div>
        </header>

        {/* Education */}
        <section className="mt-10">
          <h2 className="eyebrow text-accent">Education</h2>
          <div className="mt-4 space-y-6">
            {education.map((edu) => (
              <div key={edu.school}>
                <div className="flex justify-between font-medium">
                  <span className="text-lg text-text">{edu.school}</span>
                  <span className="text-sm text-text-soft">{edu.dates}</span>
                </div>
                <div className="text-sm text-text-muted">{edu.degree}</div>
                <div className="mt-1 text-sm text-accent/80 font-mono">{edu.details}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section className="mt-10">
          <h2 className="eyebrow text-[#d8b4fe]">Experience</h2>
          <div className="mt-4 space-y-8">
            {experience.map((job) => (
              <div key={job.company}>
                <div className="flex justify-between font-medium">
                  <span className="text-lg text-text">{job.company}</span>
                  <span className="text-sm text-text-soft">{job.dates}</span>
                </div>
                <div className="text-sm text-[#d8b4fe]">{job.role}</div>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-text-muted">
                  {job.bullets.map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Research */}
        <section className="mt-10">
          <h2 className="eyebrow text-[#8be9fd]">Research</h2>
          <div className="mt-4 space-y-8">
            {research.map((res) => (
              <div key={res.lab}>
                <div className="flex justify-between font-medium">
                  <span className="text-lg text-text">{res.lab}</span>
                  <span className="text-sm text-text-soft">{res.dates}</span>
                </div>
                <div className="text-sm text-[#8be9fd]">{res.role}</div>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-text-muted">
                  {res.bullets.map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section className="mt-10 border-t border-white/10 pt-8">
          <h2 className="eyebrow text-[#84a9ff]">Skills</h2>
          <p className="mt-3 text-sm leading-relaxed text-text-muted">
            {skills}
          </p>
        </section>
      </article>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          .no-print { display: none !important; }
          .resume-paper { 
            border: none !important; 
            box-shadow: none !important; 
            background: transparent !important;
            padding: 0 !important;
            margin: 0 !important;
            max-width: none !important;
          }
        }
      ` }} />
    </div>
  )
}

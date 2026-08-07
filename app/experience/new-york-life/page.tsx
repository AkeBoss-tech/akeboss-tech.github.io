import Image from 'next/image'
import Link from 'next/link'

import { LlmMarkdown } from '@/components/llm-markdown'
import { absoluteUrl, buildBreadcrumbList, buildPageMetadata, siteName } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: 'New York Life Internship',
  description:
    'Applied AI engineering work Akash Dubey built, demonstrated, and pilot-tested during a 2026 software engineering internship at New York Life.',
  path: '/experience/new-york-life',
})

const llmMarkdown = `# New York Life Software Engineering Internship

Akash Dubey worked as a Software Engineering Intern at New York Life from May 26 through August 6, 2026, focusing primarily on applied AI engineering.

## Demonstrated work

- Designed an asynchronous claims-assistance prototype across web, phone, and SMS.
- Demonstrated public questions, service procedures, authentication transitions, claim intake, form submission, and document handling across web and phone.
- Built trust-focused skills, citations, scoped data access, evaluation, failure recovery, human escalation, and graceful call completion.
- Built authorized-source knowledge workflows and read-only developer discovery tools.
- Helped pilot a design-to-code workflow with implementation, preview, and visual verification.

This page distinguishes built and tested work from pilots and incomplete exploration. It does not claim production deployment, ROI, cost savings, or customer outcomes.`

const workstreams = [
  {
    number: '01',
    title: 'Multi-channel claims assistance',
    body: 'I independently designed an asynchronous claims-assistance prototype for web, phone, and SMS. The web and phone demo covered public questions, service procedures, authentication transitions, structured claim intake, form submission, and document upload routing and prefill.',
    note: 'Because production claims and client data were unavailable, I researched service contracts and built mock integrations plus an administrative testing interface.',
  },
  {
    number: '02',
    title: 'Trust and evaluation',
    body: 'The assistant used workflow-encoded skills, public-source citations in the web experience, user-scoped information, domain boundaries, and modality-aware behavior. I evaluated it with four claims-stage personas and LLM-as-judge testing.',
    note: 'Tool failures were designed to degrade safely, with human escalation in web and phone and a graceful way to complete calls.',
  },
  {
    number: '03',
    title: 'Knowledge workflows',
    body: 'As a side project, I built connectors over enterprise sources I was authorized to access and turned their documents into linked topic pages. A daily freshness flow identified new material, summarized it, linked back to primary sources, and refreshed relevant topics.',
    note: 'The goal was richer, traceable answers across enterprise context—not a replacement for source systems or their permissions.',
  },
  {
    number: '04',
    title: 'Developer discovery tools',
    body: 'I built a local AI-searchable knowledge base and read-only discovery tools for a large low-code rules corpus. I packaged the workflow and trained three developers to incorporate it into their own work.',
    note: 'Public details are intentionally limited to the workflow and training; internal system mechanics and corpus figures are omitted.',
  },
] as const

const developerWorkflow = [
  'A design agent combined a design, work ticket, and existing-code context into an implementation plan.',
  'A coding agent implemented, tested, and opened the work in a local preview.',
  'A verification loop compared the preview with the design and iterated on visual differences.',
] as const

const supportingWork = [
  {
    title: 'Business-analysis copilot',
    body: 'Collaborated on a Microsoft Copilot agent for requirements summaries and scoped user stories using approved enterprise context. Deeper source-repository-aware planning remained incomplete.',
  },
  {
    title: 'Document processing',
    body: 'Helped architect a pipeline for difficult form and document cases. I am not claiming production deployment or an outcome metric.',
  },
  {
    title: 'AI enablement',
    body: 'Created a practical AI and skills kickstart guide and trained colleagues across business and engineering roles.',
  },
] as const

export default function NewYorkLifeExperiencePage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: 'New York Life Software Engineering Internship',
        description: metadata.description,
        url: absoluteUrl('/experience/new-york-life'),
        author: { '@type': 'Person', name: siteName },
        datePublished: '2026-08-06',
        inLanguage: 'en-US',
      },
      buildBreadcrumbList([
        { name: 'Home', path: '/' },
        { name: 'New York Life internship', path: '/experience/new-york-life' },
      ]),
    ],
  }

  return (
    <div className="container-wide py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <LlmMarkdown content={llmMarkdown} />

      <section className="grid gap-8 lg:grid-cols-[1fr_0.72fr] lg:items-center">
        <div className="max-w-4xl">
          <Link href="/" className="eyebrow inline-flex items-center gap-2 text-text-soft hover:text-text">
            ← Back home
          </Link>
          <p className="eyebrow mt-8">Software Engineering Intern · May 26-August 6, 2026</p>
          <h1 className="mt-5 text-5xl text-text sm:text-7xl lg:text-8xl">Applied AI, built for real workflows.</h1>
          <p className="mt-7 max-w-3xl text-lg leading-8 text-text-muted sm:text-xl">
            At New York Life, I focused on turning agent concepts into demonstrable, testable systems—from
            multi-channel claims assistance to knowledge and developer workflows.
          </p>
        </div>

        <div className="panel relative min-h-72 overflow-hidden rounded-[36px] p-8 sm:min-h-96">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(37,99,235,0.3),transparent_42%)]" />
          <div className="relative flex h-full min-h-56 flex-col justify-between sm:min-h-80">
            <Image src="/company-logos/new-york-life.svg" alt="New York Life Insurance" width={190} height={96} className="h-auto w-44" priority />
            <div>
              <p className="eyebrow">Primary focus</p>
              <p className="mt-3 text-2xl leading-snug text-text">Applied AI engineering with careful trust, access, and evaluation boundaries.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-20 sm:mt-28">
        <div className="max-w-3xl">
          <p className="eyebrow">Core work</p>
          <h2 className="mt-4 text-4xl text-text sm:text-6xl">From prototype to credible demonstration.</h2>
          <p className="mt-5 text-lg leading-8 text-text-muted">
            The language here is deliberate: these systems were built and demonstrated or pilot-tested. They are not presented as production deployments or verified business impact.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {workstreams.map((stream) => (
            <article key={stream.number} className="panel rounded-[30px] p-6 sm:p-8">
              <p className="eyebrow">{stream.number}</p>
              <h3 className="mt-4 text-3xl text-text">{stream.title}</h3>
              <p className="mt-5 leading-7 text-text-muted">{stream.body}</p>
              <p className="mt-5 border-l border-white/20 pl-4 text-sm leading-6 text-text-soft">{stream.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-20 grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start sm:mt-28">
        <div className="lg:sticky lg:top-28">
          <p className="eyebrow">Capstone pilot</p>
          <h2 className="mt-4 text-4xl text-text sm:text-6xl">A skills-based design-to-code loop.</h2>
          <p className="mt-5 text-lg leading-8 text-text-muted">
            I proposed the skills approach and handled key developer-enablement pieces: integrations, local preview, and codifying the workflow. We tested it across several coding-agent environments.
          </p>
        </div>

        <div className="space-y-5">
          {developerWorkflow.map((step, index) => (
            <div key={step} className="panel-soft rounded-[28px] p-6 sm:p-8">
              <p className="eyebrow">Step {index + 1}</p>
              <p className="mt-3 text-xl leading-8 text-text">{step}</p>
            </div>
          ))}
          <div className="rounded-[28px] border border-[#84a9ff]/25 bg-[#84a9ff]/[0.07] p-6 sm:p-8">
            <p className="eyebrow text-[#84a9ff]">Controlled test observations</p>
            <div className="mt-5 grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-4xl text-text">~30 min</p>
                <p className="mt-2 leading-7 text-text-muted">Simple compositions, with 95-100% measured visual accuracy.</p>
              </div>
              <div>
                <p className="text-4xl text-text">60-70 min</p>
                <p className="mt-2 leading-7 text-text-muted">More difficult compositions in the pilot tests.</p>
              </div>
            </div>
            <p className="mt-6 text-sm leading-6 text-text-soft">These are bounded test results, not a claim of released productivity gains, organization-wide adoption, ROI, or cost savings.</p>
          </div>
        </div>
      </section>

      <section className="mt-20 sm:mt-28">
        <p className="eyebrow">Additional contributions</p>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {supportingWork.map((item) => (
            <article key={item.title} className="panel rounded-[28px] p-6">
              <h3 className="text-2xl text-text">{item.title}</h3>
              <p className="mt-4 leading-7 text-text-muted">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-20 rounded-[36px] border border-white/10 bg-white/[0.03] p-7 sm:mt-28 sm:p-10">
        <p className="eyebrow">Evidence boundary</p>
        <h2 className="mt-4 text-3xl text-text sm:text-5xl">What this page does—and does not—claim.</h2>
        <p className="mt-5 max-w-4xl text-lg leading-8 text-text-muted">
          Every capability described here was built, demonstrated, directly completed, or tested in a pilot. Exploratory avatar and representative-copilot work is intentionally omitted from the delivered work. This page does not disclose private data or system details, and it does not claim production deployment, customer outcomes, staffing impact, cost savings, or ROI.
        </p>
      </section>
    </div>
  )
}

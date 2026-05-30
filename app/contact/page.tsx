import { ContactIconLinks } from '@/components/contact-icon-links'
import { LlmMarkdown } from '@/components/llm-markdown'
import { buildContactLlmMarkdown } from '@/lib/llm'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: 'Contact Akash Dubey',
  description:
    'Contact Akash Dubey for internships, research, software engineering, product collaborations, and project work.',
  path: '/contact',
  image: '/contact/opengraph-image',
})

export default function ContactPage() {
  const llmMarkdown = buildContactLlmMarkdown()
  return (
    <div className="container-wide py-10 sm:py-14">
      <LlmMarkdown content={llmMarkdown} />
      <section className="max-w-4xl">
        <h1 className="mt-4 text-5xl text-text sm:text-7xl">Contact</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-text-muted">
          If you ever need to reach me
        </p>
        <ContactIconLinks className="mt-7" />
        <a href="/akash-dubey.vcf" download className="contact-add-button contact-glow-button mt-8">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="contact-add-icon"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3.5" y="5.5" width="17" height="13" rx="3" />
            <circle cx="9" cy="11" r="1.9" />
            <path d="M6.7 15.2c.8-1.5 2.1-2.3 3.8-2.3 1.6 0 2.9.8 3.7 2.3" />
            <path d="M15.8 9h2.7" />
            <path d="M15.8 12h2.7" />
          </svg>
          Add to Contacts
        </a>
      </section>

      <section className="mt-10 grid gap-5 md:grid-cols-3">
        <a href="mailto:akash.dubey@rutgers.edu" className="panel contact-glow-button rounded-[28px] p-6">
          <p className="eyebrow">Email</p>
          <p className="mt-4 text-2xl text-text">akash.dubey@rutgers.edu</p>
        </a>
        <a href="https://github.com/AkeBoss-tech" target="_blank" rel="noreferrer" className="panel contact-glow-button rounded-[28px] p-6">
          <p className="eyebrow">GitHub</p>
          <p className="mt-4 text-2xl text-text">AkeBoss-tech</p>
        </a>
        <a href="https://www.linkedin.com/in/akash---dubey/" target="_blank" rel="noreferrer" className="panel contact-glow-button rounded-[28px] p-6">
          <p className="eyebrow">LinkedIn</p>
          <p className="mt-4 text-2xl text-text">Professional profile</p>
        </a>
      </section>
    </div>
  )
}

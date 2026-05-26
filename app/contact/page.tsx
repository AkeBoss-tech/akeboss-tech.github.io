import { ContactIconLinks } from '@/components/contact-icon-links'
import { LlmMarkdown } from '@/components/llm-markdown'
import { buildContactLlmMarkdown } from '@/lib/llm'
import { buildPageMetadata } from '@/lib/seo'

export const metadata = buildPageMetadata({
  title: 'Contact',
  description:
    'Contact Akash Dubey for internships, research, software engineering, product collaborations, and project work.',
  path: '/contact',
  image: '/images/face.jpg',
})

export default function ContactPage() {
  const llmMarkdown = buildContactLlmMarkdown()
  return (
    <div className="container-wide py-10 sm:py-14">
      <LlmMarkdown content={llmMarkdown} />
      <section className="max-w-4xl">
        <p className="eyebrow">Contact</p>
        <h1 className="mt-4 text-5xl text-text sm:text-7xl">Open line.</h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-text-muted">
          For internships, research, product work, collaborations, or just a thoughtful note.
        </p>
        <ContactIconLinks className="mt-7" />
        <a href="/akash-dubey.vcf" download className="contact-add-button contact-glow-button mt-8">
          <span aria-hidden="true">▣</span>
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

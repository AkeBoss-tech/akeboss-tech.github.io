'use client'

import posthog from 'posthog-js'

type ResumeLinkProps = {
  children: React.ReactNode
  className?: string
  download?: boolean
  onClick?: () => void
  source: 'resume_page' | 'site_navigation'
}

export function ResumeLink({ children, className, download = false, onClick, source }: ResumeLinkProps) {
  const event = download ? 'resume_downloaded' : 'resume_opened'

  return (
    <a
      href="/files/resume.pdf"
      download={download || undefined}
      target={download ? undefined : '_blank'}
      rel={download ? undefined : 'noreferrer'}
      className={className}
      onClick={() => {
        onClick?.()
        if (posthog.__loaded) {
          posthog.capture(event, {
            source,
            file_name: 'resume.pdf',
          })
        }
      }}
    >
      {children}
    </a>
  )
}

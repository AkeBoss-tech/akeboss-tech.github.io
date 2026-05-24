export const contactLinks = [
  { label: 'Email', href: 'mailto:akash.dubey@rutgers.edu', icon: 'email' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/akash---dubey/', icon: 'linkedin' },
  { label: 'GitHub', href: 'https://github.com/AkeBoss-tech', icon: 'github' },
  { label: 'YouTube', href: 'https://www.youtube.com/@akashdubey7056', icon: 'youtube' },
  { label: 'Khan Academy', href: 'https://www.khanacademy.org/profile/Akashdube', icon: 'khan' },
  { label: 'Portfolio', href: '/', icon: 'compass' },
] as const

type ContactIcon = (typeof contactLinks)[number]['icon']

function ContactIcon({ icon }: { icon: ContactIcon }) {
  const shared = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '1.8',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  switch (icon) {
    case 'email':
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" {...shared}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="M4 7l8 6 8-6" />
        </svg>
      )
    case 'linkedin':
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" {...shared}>
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <path d="M2 9h4v12H2z" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      )
    case 'github':
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" {...shared}>
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.9a3.4 3.4 0 0 0-.9-2.6c3-.3 6.1-1.5 6.1-6.7A5.2 5.2 0 0 0 20 4.8 4.8 4.8 0 0 0 19.9 1S18.7.7 16 2.5a13.4 13.4 0 0 0-8 0C5.3.7 4.1 1 4.1 1A4.8 4.8 0 0 0 4 4.8a5.2 5.2 0 0 0-1.2 3.6c0 5.2 3.1 6.4 6.1 6.7a3.4 3.4 0 0 0-.9 2.6V22" />
        </svg>
      )
    case 'youtube':
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" {...shared}>
          <path d="M22 12s0-3.2-.4-4.7a2.5 2.5 0 0 0-1.8-1.8C18.3 5 12 5 12 5s-6.3 0-7.8.5a2.5 2.5 0 0 0-1.8 1.8C2 8.8 2 12 2 12s0 3.2.4 4.7a2.5 2.5 0 0 0 1.8 1.8C5.7 19 12 19 12 19s6.3 0 7.8-.5a2.5 2.5 0 0 0 1.8-1.8c.4-1.5.4-4.7.4-4.7Z" />
          <path d="M10 15l5-3-5-3z" />
        </svg>
      )
    case 'khan':
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" {...shared}>
          <path d="M7 4v16" />
          <path d="M17 6l-7 7" />
          <path d="M12 11l6 7" />
        </svg>
      )
    case 'compass':
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" {...shared}>
          <circle cx="12" cy="12" r="9" />
          <path d="M15.5 8.5l-2 5-5 2 2-5z" />
        </svg>
      )
  }
}

export function ContactIconLinks({ className = '' }: { className?: string }) {
  return (
    <div className={`contact-icon-row ${className}`}>
      {contactLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target={link.href.startsWith('http') ? '_blank' : undefined}
          rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
          aria-label={link.label}
          title={link.label}
        >
          <span className="sr-only">{link.label}</span>
          <ContactIcon icon={link.icon} />
        </a>
      ))}
    </div>
  )
}

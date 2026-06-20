export const contactLinks = [
  { label: 'Email', href: 'mailto:akash.dubey@rutgers.edu', icon: 'email' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/akash---dubey/', icon: 'linkedin' },
  { label: 'X', href: 'https://x.com/acachemoney', icon: 'x' },
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
    case 'x':
      return (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
          <path d="M13.86 10.47 21.15 2h-1.73l-6.33 7.35L8.04 2H2.21l7.64 11.12L2.21 22h1.73l6.68-7.76L15.96 22h5.83l-7.93-11.53Zm-2.37 2.75-.77-1.11L4.56 3.3h2.65l4.97 7.11.77 1.11 6.47 9.27h-2.65l-5.28-7.57Z" />
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
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
          <path d="M23.5 6.19a3 3 0 0 0-2.12-2.12C19.51 3.56 12 3.56 12 3.56s-7.51 0-9.38.51A3 3 0 0 0 .5 6.19C0 8.06 0 12 0 12s0 3.94.5 5.81a3 3 0 0 0 2.12 2.12c1.87.51 9.38.51 9.38.51s7.51 0 9.38-.51a3 3 0 0 0 2.12-2.12C24 15.94 24 12 24 12s0-3.94-.5-5.81ZM9.55 15.57V8.43L15.82 12l-6.27 3.57Z" />
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

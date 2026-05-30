import './globals.css'
import type { Metadata } from 'next'
import { Inconsolata } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { SiteShell } from '@/components/site-shell'
import { PostHogProvider } from '@/components/posthog-provider'
import PostHogPageView from './posthog-pageview'
import { defaultDescription, defaultOgImage, siteName, siteUrl } from '@/lib/seo'

const inconsolata = Inconsolata({ subsets: ['latin'], variable: '--font-inconsolata' })

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    siteName,
    title: siteName,
    description: defaultDescription,
    images: [
      {
        url: defaultOgImage,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteName,
    description: defaultDescription,
    images: [defaultOgImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inconsolata.variable}`}>
        <PostHogProvider>
          <ThemeProvider>
            <PostHogPageView />
            <SiteShell>{children}</SiteShell>
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  )
}

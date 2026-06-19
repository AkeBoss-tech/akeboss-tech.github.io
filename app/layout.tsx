import './globals.css'
import 'katex/dist/katex.min.css'
import type { Metadata } from 'next'
import { Inconsolata } from 'next/font/google'
import Script from 'next/script'
import { ThemeProvider } from '@/components/theme-provider'
import { SiteShell } from '@/components/site-shell'
import { PostHogProvider } from '@/components/posthog-provider'
import PostHogPageView from './posthog-pageview'
import { defaultDescription, defaultOgImage, siteName, siteUrl } from '@/lib/seo'

const inconsolata = Inconsolata({ subsets: ['latin'], variable: '--font-inconsolata' })

const GA_MEASUREMENT_ID = 'G-JJ2HKRJL6Z'

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
      <head>
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `}
        </Script>
      </head>
      <body className={`${inconsolata.variable} font-sans`}>
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

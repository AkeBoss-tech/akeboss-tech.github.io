import './globals.css'
import type { Metadata } from 'next'
import { Inconsolata } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { SiteShell } from '@/components/site-shell'

const inconsolata = Inconsolata({ subsets: ['latin'], variable: '--font-inconsolata' })

export const metadata: Metadata = {
  title: 'Akash Dubey',
  description: 'A dark, dreamlike portfolio of code, math, robotics, research, and personal building by Akash Dubey.',
  metadataBase: new URL('https://akashdubey.me'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inconsolata.variable}`}>
        <ThemeProvider>
          <SiteShell>{children}</SiteShell>
        </ThemeProvider>
      </body>
    </html>
  )
}

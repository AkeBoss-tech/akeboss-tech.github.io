import type { Metadata } from 'next'

export const siteName = 'Akash Dubey'
export const siteUrl = 'https://akashdubey.me'
export const defaultDescription =
  'Portfolio of Akash Dubey: software engineering, AI systems, robotics, math, research, and product work.'
export const defaultOgImage = '/hero-nyc.png'

function trimDescription(value: string, maxLength = 160) {
  const normalized = value.replace(/\s+/g, ' ').trim()
  if (normalized.length <= maxLength) return normalized
  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`
}

export function absoluteUrl(path = '/') {
  return new URL(path, siteUrl).toString()
}

type PageMetadataInput = {
  title: string
  description: string
  path: string
  image?: string
  type?: 'website' | 'article'
  noIndex?: boolean
}

export function buildPageMetadata({
  title,
  description,
  path,
  image = defaultOgImage,
  type = 'website',
  noIndex = false,
}: PageMetadataInput): Metadata {
  const canonical = absoluteUrl(path)
  const normalizedDescription = trimDescription(description)
  const imageUrl = absoluteUrl(image)

  return {
    title,
    description: normalizedDescription,
    alternates: {
      canonical,
    },
    openGraph: {
      type,
      url: canonical,
      title,
      description: normalizedDescription,
      siteName,
      images: [
        {
          url: imageUrl,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: normalizedDescription,
      images: [imageUrl],
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
          },
        },
  }
}

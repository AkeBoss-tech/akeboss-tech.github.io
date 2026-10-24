import type { NextConfig } from 'next'
import path from 'node:path'

const isGithubPages = process.env.GITHUB_PAGES === 'true'
const projectRoot = path.resolve('.')

const nextConfig: NextConfig = {
  output: isGithubPages ? 'export' : undefined,
  outputFileTracingRoot: projectRoot,
  experimental: {
    // Lets <ViewTransition> morph project images between the list and detail pages.
    viewTransition: true,
  },
  turbopack: {
    root: projectRoot,
  },
  images: {
    unoptimized: isGithubPages,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'yt3.googleusercontent.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'akashdubey.me' },
    ],
  },
}

export default nextConfig

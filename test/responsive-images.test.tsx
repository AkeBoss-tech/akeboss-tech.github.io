import { describe, expect, test } from 'bun:test'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { renderToStaticMarkup } from 'react-dom/server'

import { ResponsiveImage } from '../components/responsive-image'
import responsiveImages from '../lib/generated-responsive-images.json'
import { getResponsiveImageAsset, getResponsiveImageSources } from '../lib/responsive-images'

type Asset = {
  src: string
  widths: number[]
  width: number
  height: number
  placeholder: string
}

const assets = responsiveImages.assets as Asset[]
const projectRoot = process.cwd()

function sourceCandidates(src: string) {
  const normalized = src.replace(/^\//, '')
  return [path.join(projectRoot, normalized), path.join(projectRoot, 'public', normalized)]
}

function generatedVariantPath(src: string, width: number, format: 'avif' | 'webp') {
  const normalized = src.replace(/^\//, '')
  const parsed = path.parse(normalized)
  return path.join(projectRoot, 'public', 'generated-images', parsed.dir, parsed.name, `w${width}.${format}`)
}

describe('responsive image manifest', () => {
  test('contains a unique entry for every source', () => {
    expect(assets.length).toBeGreaterThan(0)
    expect(new Set(assets.map((asset) => asset.src)).size).toBe(assets.length)
  })

  test('contains valid dimensions and sorted, unique widths', () => {
    for (const asset of assets) {
      expect(asset.width).toBeGreaterThan(0)
      expect(asset.height).toBeGreaterThan(0)
      expect(asset.widths.length).toBeGreaterThan(0)
      expect(asset.widths).toEqual([...new Set(asset.widths)].sort((left, right) => left - right))
      expect(asset.widths.every((width) => width > 0 && width <= asset.width)).toBe(true)
    }
  })

  test('contains compact Bun.Image placeholders', () => {
    for (const asset of assets) {
      expect(asset.placeholder).toStartWith('data:image/webp;base64,')
      expect(asset.placeholder.length).toBeLessThan(1000)
    }
  })

  test('references source files that exist in the repository', () => {
    for (const asset of assets) {
      expect(sourceCandidates(asset.src).some(existsSync)).toBe(true)
    }
  })

  test('has an AVIF and WebP derivative for every declared width', () => {
    for (const asset of assets) {
      for (const width of asset.widths) {
        expect(existsSync(generatedVariantPath(asset.src, width, 'avif'))).toBe(true)
        expect(existsSync(generatedVariantPath(asset.src, width, 'webp'))).toBe(true)
      }
    }
  })
})

describe('responsive image helpers', () => {
  const asset = assets[0]

  test('returns manifest metadata for a known source', () => {
    expect(getResponsiveImageAsset(asset.src)).toEqual(asset)
  })

  test('builds complete AVIF and WebP source sets', () => {
    const sources = getResponsiveImageSources(asset.src)
    expect(sources).not.toBeNull()

    for (const width of asset.widths) {
      expect(sources?.avifSrcSet).toContain(`w${width}.avif ${width}w`)
      expect(sources?.webpSrcSet).toContain(`w${width}.webp ${width}w`)
    }
  })

  test('returns null for an unmanaged image', () => {
    expect(getResponsiveImageAsset('/images/not-managed.png')).toBeNull()
    expect(getResponsiveImageSources('/images/not-managed.png')).toBeNull()
  })
})

describe('ResponsiveImage', () => {
  test('renders modern sources and the generated placeholder', () => {
    const asset = assets[0]
    const html = renderToStaticMarkup(<ResponsiveImage src={asset.src} alt="Test image" />)

    expect(html).toContain('<picture>')
    expect(html).toContain('type="image/avif"')
    expect(html).toContain('type="image/webp"')
    expect(html).toContain('background-image:url(data:image/webp;base64,')
  })

  test('renders a plain image for an unmanaged source', () => {
    const html = renderToStaticMarkup(<ResponsiveImage src="/images/not-managed.png" alt="Fallback" />)

    expect(html).not.toContain('<picture>')
    expect(html).not.toContain('background-image:')
    expect(html).toContain('src="/images/not-managed.png"')
  })
})

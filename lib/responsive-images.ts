import responsiveImages from '@/lib/generated-responsive-images.json'

type ResponsiveImageAsset = {
  src: string
  widths: number[]
}

const assets = responsiveImages.assets as ResponsiveImageAsset[]
const responsiveAssetMap = new Map(assets.map((asset) => [asset.src, asset]))

function toGeneratedBasePath(src: string) {
  const normalized = src.replace(/^\//, '')
  const lastSlashIndex = normalized.lastIndexOf('/')
  const directory = lastSlashIndex >= 0 ? normalized.slice(0, lastSlashIndex) : ''
  const filename = lastSlashIndex >= 0 ? normalized.slice(lastSlashIndex + 1) : normalized
  const extensionIndex = filename.lastIndexOf('.')
  const name = extensionIndex >= 0 ? filename.slice(0, extensionIndex) : filename

  return `/generated-images/${directory ? `${directory}/` : ''}${name}`
}

function buildGeneratedVariantPath(src: string, width: number, format: 'avif' | 'webp') {
  return `${toGeneratedBasePath(src)}/w${width}.${format}`
}

export function getResponsiveImageAsset(src: string) {
  return responsiveAssetMap.get(src) ?? null
}

export function getResponsiveImageSources(src: string) {
  const asset = getResponsiveImageAsset(src)
  if (!asset) return null

  return {
    avifSrcSet: asset.widths.map((width) => `${buildGeneratedVariantPath(src, width, 'avif')} ${width}w`).join(', '),
    webpSrcSet: asset.widths.map((width) => `${buildGeneratedVariantPath(src, width, 'webp')} ${width}w`).join(', '),
  }
}

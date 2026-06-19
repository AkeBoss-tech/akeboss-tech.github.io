import { getResponsiveImageAsset, getResponsiveImageSources } from '@/lib/responsive-images'

type ResponsiveImageProps = {
  src: string
  alt: string
  className?: string
  sizes?: string
  loading?: 'eager' | 'lazy'
  decoding?: 'async' | 'auto' | 'sync'
  fetchPriority?: 'high' | 'low' | 'auto'
}

export function ResponsiveImage({
  src,
  alt,
  className,
  sizes = '100vw',
  loading = 'lazy',
  decoding = 'async',
  fetchPriority,
}: ResponsiveImageProps) {
  const responsiveSources = getResponsiveImageSources(src)
  const asset = getResponsiveImageAsset(src)

  if (!responsiveSources) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        width={asset?.width}
        height={asset?.height}
      />
    )
  }

  return (
    <picture>
      <source type="image/avif" srcSet={responsiveSources.avifSrcSet} sizes={sizes} />
      <source type="image/webp" srcSet={responsiveSources.webpSrcSet} sizes={sizes} />
      <img
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        width={asset?.width}
        height={asset?.height}
      />
    </picture>
  )
}

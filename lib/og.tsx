import fs from 'fs'
import path from 'path'
import { ImageResponse } from 'next/og'

const size = {
  width: 1200,
  height: 630,
}

type OgVariant = 'home' | 'profile' | 'showcase' | 'article' | 'resume' | 'contact' | 'timeline'

type OgCardOptions = {
  eyebrow: string
  title: string
  description?: string
  accent?: string
  variant?: OgVariant
  imagePath?: string
  tags?: string[]
  dateLabel?: string
}

function resolveAssetPath(assetPath: string) {
  const normalized = assetPath.replace(/^\//, '')
  const publicCandidate = path.join(process.cwd(), 'public', normalized)
  const imageCandidate = normalized.startsWith('images/')
    ? path.join(process.cwd(), normalized)
    : null
  const candidates = imageCandidate ? [imageCandidate, publicCandidate] : [publicCandidate]
  return candidates.find((candidate) => fs.existsSync(candidate))
}

function assetDataUri(assetPath?: string) {
  if (!assetPath) return null
  const resolved = resolveAssetPath(assetPath)
  if (!resolved) return null
  const ext = path.extname(resolved).toLowerCase()
  const mime =
    ext === '.png'
      ? 'image/png'
      : ext === '.jpg' || ext === '.jpeg'
        ? 'image/jpeg'
        : ext === '.webp'
          ? 'image/webp'
          : ext === '.avif'
            ? 'image/avif'
            : null

  if (!mime) return null

  const buffer = fs.readFileSync(resolved)
  return `data:${mime};base64,${buffer.toString('base64')}`
}

function variantAccent(variant: OgVariant) {
  switch (variant) {
    case 'profile':
      return '#9bc0ff'
    case 'showcase':
      return '#87e0c0'
    case 'article':
      return '#f2c37f'
    case 'resume':
      return '#d7c6ff'
    case 'contact':
      return '#f3a3b0'
    case 'timeline':
      return '#a8d7ff'
    default:
      return '#8eb5ff'
  }
}

function baseSurface(accent: string) {
  return {
    width: '100%',
    height: '100%',
    display: 'flex',
    background:
      'linear-gradient(180deg, rgba(252,253,255,1) 0%, rgba(243,247,252,1) 100%)',
    color: '#122334',
    position: 'relative' as const,
    overflow: 'hidden',
  }
}

function glow(accent: string, top: string, left: string, sizePx: number, opacity: number) {
  return (
    <div
      style={{
        position: 'absolute',
        top,
        left,
        width: sizePx,
        height: sizePx,
        borderRadius: 9999,
        background: accent,
        opacity,
      }}
    />
  )
}

function tagPills(tags: string[] = [], accent: string) {
  if (!tags.length) return null

  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
      {tags.slice(0, 4).map((tag) => (
        <div
          key={tag}
          style={{
            display: 'flex',
            borderRadius: 9999,
            padding: '8px 16px',
            border: `1px solid ${accent}33`,
            background: `${accent}14`,
            color: '#294761',
            fontSize: 24,
          }}
        >
          {tag}
        </div>
      ))}
    </div>
  )
}

export function renderOgCard({
  eyebrow,
  title,
  description,
  accent,
  variant = 'showcase',
  imagePath,
  tags,
  dateLabel,
}: OgCardOptions) {
  const themeAccent = accent ?? variantAccent(variant)
  const imageData = assetDataUri(imagePath)

  const body =
    variant === 'home' ? (
      <div
        style={{
          ...baseSurface(themeAccent),
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {glow(themeAccent, '-120px', '-80px', 420, 0.18)}
        {glow('#f0c7a0', '360px', '860px', 280, 0.16)}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 1030,
            padding: '64px 72px',
            borderRadius: 42,
            border: '1px solid rgba(18,35,52,0.08)',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.88), rgba(248,250,253,0.96))',
            boxShadow: '0 24px 80px rgba(73, 103, 135, 0.14)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 42 }}>
            {imageData ? (
              <img
                src={imageData}
                alt="Akash Dubey portrait"
                width={220}
                height={220}
                style={{
                  borderRadius: 9999,
                  objectFit: 'cover',
                  border: '10px solid rgba(255,255,255,0.92)',
                  boxShadow: '0 18px 48px rgba(46, 67, 92, 0.16)',
                }}
              />
            ) : null}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div
                style={{
                  display: 'flex',
                  fontSize: 82,
                  letterSpacing: '-0.08em',
                  lineHeight: 0.95,
                  fontWeight: 700,
                }}
              >
                {title}
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : (
      <div style={{ ...baseSurface(themeAccent), padding: 48 }}>
        {glow(themeAccent, '-140px', '-80px', 430, 0.18)}
        {glow('#ffffff', '420px', '930px', 160, 0.32)}
        <div
          style={{
            position: 'absolute',
            inset: 28,
            borderRadius: 40,
            border: '1px solid rgba(18,35,52,0.08)',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.86), rgba(246,249,252,0.97))',
            boxShadow: '0 28px 90px rgba(73, 103, 135, 0.14)',
          }}
        />

        <div
          style={{
            position: 'relative',
            display: 'flex',
            width: '100%',
            height: '100%',
            borderRadius: 32,
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              flex: imageData && (variant === 'showcase' || variant === 'profile') ? 1.05 : 1,
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '28px 20px 28px 20px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div
                style={{
                  display: 'flex',
                  fontSize: 24,
                  textTransform: 'uppercase',
                  letterSpacing: '0.22em',
                  color: '#60768d',
                }}
              >
                {eyebrow}
              </div>
              {dateLabel ? (
                <div
                  style={{
                    display: 'flex',
                    fontSize: 23,
                    color: '#6d8197',
                  }}
                >
                  {dateLabel}
                </div>
              ) : null}
              <div
                style={{
                  display: 'flex',
                  fontSize: variant === 'article' ? 62 : 68,
                  letterSpacing: '-0.075em',
                  lineHeight: 0.96,
                  fontWeight: 700,
                  maxWidth: imageData ? 560 : 860,
                }}
              >
                {title}
              </div>
              {description ? (
                <div
                  style={{
                    display: 'flex',
                    fontSize: 28,
                    lineHeight: 1.45,
                    color: '#41576c',
                    maxWidth: imageData ? 530 : 900,
                  }}
                >
                  {description}
                </div>
              ) : null}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {tagPills(tags, themeAccent)}
              <div
                style={{
                  display: 'flex',
                  width: 120,
                  height: 8,
                  borderRadius: 9999,
                  background: themeAccent,
                  opacity: 0.9,
                }}
              />
            </div>
          </div>

          {imageData ? (
            <div
              style={{
                display: 'flex',
                flex: variant === 'profile' ? 0.74 : 0.9,
                alignItems: 'center',
                justifyContent: 'center',
                padding: variant === 'profile' ? '14px 18px 14px 0' : '12px 16px 12px 0',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  width: '100%',
                  height: '100%',
                  borderRadius: variant === 'profile' ? 9999 : 32,
                  overflow: 'hidden',
                  border: `1px solid ${themeAccent}2e`,
                  background: 'rgba(255,255,255,0.6)',
                  boxShadow: '0 20px 50px rgba(62, 89, 116, 0.12)',
                }}
              >
                <img
                  src={imageData}
                  alt={title}
                  width="100%"
                  height="100%"
                  style={{
                    objectFit: 'cover',
                    width: '100%',
                    height: '100%',
                  }}
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    )

  return new ImageResponse(body, size)
}

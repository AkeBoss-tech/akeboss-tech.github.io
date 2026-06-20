'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useTheme } from 'next-themes'

import { ContactIconLinks } from '@/components/contact-icon-links'
import { GradientDescentBackground } from '@/components/gradient-descent-background'
import { ResponsiveImage } from '@/components/responsive-image'
import { ThemeToggle } from '@/components/theme-toggle'
import type { Project } from '@/lib/content'

type HomeYoshiSceneProps = {
  projects: Project[]
}

type HomePoint = {
  eyebrow: string
  title: string
  body: string
  href?: string
  logo?: string
  logoAlt?: string
  logos?: Array<{ src: string; alt: string }>
  image?: string
  imageAlt?: string
  gallery?: Array<{ src: string; alt: string }>
  gallerySide?: 'left' | 'right'
  galleryLayout?: 'default' | 'feature-left-stack-right'
}

type HomeGradientDescentStageProps = {
  points: HomePoint[]
  topBackgroundRef: React.RefObject<HTMLDivElement | null>
}

type PlaceMoment = {
  title: string
  description: string
  image: string
  tone: string
}

const placeMoments: PlaceMoment[] = [
  {
    title: 'Rutgers In Bloom',
    description: 'A quiet campus reset between classes.',
    image: '/images/homepage/2026-05-10/img_1596.png',
    tone: '#d7b7c4',
  },
  {
    title: 'Blue Hour Tower',
    description: 'Rutgers looking cinematic for a few minutes.',
    image: '/images/homepage/2026-05-10/img_2465.png',
    tone: '#7aa0df',
  },
  {
    title: 'Glasshouse Light',
    description: 'Greenhouse geometry and a slower kind of attention.',
    image: '/images/homepage/2026-05-10/img_4350.png',
    tone: '#8ed2b4',
  },
  {
    title: 'Atlantic Reflection',
    description: 'Ocean air as a reliable debugging tool.',
    image: '/images/homepage/2026-05-10/img_6293.png',
    tone: '#9ab6d6',
  },
  {
    title: 'City From Above',
    description: 'A reminder that systems read differently from distance.',
    image: '/images/homepage/2026-05-10/img_7075.png',
    tone: '#87aee2',
  },
  {
    title: 'Golden Gate Light',
    description: 'Bridge, fog, and orange steel doing the obvious thing.',
    image: '/images/homepage/2026-05-10/img_7197.png',
    tone: '#d2a27a',
  },
  {
    title: 'All-In Summit',
    description: 'A map pin for the moments that feel fully alive.',
    image: '/images/homepage/2026-05-24/allin1.png',
    tone: '#d6a6be',
  },
  {
    title: 'Neon Night Facade',
    description: 'A neon-lit facade that felt too good to leave unnamed.',
    image: '/images/homepage/2026-05-24/rando.png',
    tone: '#91a8d8',
  },
  {
    title: 'NVIDIA GTC',
    description: 'A nod to the robotics and VLA thread in the work.',
    image: '/images/homepage/2026-05-24/nvidia.png',
    tone: '#91c777',
  },
  {
    title: 'Foglit Trees',
    description: 'Fog, backlight, and a frame that works because it stays quiet.',
    image: '/images/homepage/2026-05-24/glum.png',
    tone: '#7f94b4',
  },
  {
    title: 'Rutgers After Rain',
    description: 'Campus with a little extra atmosphere still hanging around.',
    image: '/images/homepage/2026-05-24/postru.png',
    tone: '#8ca8c8',
  },
  {
    title: 'U.S. Capitol',
    description: 'A cleaner title for a landmark that does not need abbreviation.',
    image: '/images/homepage/2026-05-24/dc.png',
    tone: '#c7b18a',
  },
  {
    title: 'SR-71 Blackbird',
    description: 'A museum stop with a machine that earns the center of the frame.',
    image: '/images/homepage/2026-05-24/plane.png',
    tone: '#8eb0d8',
  },
  {
    title: 'Lakeside Pavilion',
    description: 'Pastel water and a shoreline pavilion right at dusk.',
    image: '/images/homepage/2026-05-24/lakeb.png',
    tone: '#8aa8d1',
  },
  {
    title: 'Chicago',
    description: 'Big-grid energy and a city that reads like a system.',
    image: '/images/homepage/2026-05-24/chicago.png',
    tone: '#92a4bf',
  },
  {
    title: 'Beach Bloom',
    description: 'Color, water, and a softer edge to the scene.',
    image: '/images/homepage/2026-05-24/beach_bloom.png',
    tone: '#d4b1c4',
  },
  {
    title: 'Beach One',
    description: 'Salt air and the kind of space that clears the stack.',
    image: '/images/homepage/2026-05-24/beach1.png',
    tone: '#9eb8d6',
  },
  {
    title: 'Sunset in Florida',
    description: 'Clean lines and a sky that already feels diagrammed.',
    image: '/images/homepage/2026-05-24/vecsky.png',
    tone: '#97b7df',
  },
  {
    title: 'Rutgers Road',
    description: 'A campus path that feels more symbolic than literal.',
    image: '/images/homepage/2026-05-24/ruroad.png',
    tone: '#9cb58e',
  },
  {
    title: 'Hoover Tower',
    description: 'A landmark where the architecture is strong enough to be specific.',
    image: '/images/homepage/2026-05-24/cool-building.png',
    tone: '#b9b4cc',
  },
  {
    title: 'San Francisco Streetcar',
    description: 'Streetcar tracks and a downhill city frame that finally gets named.',
    image: '/images/homepage/2026-05-24/1073.png',
    tone: '#b39dcb',
  },
  {
    title: 'Bay Bridge View',
    description: 'Water, steel, and a cleaner label than the original placeholder.',
    image: '/images/homepage/2026-05-24/kali.png',
    tone: '#b79fc6',
  },
]

const visiblePlaceCount = 8

function shufflePlaces(places: PlaceMoment[]) {
  const shuffled = [...places]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1))
    const currentPlace = shuffled[index]
    shuffled[index] = shuffled[swapIndex]
    shuffled[swapIndex] = currentPlace
  }

  return shuffled
}

function TimelinePoint({ point, align }: { point: HomePoint; align: 'left' | 'right' }) {
  const [expandedImage, setExpandedImage] = useState<{ src: string; alt: string } | null>(null)
  const cardFirst = align === 'left'
  const primaryImage = point.gallery?.[0]
  const secondaryImages = point.gallery?.slice(1) ?? []
  const visual = primaryImage ? (
    <button
      type="button"
      className="gd-image-wrap gd-image-wrap-feature-panel"
      onClick={() => setExpandedImage(primaryImage)}
      aria-label={`Expand ${primaryImage.alt}`}
    >
      <ResponsiveImage src={primaryImage.src} alt={primaryImage.alt} sizes="(max-width: 1024px) 92vw, 38rem" />
    </button>
  ) : point.image ? (
    <button
      type="button"
      className="gd-image-wrap gd-image-wrap-feature-panel"
      onClick={() => setExpandedImage({ src: point.image!, alt: point.imageAlt || point.title })}
      aria-label={`Expand ${point.imageAlt || point.title}`}
    >
      <ResponsiveImage src={point.image} alt={point.imageAlt || point.title} sizes="(max-width: 1024px) 92vw, 38rem" />
    </button>
  ) : (
    <div className="gd-visual-placeholder" aria-hidden="true" />
  )
  const hasInlineLogo = Boolean(point.logo && !point.logos?.length)
  const card = (
    <div className="gd-card">
      <div className={`gd-card-header ${hasInlineLogo ? 'gd-card-header-inline-logo' : ''}`}>
        {hasInlineLogo ? (
          <div className="gd-card-logo gd-card-logo-inline">
            <ResponsiveImage src={point.logo!} alt={point.logoAlt || `${point.title} logo`} sizes="64px" />
          </div>
        ) : null}
        <p className="gd-eyebrow">{point.eyebrow}</p>
        {point.logos?.length ? (
          <div className="gd-card-logos">
            {point.logos.map((logo) => (
              <div key={logo.src} className="gd-card-logo gd-card-logo-inline">
                <ResponsiveImage src={logo.src} alt={logo.alt} sizes="64px" />
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <h2>{point.title}</h2>
      <p>{point.body}</p>
      {point.href ? <a href={point.href}>Open details ↗</a> : null}
    </div>
  )

  return (
    <>
    <article className={`gd-row ${align} gd-row-feature-full`}>
      <div className="gd-content gd-content-gallery-feature-left">
        <div className={`gd-feature-split ${cardFirst ? 'gd-feature-split-card-first' : 'gd-feature-split-visual-first'}`}>
            <div className="gd-feature-top">
              {cardFirst ? (
                <>
                  {card}
                  {visual}
                </>
              ) : (
                <>
                  {visual}
                  {card}
                </>
              )}
            </div>
            {secondaryImages.length ? (
              <div className="gd-feature-bottom">
                {cardFirst ? (
                  <>
                    <div className="gd-image-gallery gd-image-gallery-secondary">
                      {secondaryImages.map((image) => (
                        <button
                          key={image.src}
                          type="button"
                          className="gd-image-wrap"
                          onClick={() => setExpandedImage(image)}
                          aria-label={`Expand ${image.alt}`}
                        >
                          <ResponsiveImage src={image.src} alt={image.alt} sizes="(max-width: 1024px) 44vw, 18rem" />
                        </button>
                      ))}
                    </div>
                    <div aria-hidden="true" />
                  </>
                ) : (
                  <>
                    <div aria-hidden="true" />
                    <div className="gd-image-gallery gd-image-gallery-secondary">
                      {secondaryImages.map((image) => (
                        <button
                          key={image.src}
                          type="button"
                          className="gd-image-wrap"
                          onClick={() => setExpandedImage(image)}
                          aria-label={`Expand ${image.alt}`}
                        >
                          <ResponsiveImage src={image.src} alt={image.alt} sizes="(max-width: 1024px) 44vw, 18rem" />
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            ) : null}
          </div>
      </div>
    </article>
    {expandedImage ? (
      <div
        className="visual-journal-lightbox"
        role="dialog"
        aria-modal="true"
        aria-label={expandedImage.alt}
        onClick={() => setExpandedImage(null)}
      >
        <div className="visual-journal-lightbox-inner" onClick={(event) => event.stopPropagation()}>
          <button
            type="button"
            className="visual-journal-lightbox-close"
            onClick={() => setExpandedImage(null)}
            aria-label="Close expanded image"
          >
            <span aria-hidden="true">×</span>
          </button>
          <ResponsiveImage src={expandedImage.src} alt={expandedImage.alt} sizes="92vw" />
        </div>
      </div>
    ) : null}
    </>
  )
}

function IntroHero() {
  const introTitle = 'Akash Dubey'
  const [typedIntroLength, setTypedIntroLength] = useState(0)

  useEffect(() => {
    if (typeof window === 'undefined') return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTypedIntroLength(introTitle.length)
      return
    }

    setTypedIntroLength(0)
    let index = 0
    const timer = window.setInterval(() => {
      index += 1
      setTypedIntroLength(index)
      if (index >= introTitle.length) {
        window.clearInterval(timer)
      }
    }, 85)

    return () => window.clearInterval(timer)
  }, [])

  return (
    <section className="home-intro-hero">
      <div className="home-intro-copy">
        <h1 className="home-intro-title" aria-label={introTitle}>
          <span className="home-intro-title-ghost" aria-hidden="true">{introTitle}</span>
          <span className="home-intro-title-live">
            {introTitle.slice(0, typedIntroLength)}
            {typedIntroLength < introTitle.length ? (
              <span className="home-intro-caret" aria-hidden="true" />
            ) : null}
          </span>
        </h1>
        <p>Building product, AI systems, and research tools from Rutgers.</p>
        <a href="#visual-notes" className="home-intro-down" aria-label="Scroll to visual notes">
          <span aria-hidden="true">↓</span>
        </a>
      </div>

      <div className="home-portrait-frame">
        <ResponsiveImage
          src="/images/homepage/2026-05-29/better-akash-enhanced.png"
          alt="Akash Dubey"
          sizes="(max-width: 640px) 82vw, 28rem"
          loading="eager"
          fetchPriority="high"
        />
      </div>
    </section>
  )
}

function PlacesSection() {
  const sectionRef = useRef<HTMLElement | null>(null)
  const [places, setPlaces] = useState(placeMoments)
  const [showAllPlaces, setShowAllPlaces] = useState(false)
  const [expandedPlace, setExpandedPlace] = useState<PlaceMoment | null>(null)
  const visiblePlaces = showAllPlaces ? places : places.slice(0, visiblePlaceCount)

  useEffect(() => {
    setPlaces(shufflePlaces(placeMoments))
  }, [])

  useEffect(() => {
    if (!showAllPlaces) return

    const handleScroll = () => {
      const section = sectionRef.current
      if (!section) return
      const rect = section.getBoundingClientRect()

      if (rect.bottom < window.innerHeight * 0.3) {
        setShowAllPlaces(false)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [showAllPlaces])

  useEffect(() => {
    if (!expandedPlace) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setExpandedPlace(null)
    }

    document.body.style.overflow = 'hidden'
    document.body.classList.add('visual-journal-expanded')
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      document.body.classList.remove('visual-journal-expanded')
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [expandedPlace])

  return (
    <section id="visual-notes" ref={sectionRef} className="places-section">
      <div className="visual-journal">
        {showAllPlaces ? (
          <button
            type="button"
            className="visual-journal-collapse"
            onClick={() => setShowAllPlaces(false)}
            aria-label="Collapse visual notes"
          >
            <span aria-hidden="true">↑</span>
          </button>
        ) : null}
        <div className="visual-journal-grid" aria-label="Photo grid">
          {visiblePlaces.map((place, index) => (
            <button
              key={place.image}
              type="button"
              className={`visual-journal-card visual-journal-card-${(index % 10) + 1} ${showAllPlaces && index >= visiblePlaceCount ? 'visual-journal-card-reveal' : ''}`}
              onClick={() => setExpandedPlace(place)}
              aria-label={`Expand ${place.title}`}
            >
              <ResponsiveImage
                src={place.image}
                alt={place.title}
                sizes="(max-width: 640px) 42vw, (max-width: 1024px) 28vw, 16rem"
                loading={index > 5 ? 'lazy' : 'eager'}
              />
              <span className="visual-journal-card-caption">
                <span>{place.title}</span>
              </span>
            </button>
          ))}
        </div>

        <div className="visual-journal-actions">
          {!showAllPlaces ? (
            <button type="button" className="visual-journal-more" onClick={() => setShowAllPlaces(true)}>
              See more
            </button>
          ) : (
            <button type="button" className="visual-journal-less" onClick={() => setShowAllPlaces(false)}>
              Show less
            </button>
          )}
        </div>
      </div>

      {expandedPlace ? (
        <div
          className="visual-journal-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={expandedPlace.title}
          onClick={() => setExpandedPlace(null)}
        >
          <div className="visual-journal-lightbox-inner" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="visual-journal-lightbox-close"
              onClick={() => setExpandedPlace(null)}
              aria-label="Close expanded image"
            >
              <span aria-hidden="true">×</span>
            </button>
            <ResponsiveImage src={expandedPlace.image} alt={expandedPlace.title} sizes="92vw" />
            <div className="visual-journal-lightbox-caption">
              <h2>{expandedPlace.title}</h2>
              <p>{expandedPlace.description}</p>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}

function HomeGradientDescentStage({ points, topBackgroundRef }: HomeGradientDescentStageProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const sectionRef = useRef<HTMLElement | null>(null)
  const heroRef = useRef<HTMLElement | null>(null)
  const gradientRef = useRef<HTMLDivElement | null>(null)
  const endLinksRef = useRef<HTMLElement | null>(null)
  const scrollLabelRef = useRef<HTMLDivElement | null>(null)
  const [typedHeadlineLength, setTypedHeadlineLength] = useState(0)
  const headlineText = 'What I’m working on now.'
  const { resolvedTheme } = useTheme()
  const currentTheme = resolvedTheme === 'light' ? 'light' : 'dark'

  useEffect(() => {
    const canvas = canvasRef.current
    const section = sectionRef.current
    if (!canvas || !section || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const stageCanvas = canvas
    const stage = section

    let disposed = false
    let animationFrame = 0
    const cleanupCallbacks: Array<() => void> = []

    async function start() {
      const THREE = await import('three')
      if (disposed) return
      const palette = currentTheme === 'light'
        ? {
            ambient: 1,
            directional: 2.02,
            fillOpacity: 0.26,
            wireOpacity: 0.48,
            emissive: '#122318',
            arrowBoost: 0.92,
            pointColor: '#112015',
            stageGradientOpacity: 0.82,
            heightColor: (y: number, saturation = 0.58, lightness = 0.66) => {
              const normalized = THREE.MathUtils.clamp((y + 6) / 12, 0, 1)
              return new THREE.Color().setHSL(0.01 + normalized * 0.31, 0.84, 0.54 - normalized * 0.16)
            },
          }
        : {
            ambient: 0.9,
            directional: 2.2,
            fillOpacity: 0.055,
            wireOpacity: 0.28,
            emissive: '#ffffff',
            arrowBoost: 0.85,
            pointColor: '#ffffff',
            stageGradientOpacity: 1,
            heightColor: (y: number, saturation = 0.9, lightness = 0.55) => {
              const normalized = THREE.MathUtils.clamp((y + 6) / 12, 0, 1)
              return new THREE.Color().setHSL(0.72 - normalized * 0.45, saturation, lightness)
            },
          }

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(44, window.innerWidth / window.innerHeight, 0.1, 1200)
      camera.position.set(0, 27, 36)

      const renderer = new THREE.WebGLRenderer({ canvas: stageCanvas, antialias: true, alpha: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setClearColor(0x000000, 0)

      scene.add(new THREE.AmbientLight(0xffffff, palette.ambient))

      const light = new THREE.DirectionalLight(0xffffff, palette.directional)
      light.position.set(10, 34, 20)
      scene.add(light)

      const world = new THREE.Group()
      scene.add(world)

      const surfaceSize = 92
      const surfaceSegments = 220
      const functionScale = 50 / surfaceSize
      const surfaceLift = 0.08

      function f(x: number, z: number) {
        const sx = x * functionScale
        const sz = z * functionScale
        return Math.sin(sx * 0.28) * Math.cos(sz * 0.33) * 4 + Math.sin(sz * 0.15) * 1.8 + 0.015 * (sx * sx + sz * sz)
      }

      function gradientAt(x: number, z: number) {
        const eps = 0.04
        return {
          dx: (f(x + eps, z) - f(x - eps, z)) / (eps * 2),
          dz: (f(x, z + eps) - f(x, z - eps)) / (eps * 2),
        }
      }

      function surfacePoint(x: number, z: number, lift = 0) {
        return new THREE.Vector3(x, f(x, z) + lift, z)
      }

      function downhillDirection(x: number, z: number) {
        const g = gradientAt(x, z)
        const step = 1.15
        return surfacePoint(x - g.dx * step, z - g.dz * step).sub(surfacePoint(x, z)).normalize()
      }

      function setMaterialOpacity(material: import('three').Material | import('three').Material[], opacity: number) {
        const materials = Array.isArray(material) ? material : [material]
        materials.forEach((item) => {
          item.transparent = true
          item.opacity = opacity
        })
      }

      const geo = new THREE.PlaneGeometry(surfaceSize, surfaceSize, surfaceSegments, surfaceSegments)
      const pos = geo.attributes.position
      const colors: number[] = []

      for (let i = 0; i < pos.count; i += 1) {
        const x = pos.getX(i)
        const z = pos.getY(i)
        const y = f(x, z)
        pos.setXYZ(i, x, y, z)
        const color = palette.heightColor(y)
        colors.push(color.r, color.g, color.b)
      }

      pos.needsUpdate = true
      geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
      geo.computeVertexNormals()

      const fillMat = new THREE.MeshStandardMaterial({
        vertexColors: true,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: palette.fillOpacity,
        roughness: 0.9,
        metalness: 0,
      })

      const wireMat = new THREE.MeshStandardMaterial({
        vertexColors: true,
        wireframe: true,
        transparent: true,
        opacity: palette.wireOpacity,
        emissive: palette.emissive,
        emissiveIntensity: 0.28,
      })

      world.add(new THREE.Mesh(geo.clone(), fillMat))
      world.add(new THREE.Mesh(geo, wireMat))

      const arrows = new THREE.Group()
      const fieldSize = surfaceSize * 0.43
      const spacing = 2.2

      for (let x = -fieldSize; x <= fieldSize; x += spacing) {
        for (let z = -fieldSize; z <= fieldSize; z += spacing) {
          const y = f(x, z)
          const arrow = new THREE.ArrowHelper(downhillDirection(x, z), surfacePoint(x, z, surfaceLift), 1.15, palette.heightColor(y, currentTheme === 'light' ? 0.96 : 0.95, currentTheme === 'light' ? 0.38 : 0.62), 0.3, 0.14)
          setMaterialOpacity(arrow.line.material, palette.arrowBoost)
          setMaterialOpacity(arrow.cone.material, palette.arrowBoost)
          arrows.add(arrow)
        }
      }

      world.add(arrows)

      function createPath(startX: number, startZ: number) {
        let px = startX
        let pz = startZ
        const path: Array<{ x: number; z: number }> = []
        const bounds = surfaceSize * 0.43

        for (let i = 0; i < 900; i += 1) {
          const g = gradientAt(px, pz)
          const detourStrength = 1 - THREE.MathUtils.smoothstep(i, 460, 850)
          px -= g.dx * 0.65 + Math.sin(i * 0.022) * 0.05 * detourStrength
          pz -= g.dz * 0.65 + Math.cos(i * 0.019) * 0.05 * detourStrength
          px = THREE.MathUtils.clamp(px, -bounds, bounds)
          pz = THREE.MathUtils.clamp(pz, -bounds, bounds)
          path.push({ x: px, z: pz })
        }

        return path
      }

      const mainPath = createPath(27, -25)
      const pageLoadTime = performance.now()
      let lastScrollTime = pageLoadTime
      let endOrbitStart = 0
      let endOrbitBaseAngle = 0
      let wasEndMode = false
      let endOrbitBlend = 0
      let cameraStateReady = false
      let previousFrameTime = pageLoadTime

      const cameraState = {
        angle: 0,
        radius: 36,
        height: 27,
      }

      function lerpAngle(current: number, target: number, amount: number) {
        const delta = Math.atan2(Math.sin(target - current), Math.cos(target - current))
        return current + delta * amount
      }

      function blendAngle(from: number, to: number, amount: number) {
        const delta = Math.atan2(Math.sin(to - from), Math.cos(to - from))
        return from + delta * amount
      }

      function progress() {
        const rect = stage.getBoundingClientRect()
        const total = Math.max(stage.offsetHeight - window.innerHeight, 1)
        return THREE.MathUtils.clamp(-rect.top / total, 0, 1)
      }

      const onScroll = () => {
        lastScrollTime = performance.now()
      }

      const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }

      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', onResize)
      cleanupCallbacks.push(() => window.removeEventListener('scroll', onScroll))
      cleanupCallbacks.push(() => window.removeEventListener('resize', onResize))

      function animate() {
        animationFrame = window.requestAnimationFrame(animate)

        const now = performance.now()
        const deltaSeconds = Math.min((now - previousFrameTime) / 1000, 0.033)
        previousFrameTime = now
        const p = progress()
        const sectionRect = stage.getBoundingClientRect()
        const sectionEntry = window.innerHeight - sectionRect.top
        const stageVisibility = THREE.MathUtils.smoothstep(sectionEntry, window.innerHeight * 0.1, window.innerHeight * 0.72)
        const atEnd = p >= 0.995
        const scrollHasStopped = now - lastScrollTime > 520
        const endMode = atEnd && scrollHasStopped

        stageCanvas.style.opacity = String(stageVisibility)
        if (gradientRef.current) {
          gradientRef.current.style.opacity = String(stageVisibility * palette.stageGradientOpacity)
        }
        if (topBackgroundRef.current) {
          topBackgroundRef.current.style.opacity = String(1 - stageVisibility)
        }

        world.rotation.y = THREE.MathUtils.lerp(world.rotation.y, p * Math.PI * 1.08, 0.026)

        const introProgress = THREE.MathUtils.smoothstep(now - pageLoadTime, 0, 3000)
        const introOnly = 1 - THREE.MathUtils.smoothstep(p, 0.01, 0.12)
        const normalAngle = world.rotation.y * 0.7 + Math.sin(now * 0.00035) * 0.025 * introOnly
        const normalRadius = 36 + (1 - introProgress) * -3.2 * introOnly + Math.sin(now * 0.00075) * 0.35 * introOnly
        const normalHeight = 27 + Math.sin(world.rotation.y * 0.2) * 2 + (1 - introProgress) * -0.8 * introOnly

        if (!cameraStateReady) {
          cameraState.angle = normalAngle
          cameraState.radius = normalRadius
          cameraState.height = normalHeight
          cameraStateReady = true
        }

        if (endMode && !wasEndMode) {
          endOrbitStart = now
          endOrbitBaseAngle = cameraState.angle
        }

        wasEndMode = endMode
        endOrbitBlend = THREE.MathUtils.lerp(endOrbitBlend, endMode ? 1 : 0, endMode ? 0.026 : 0.065)

        const endOrbitElapsed = now - endOrbitStart
        const orbitAngle = endOrbitBaseAngle + endOrbitElapsed * 0.00008
        const blendedAngle = blendAngle(normalAngle, orbitAngle, endOrbitBlend)
        const blendedRadius = THREE.MathUtils.lerp(normalRadius, 37.5, endOrbitBlend)
        const blendedHeight = THREE.MathUtils.lerp(normalHeight, 27 + Math.sin(orbitAngle) * 2, endOrbitBlend)

        cameraState.angle = lerpAngle(cameraState.angle, blendedAngle, 0.075)
        cameraState.radius = THREE.MathUtils.lerp(cameraState.radius, blendedRadius, 0.075)
        cameraState.height = THREE.MathUtils.lerp(cameraState.height, blendedHeight, 0.075)
        camera.position.set(Math.sin(cameraState.angle) * cameraState.radius, cameraState.height, Math.cos(cameraState.angle) * cameraState.radius)
        camera.lookAt(0, 0, 0)

        const whiteness = THREE.MathUtils.smoothstep(p, 0.5, 0.95)
        wireMat.opacity = palette.wireOpacity + whiteness * (currentTheme === 'light' ? 0.16 : 0.25)
        fillMat.opacity = palette.fillOpacity + whiteness * (currentTheme === 'light' ? 0.035 : 0.045)

        const arrowFade = THREE.MathUtils.smoothstep(p, 0.82, 0.985)
        const arrowOpacity = endMode ? 0 : palette.arrowBoost * (1 - arrowFade)
        arrows.visible = arrowOpacity > 0.01
        arrows.children.forEach((child) => {
          const arrow = child as import('three').ArrowHelper
          setMaterialOpacity(arrow.line.material, arrowOpacity)
          setMaterialOpacity(arrow.cone.material, arrowOpacity)
        })

        const bottomNavProgress = THREE.MathUtils.smoothstep(endOrbitBlend, 0.22, 0.86)
        if (endLinksRef.current) {
          endLinksRef.current.classList.toggle('is-visible', bottomNavProgress > 0.35)
          endLinksRef.current.style.setProperty('--end-progress', String(bottomNavProgress))
          endLinksRef.current.setAttribute('aria-hidden', String(bottomNavProgress <= 0.35))
          endLinksRef.current.querySelectorAll('a, button').forEach((button) => {
            ;(button as HTMLElement).tabIndex = bottomNavProgress > 0.88 ? 0 : -1
          })
        }
        if (scrollLabelRef.current) {
          scrollLabelRef.current.style.opacity = String(stageVisibility * (1 - bottomNavProgress))
        }

        renderer.render(scene, camera)
      }

      animate()

      cleanupCallbacks.push(() => {
        window.cancelAnimationFrame(animationFrame)
        renderer.dispose()
        geo.dispose()
        fillMat.dispose()
        wireMat.dispose()
      })
    }

    start().catch((error) => {
      console.error('Gradient scene failed to start', error)
    })

    return () => {
      disposed = true
      cleanupCallbacks.forEach((cleanup) => cleanup())
    }
  }, [currentTheme])

  useEffect(() => {
    if (typeof window === 'undefined') return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTypedHeadlineLength(headlineText.length)
      return
    }

    const updateHeadline = () => {
      const hero = heroRef.current
      if (!hero) return
      const rect = hero.getBoundingClientRect()
      const start = window.innerHeight * 0.82
      const end = window.innerHeight * 0.18
      const progress = Math.max(0, Math.min(1, (start - rect.top) / Math.max(1, start - end)))
      setTypedHeadlineLength(Math.round(progress * headlineText.length))
    }

    updateHeadline()
    window.addEventListener('scroll', updateHeadline, { passive: true })
    window.addEventListener('resize', updateHeadline)

    return () => {
      window.removeEventListener('scroll', updateHeadline)
      window.removeEventListener('resize', updateHeadline)
    }
  }, [])

  const visibleHeadline = typedHeadlineLength > 0 ? headlineText.slice(0, typedHeadlineLength) : ''

  return (
    <section ref={sectionRef} id="gradient-work" className="gd-stage">
      <div ref={gradientRef} className="gd-gradient" aria-hidden="true" />
      <canvas ref={canvasRef} className="gd-canvas" aria-hidden="true" />

      <main className="gd-overlay">
        <section ref={heroRef} className="gd-hero" id="top">
          <div className="gd-hero-inner">
            <p className="gd-eyebrow">Current work</p>
            <h1 className="gd-hero-title" aria-label={headlineText}>
              <span className="gd-hero-title-ghost" aria-hidden="true">{headlineText}</span>
              <span className="gd-hero-title-live">
                {visibleHeadline}
                <span className="gd-hero-caret" aria-hidden="true" />
              </span>
            </h1>
            <p>Product, research, AI systems, and what&apos;s next.</p>
          </div>
        </section>

        <section className="gd-timeline">
          {points.map((point, index) => (
            <TimelinePoint key={point.title} point={point} align={index % 2 === 0 ? 'left' : 'right'} />
          ))}
        </section>
      </main>

      <div ref={scrollLabelRef} className="gd-scroll">Scroll</div>

      <nav ref={endLinksRef} className="gd-end-links" aria-label="Bottom navigation" aria-hidden="true">
        <p className="gd-end-name">Akash Dubey</p>
        <div className="gd-end-top-actions">
          <a
            href="/akash-dubey.vcf"
            download
            className="gd-end-contact-shortcut"
            tabIndex={-1}
            title="Add to Contacts"
          >
            <span>Add to Contacts</span>
          </a>
          <div className="gd-end-theme">
            <ThemeToggle className="gd-end-theme-button" />
          </div>
        </div>
        <ContactIconLinks className="gd-end-icons" />
        <button type="button" className="gd-end-button" tabIndex={-1} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span>Replay</span>
        </button>
        <a className="gd-end-button" href="/projects" tabIndex={-1}><span>Projects</span></a>
        <a className="gd-end-button" href="/writing" tabIndex={-1}><span>Writing</span></a>
        <a className="gd-end-button" href="/contact" tabIndex={-1}><span>Contact</span></a>
      </nav>
    </section>
  )
}

export function HomeYoshiScene({ projects }: HomeYoshiSceneProps) {
  const topBackgroundRef = useRef<HTMLDivElement | null>(null)
  const projectBySlug = useMemo(() => new Map(projects.map((project) => [project.slug, project])), [projects])
  const scarletSync = projectBySlug.get('scarlet-sync')
  const lykke = projectBySlug.get('lykke')
  const compBio = projectBySlug.get('hic-tad-analysis')
  const llmResearch = projectBySlug.get('llm-research')
  const drp = projectBySlug.get('drp-spring-2025')
  const economicGrapher = projectBySlug.get('economic-grapher')
  const pathFinder = projectBySlug.get('path-finder')

  const points = useMemo<HomePoint[]>(() => [
    {
      eyebrow: 'Currently',
      title: 'New York Life Insurance',
      body: 'Preparing for a software engineering internship focused on production systems and applied data work.',
      logo: '/company-logos/new-york-life.svg',
      logoAlt: 'New York Life Insurance logo',
      image: '/images/homepage/2026-05-29/nyl.avif',
      imageAlt: 'New York Life building at night in Midtown Manhattan',
    },
    {
      eyebrow: 'Right now',
      title: 'Scarlet Sync',
      body: 'Building a smarter Rutgers course planner for generating workable schedules around real student constraints.',
      href: scarletSync ? `/projects/${scarletSync.slug}` : undefined,
      logo: '/company-logos/scarlet-sync.png',
      logoAlt: 'Scarlet Sync logo',
      gallery: [
        { src: scarletSync?.image || '/images/portfolio/scarlet-sync/home.png', alt: 'Scarlet Sync interface' },
        { src: '/images/portfolio/scarlet-sync/home.png', alt: 'Scarlet Sync planner view' },
      ],
    },
    {
      eyebrow: 'Right now',
      title: 'Lykke',
      body: 'Shipping an AI study platform that turns course material into flashcards, notes, quizzes, and shared workflows.',
      href: lykke ? `/projects/${lykke.slug}` : undefined,
      logos: [
        { src: '/company-logos/lykke.svg', alt: 'Lykke logo' },
      ],
      galleryLayout: 'feature-left-stack-right',
      gallery: [
        { src: lykke?.image || '/images/portfolio/lykke/hero.png', alt: 'Lykke interface' },
        { src: '/images/portfolio/lykke/study.png', alt: 'Lykke study tools' },
        { src: '/images/portfolio/lykke/discover.png', alt: 'Lykke discover feed' },
      ],
    },
    {
      eyebrow: 'Research',
      title: 'Algorithmic Robotics & Control Lab',
      body: 'Working on motion-planning optimization and vision-language-action directions for robotics at Rutgers.',
      href: pathFinder ? `/projects/${pathFinder.slug}` : 'https://arc-lab-robotics.github.io/',
      gallerySide: 'right',
      gallery: [
        { src: '/images/homepage/arc-lab/dipn-manipulation.png', alt: 'Robot manipulation pipeline from ARC-L DIPN research' },
        { src: '/images/homepage/arc-lab/tabletop-rearrangement.png', alt: 'Tabletop object rearrangement planning from ARC-L research' },
        { src: '/images/homepage/arc-lab/path-planning.png', alt: 'Multi-robot path planning visualization from ARC-L research' },
      ],
    },
    {
      eyebrow: 'Research',
      title: 'Kwan Lab',
      body: 'Building computational biology tooling for TAD-boundary deletion analysis, chromatin simulation, and Hi-C driven experiments.',
      href: compBio ? `/projects/${compBio.slug}` : undefined,
      gallerySide: 'right',
      gallery: [
        { src: compBio?.image || '/images/portfolio/hic-tad/hero.png', alt: 'Hi-C TAD analysis visualization' },
        { src: '/images/portfolio/hic-tad/polymer-3d.png', alt: '3D genome polymer simulation' },
        { src: '/images/portfolio/hic-tad/deletion-celltype.png', alt: 'Deletion analysis across cell types' },
      ],
    },
    {
      eyebrow: 'Research',
      title: 'LLM Research',
      body: 'Studying small-model optimization, post-training, and agentic systems for non-sequential code generation.',
      href: llmResearch ? `/projects/${llmResearch.slug}` : undefined,
      gallery: [
        { src: llmResearch?.image || '/images/portfolio/llm-research/image.png', alt: 'LLM research results' },
      ],
    },
    {
      eyebrow: 'Analysis',
      title: 'Economics',
      body: 'Building quantitative tools and visualizations for economic series, migration analysis, and data-heavy questions.',
      href: economicGrapher ? `/projects/${economicGrapher.slug}` : undefined,
      gallery: [
        { src: economicGrapher?.image || '/images/portfolio/vis/economic-plotter.png', alt: 'Economic series plotter' },
      ],
    },
    {
      eyebrow: 'Math',
      title: 'Directed Reading Program',
      body: 'Using DRP to push deeper into proof-writing, q-binomial identities, and the kind of math that sharpens everything else.',
      href: drp ? `/projects/${drp.slug}` : undefined,
      gallery: [
        { src: drp?.image || '/images/portfolio/drp.png', alt: 'DRP presentation' },
      ],
    },
  ], [compBio, drp, economicGrapher, llmResearch, lykke, pathFinder, scarletSync])

  return (
    <div className="home-clean-page">
      <div className="home-top-slope">
        <div ref={topBackgroundRef} className="home-top-gradient-shell">
          <GradientDescentBackground className="home-top-gradient" />
        </div>
        <IntroHero />
        <PlacesSection />
      </div>
      <HomeGradientDescentStage points={points} topBackgroundRef={topBackgroundRef} />
    </div>
  )
}

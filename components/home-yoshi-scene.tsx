'use client'

import { useEffect, useMemo, useRef } from 'react'

import { ContactIconLinks } from '@/components/contact-icon-links'
import { GradientDescentBackground } from '@/components/gradient-descent-background'
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
  image?: string
  imageAlt?: string
  gallery?: Array<{ src: string; alt: string }>
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
    title: 'All In',
    description: 'A map pin for the moments that feel fully alive.',
    image: '/images/homepage/2026-05-24/allin1.png',
    tone: '#d6a6be',
  },
  {
    title: 'Random Glance',
    description: 'An image worth keeping before overthinking it.',
    image: '/images/homepage/2026-05-24/rando.png',
    tone: '#91a8d8',
  },
  {
    title: 'NVIDIA',
    description: 'A nod to the robotics and VLA thread in the work.',
    image: '/images/homepage/2026-05-24/nvidia.png',
    tone: '#91c777',
  },
  {
    title: 'Glum',
    description: 'Moody light, good texture, no need to force cheerfulness.',
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
    title: 'DC',
    description: 'A city-frame checkpoint in the wider map.',
    image: '/images/homepage/2026-05-24/dc.png',
    tone: '#c7b18a',
  },
  {
    title: 'Plane Window',
    description: 'Movement, altitude, and a useful reset in perspective.',
    image: '/images/homepage/2026-05-24/plane.png',
    tone: '#8eb0d8',
  },
  {
    title: 'Lake Blue',
    description: 'A quieter kind of horizon line.',
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
    title: 'Vector Sky',
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
    title: 'Cool Building',
    description: 'Good geometry deserves a slot on the map too.',
    image: '/images/homepage/2026-05-24/cool-building.png',
    tone: '#b9b4cc',
  },
  {
    title: '1073',
    description: 'One of those frames that earns a place by feel alone.',
    image: '/images/homepage/2026-05-24/1073.png',
    tone: '#b39dcb',
  },
  {
    title: 'Kali',
    description: 'A quieter portrait moment tucked into the image stream.',
    image: '/images/homepage/2026-05-24/kali.png',
    tone: '#b79fc6',
  },
]

function TimelinePoint({ point, align }: { point: HomePoint; align: 'left' | 'right' }) {
  return (
    <article className={`gd-row ${align}`}>
      <div className="gd-content">
        <div className="gd-card">
          <p className="gd-eyebrow">{point.eyebrow}</p>
          {point.logo ? (
            <div className="gd-card-logo">
              <img src={point.logo} alt={point.logoAlt || `${point.title} logo`} />
            </div>
          ) : null}
          <h2>{point.title}</h2>
          <p>{point.body}</p>
          {point.href ? <a href={point.href}>Open details ↗</a> : null}
        </div>

        {point.gallery ? (
          <div className="gd-image-gallery three">
            {point.gallery.map((image, index) => (
              <div key={image.src} className={`gd-image-wrap ${index === 0 ? 'feature' : ''}`}>
                <img src={image.src} alt={image.alt} />
              </div>
            ))}
          </div>
        ) : point.image ? (
          <div className="gd-image-wrap">
            <img src={point.image} alt={point.imageAlt || point.title} />
          </div>
        ) : null}
      </div>
    </article>
  )
}

function IntroHero() {
  return (
    <section className="home-intro-hero">
      <div className="home-intro-copy">
        <h1>Akash Dubey</h1>
        <p>
          I'm currently studying computer science and math at the Rutgers University Honors College. I'm excited to continue learning and exploring my interests!
        </p>
        <a href="#visual-notes" className="home-intro-down" aria-label="Scroll to visual notes">
          <span aria-hidden="true">↓</span>
        </a>
      </div>

      <div className="home-portrait-frame">
        <img src="/images/face.jpg" alt="Akash Dubey" />
      </div>
    </section>
  )
}

function PlacesSection() {
  return (
    <section id="visual-notes" className="places-section">
      <div className="visual-journal">
        <div className="visual-journal-grid" aria-label="Photo grid">
          {placeMoments.map((place, index) => (
            <figure key={place.image} className={`visual-journal-card visual-journal-card-${(index % 10) + 1}`}>
              <img src={place.image} alt={place.title} loading={index > 5 ? 'lazy' : undefined} />
              <figcaption>
                <span>{place.title}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

function HomeGradientDescentStage({ points }: { points: HomePoint[] }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const sectionRef = useRef<HTMLElement | null>(null)
  const gradientRef = useRef<HTMLDivElement | null>(null)
  const endLinksRef = useRef<HTMLElement | null>(null)
  const scrollLabelRef = useRef<HTMLDivElement | null>(null)

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

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(44, window.innerWidth / window.innerHeight, 0.1, 1200)
      camera.position.set(0, 27, 36)

      const renderer = new THREE.WebGLRenderer({ canvas: stageCanvas, antialias: true, alpha: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setClearColor(0x000000, 0)

      scene.add(new THREE.AmbientLight(0xffffff, 0.9))

      const light = new THREE.DirectionalLight(0xffffff, 2.2)
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

      function heightColor(y: number, saturation = 0.9, lightness = 0.55) {
        const normalized = THREE.MathUtils.clamp((y + 6) / 12, 0, 1)
        return new THREE.Color().setHSL(0.72 - normalized * 0.45, saturation, lightness)
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
        const color = heightColor(y)
        colors.push(color.r, color.g, color.b)
      }

      pos.needsUpdate = true
      geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
      geo.computeVertexNormals()

      const fillMat = new THREE.MeshStandardMaterial({
        vertexColors: true,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.055,
        roughness: 0.9,
        metalness: 0,
      })

      const wireMat = new THREE.MeshStandardMaterial({
        vertexColors: true,
        wireframe: true,
        transparent: true,
        opacity: 0.28,
        emissive: '#ffffff',
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
          const arrow = new THREE.ArrowHelper(downhillDirection(x, z), surfacePoint(x, z, surfaceLift), 1.15, heightColor(y, 0.95, 0.62), 0.3, 0.14)
          setMaterialOpacity(arrow.line.material, 0.85)
          setMaterialOpacity(arrow.cone.material, 0.85)
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
        const p = progress()
        const sectionRect = stage.getBoundingClientRect()
        const stageVisibility = THREE.MathUtils.smoothstep(window.innerHeight - sectionRect.top, 0, window.innerHeight * 0.75)
        const atEnd = p >= 0.995
        const scrollHasStopped = now - lastScrollTime > 520
        const endMode = atEnd && scrollHasStopped

        stageCanvas.style.opacity = String(stageVisibility)
        if (gradientRef.current) {
          gradientRef.current.style.opacity = String(stageVisibility)
        }

        world.rotation.y = THREE.MathUtils.lerp(world.rotation.y, p * Math.PI * 1.45, 0.035)

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
        const orbitAngle = endOrbitBaseAngle + endOrbitElapsed * 0.00022
        const blendedAngle = blendAngle(normalAngle, orbitAngle, endOrbitBlend)
        const blendedRadius = THREE.MathUtils.lerp(normalRadius, 37.5, endOrbitBlend)
        const blendedHeight = THREE.MathUtils.lerp(normalHeight, 27 + Math.sin(orbitAngle) * 2, endOrbitBlend)

        cameraState.angle = lerpAngle(cameraState.angle, blendedAngle, 0.075)
        cameraState.radius = THREE.MathUtils.lerp(cameraState.radius, blendedRadius, 0.075)
        cameraState.height = THREE.MathUtils.lerp(cameraState.height, blendedHeight, 0.075)
        camera.position.set(Math.sin(cameraState.angle) * cameraState.radius, cameraState.height, Math.cos(cameraState.angle) * cameraState.radius)
        camera.lookAt(0, 0, 0)

        const whiteness = THREE.MathUtils.smoothstep(p, 0.5, 0.95)
        wireMat.opacity = 0.28 + whiteness * 0.25
        fillMat.opacity = 0.055 + whiteness * 0.045

        const arrowFade = THREE.MathUtils.smoothstep(p, 0.82, 0.985)
        const arrowOpacity = endMode ? 0 : 0.85 * (1 - arrowFade)
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

    start()

    return () => {
      disposed = true
      cleanupCallbacks.forEach((cleanup) => cleanup())
    }
  }, [])

  return (
    <section ref={sectionRef} id="gradient-work" className="gd-stage">
      <div ref={gradientRef} className="gd-gradient" aria-hidden="true" />
      <canvas ref={canvasRef} className="gd-canvas" aria-hidden="true" />

      <main className="gd-overlay">
        <section className="gd-hero" id="top">
          <div className="gd-hero-inner">
            <p className="gd-eyebrow">Optimizing work</p>
            <h1>Gradient descent through the work.</h1>
            <p>
              A cleaner path through the important pieces: internship, product work, research, AI systems,
              economics, math, and robotics.
            </p>
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
  const projectBySlug = useMemo(() => new Map(projects.map((project) => [project.slug, project])), [projects])
  const scarletSync = projectBySlug.get('scarlet-sync')
  const lykke = projectBySlug.get('lykke')
  const compBio = projectBySlug.get('hic-tad-analysis')
  const llmResearch = projectBySlug.get('llm-research')
  const drp = projectBySlug.get('drp-spring-2025')
  const robotCode = projectBySlug.get('robot-code')
  const economicGrapher = projectBySlug.get('economic-grapher')

  const points = useMemo<HomePoint[]>(() => [
    {
      eyebrow: 'Incoming intern',
      title: 'New York Life Insurance',
      body: 'The next update step: an incoming internship bringing software, data, and systems thinking into a larger financial technology environment.',
      logo: '/company-logos/new-york-life.svg',
      logoAlt: 'New York Life Insurance logo',
    },
    {
      eyebrow: 'Product builds',
      title: 'Scarlet Sync and Lykke',
      body: 'Two useful products: one for Rutgers schedule planning, one for turning course material into AI-assisted study workflows.',
      href: scarletSync ? `/projects/${scarletSync.slug}` : undefined,
      gallery: [
        { src: scarletSync?.image || '/images/portfolio/scarlet-sync/home.png', alt: 'Scarlet Sync interface' },
        { src: lykke?.image || '/images/portfolio/lykke/hero.png', alt: 'Lykke interface' },
        { src: '/images/portfolio/lykke/study.png', alt: 'Lykke study tools' },
      ],
    },
    {
      eyebrow: 'Research',
      title: 'Robotics and computational biology',
      body: 'Path planning, motion planning, and 3D genome analysis: optimization shows up in robots, biology, and the algorithms between them.',
      href: compBio ? `/projects/${compBio.slug}` : undefined,
      gallery: [
        { src: '/images/portfolio/random_environment.png', alt: 'A* path finding visualization' },
        { src: compBio?.image || '/images/portfolio/hic-tad/hero.png', alt: 'Hi-C TAD analysis visualization' },
        { src: '/images/portfolio/hic-tad/polymer-3d.png', alt: '3D genome polymer simulation' },
      ],
    },
    {
      eyebrow: 'AI and analysis',
      title: 'LLMs, economics, and DRP',
      body: 'A compact workbench for language-model research, economic analysis, directed reading, and the math/data tools that make bigger systems sharper.',
      href: llmResearch ? `/projects/${llmResearch.slug}` : undefined,
      gallery: [
        { src: llmResearch?.image || '/images/portfolio/llm-research/image.png', alt: 'LLM research results' },
        { src: economicGrapher?.image || '/images/portfolio/vis/economic-plotter.png', alt: 'Economic series plotter' },
        { src: drp?.image || '/images/portfolio/drp.png', alt: 'DRP presentation' },
      ],
    },
    {
      eyebrow: 'Foundations',
      title: 'High school robotics',
      body: 'FRC programming was the early pressure test: autonomous routines, vision, subsystem design, leadership, and debugging when the robot needs to move.',
      href: robotCode ? `/projects/${robotCode.slug}` : undefined,
      image: robotCode?.image || '/images/portfolio/2024-upscaled.png',
      imageAlt: 'FRC robot project',
    },
  ], [compBio, drp, economicGrapher, llmResearch, lykke, robotCode, scarletSync])

  return (
    <div className="home-clean-page">
      <div className="home-top-slope">
        <GradientDescentBackground className="home-top-gradient" />
        <IntroHero />
        <PlacesSection />
      </div>
      <HomeGradientDescentStage points={points} />
    </div>
  )
}

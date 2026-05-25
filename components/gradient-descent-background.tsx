'use client'

import { useEffect, useRef } from 'react'

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function GradientDescentBackground({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || prefersReducedMotion()) return

    let disposed = false
    let animationFrame = 0
    let trail: import('three').Line | undefined

    const cleanupCallbacks: Array<() => void> = []

    async function start() {
      const THREE = await import('three')
      if (disposed || !canvas) return

      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 1200)
      camera.position.set(0, 27, 36)

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(1, 1)
      renderer.setClearColor(0x000000, 0)

      scene.add(new THREE.AmbientLight(0xffffff, 0.9))

      const light = new THREE.DirectionalLight(0xffffff, 2.2)
      light.position.set(10, 34, 20)
      scene.add(light)

      const world = new THREE.Group()
      scene.add(world)

      const surfaceSize = 92
      const surfaceSegments = 170
      const functionScale = 50 / surfaceSize
      const pointRadius = 0.45
      const surfaceLift = 0.08
      const trailLift = 0.12

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

      function heightColor(y: number, saturation = 0.06, lightness = 0.82) {
        const normalized = THREE.MathUtils.clamp((y + 6) / 12, 0, 1)
        return new THREE.Color().setHSL(0.58 - normalized * 0.08, saturation, lightness + normalized * 0.12)
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
        opacity: 0.035,
        roughness: 0.9,
        metalness: 0,
      })

      const wireMat = new THREE.MeshStandardMaterial({
        vertexColors: true,
        wireframe: true,
        transparent: true,
        opacity: 0.16,
        emissive: '#ffffff',
        emissiveIntensity: 0.18,
      })

      world.add(new THREE.Mesh(geo.clone(), fillMat))
      world.add(new THREE.Mesh(geo, wireMat))

      const arrows = new THREE.Group()
      const fieldSize = surfaceSize * 0.38
      const spacing = 3.2

      for (let x = -fieldSize; x <= fieldSize; x += spacing) {
        for (let z = -fieldSize; z <= fieldSize; z += spacing) {
          const arrow = new THREE.ArrowHelper(downhillDirection(x, z), surfacePoint(x, z, surfaceLift), 0.95, new THREE.Color('#f8fbff'), 0.24, 0.11)
          setMaterialOpacity(arrow.line.material, 0.22)
          setMaterialOpacity(arrow.cone.material, 0.22)
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
      const point = new THREE.Mesh(
        new THREE.SphereGeometry(pointRadius, 32, 32),
        new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#ffffff', emissiveIntensity: 2.4, metalness: 1, roughness: 0 }),
      )
      const smoothedMainXZ = new THREE.Vector2(mainPath[0].x, mainPath[0].z)
      point.position.copy(surfacePoint(mainPath[0].x, mainPath[0].z, pointRadius))
      world.add(point)

      const trailMaterial = new THREE.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.42 })

      function replaceTrail(path: typeof mainPath, idx: number) {
        if (trail) {
          trail.geometry.dispose()
          world.remove(trail)
        }

        const pts: import('three').Vector3[] = []
        const startIndex = Math.max(0, idx - 900)
        for (let i = startIndex; i <= idx; i += 3) {
          pts.push(surfacePoint(path[i].x, path[i].z, trailLift))
        }

        trail = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), trailMaterial)
        world.add(trail)
      }

      const cameraState = { angle: 0, radius: 36, height: 27, ready: false }

      function lerpAngle(current: number, target: number, amount: number) {
        return current + Math.atan2(Math.sin(target - current), Math.cos(target - current)) * amount
      }

      const onResize = () => {
        const bounds = containerRef.current?.getBoundingClientRect()
        const width = Math.max(1, bounds?.width ?? window.innerWidth)
        const height = Math.max(1, bounds?.height ?? window.innerHeight)
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        renderer.setSize(width, height)
      }

      onResize()
      window.addEventListener('resize', onResize)
      cleanupCallbacks.push(() => window.removeEventListener('resize', onResize))

      function animate() {
        animationFrame = window.requestAnimationFrame(animate)

        const now = performance.now()
        const p = (now * 0.000035) % 1
        const normalAngle = now * 0.00011
        const normalRadius = 37 + Math.sin(now * 0.00045) * 0.7
        const normalHeight = 26 + Math.sin(now * 0.00028) * 2.4

        world.rotation.y = now * 0.000075

        if (!cameraState.ready) {
          cameraState.angle = normalAngle
          cameraState.radius = normalRadius
          cameraState.height = normalHeight
          cameraState.ready = true
        }

        cameraState.angle = lerpAngle(cameraState.angle, normalAngle, 0.035)
        cameraState.radius = THREE.MathUtils.lerp(cameraState.radius, normalRadius, 0.035)
        cameraState.height = THREE.MathUtils.lerp(cameraState.height, normalHeight, 0.035)

        camera.position.set(Math.sin(cameraState.angle) * cameraState.radius, cameraState.height, Math.cos(cameraState.angle) * cameraState.radius)
        camera.lookAt(0, 0, 0)

        wireMat.opacity = 0.14 + Math.sin(now * 0.00022) * 0.025
        fillMat.opacity = 0.03 + Math.sin(now * 0.00018) * 0.008

        const arrowOpacity = 0.16 + Math.sin(now * 0.0002) * 0.04
        arrows.visible = true
        arrows.children.forEach((child) => {
          const arrow = child as import('three').ArrowHelper
          setMaterialOpacity(arrow.line.material, arrowOpacity)
          setMaterialOpacity(arrow.cone.material, arrowOpacity)
        })

        const idx = Math.floor(p * (mainPath.length - 1))
        const current = mainPath[idx]
        smoothedMainXZ.lerp(new THREE.Vector2(current.x, current.z), 0.14)
        point.position.copy(surfacePoint(smoothedMainXZ.x, smoothedMainXZ.y, pointRadius))
        replaceTrail(mainPath, idx)

        renderer.render(scene, camera)
      }

      animate()

      cleanupCallbacks.push(() => {
        window.cancelAnimationFrame(animationFrame)
        renderer.dispose()
        geo.dispose()
        fillMat.dispose()
        wireMat.dispose()
        point.geometry.dispose()
        ;(point.material as import('three').Material).dispose()
        trail?.geometry.dispose()
        trailMaterial.dispose()
      })
    }

    start()

    return () => {
      disposed = true
      cleanupCallbacks.forEach((cleanup) => cleanup())
    }
  }, [])

  return (
    <div ref={containerRef} className={className ? `gradient-descent-bg ${className}` : 'gradient-descent-bg'} aria-hidden="true">
      <div className="gradient-descent-glow" />
      <canvas ref={canvasRef} />
    </div>
  )
}

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

// A 3D-styled pen with a glowing trail that reacts to scroll.
// - Sticky stage: as you scroll through the section, the pen rotates and "draws" a neon curve.
// - No external 3D deps; uses perspective and layered gradients for a holographic feel.

export default function Pen3D() {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const penRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })

  // Map scroll progress to transforms
  const rotZ = useTransform(scrollYProgress, [0, 1], [-25, 35])
  const rotX = useTransform(scrollYProgress, [0, 1], [12, -18])
  const rotY = useTransform(scrollYProgress, [0, 1], [-10, 15])
  const penX = useTransform(scrollYProgress, [0, 1], [-80, 120])
  const penY = useTransform(scrollYProgress, [0, 1], [40, -60])

  const [dims, setDims] = useState({ w: 0, h: 0 })
  
  useEffect(() => {
    const resize = () => {
      const el = sectionRef.current
      const canvas = canvasRef.current
      if (!el || !canvas) return
      const rect = el.getBoundingClientRect()
      // Use window size for a consistent drawing area inside the sticky panel
      const w = Math.min(window.innerWidth, 1400)
      const h = Math.min(window.innerHeight, 900)
      canvas.width = w
      canvas.height = h
      setDims({ w, h })
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  // Draw a smooth neon curve that extends with scroll progress
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let raf

    const draw = () => {
      const w = canvas.width
      const h = canvas.height

      // Background subtle grid glow
      ctx.clearRect(0, 0, w, h)
      const grd = ctx.createLinearGradient(0, 0, w, h)
      grd.addColorStop(0, 'rgba(120, 0, 255, 0.08)')
      grd.addColorStop(1, 'rgba(0, 220, 255, 0.06)')
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, w, h)

      // Read progress value from MotionValue
      const p = scrollYProgress.get()

      // Path control points evolve with progress to create an elegant S-curve
      const start = { x: w * 0.15, y: h * 0.75 }
      const cp1 = { x: w * (0.25 + p * 0.15), y: h * (0.2 + p * 0.15) }
      const cp2 = { x: w * (0.55 + p * 0.25), y: h * (0.85 - p * 0.45) }
      const end = { x: w * (0.75 + p * 0.15), y: h * (0.35 - p * 0.15) }

      // Glow layers
      const drawStroke = (width, color, shadowBlur) => {
        ctx.beginPath()
        ctx.moveTo(start.x, start.y)
        ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y)
        ctx.lineWidth = width
        ctx.strokeStyle = color
        ctx.shadowBlur = shadowBlur
        ctx.shadowColor = color
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.stroke()
      }

      drawStroke(12, 'rgba(0, 255, 255, 0.25)', 24)
      drawStroke(8, 'rgba(120, 0, 255, 0.35)', 28)
      drawStroke(3, 'rgba(0, 255, 200, 0.9)', 18)

      // Particles along the path
      for (let i = 0; i < 40; i++) {
        const t = Math.max(0, Math.min(1, p * 1.1 - i * 0.02))
        const x = bezierPoint(start.x, cp1.x, cp2.x, end.x, t)
        const y = bezierPoint(start.y, cp1.y, cp2.y, end.y, t)
        const s = 1 + (1 - t) * 3
        ctx.beginPath()
        ctx.fillStyle = `rgba(${Math.floor(80 + 80 * (1 - t))}, ${Math.floor(255 - 80 * t)}, 255, ${0.6 - t * 0.5})`
        ctx.shadowBlur = 16
        ctx.shadowColor = 'rgba(0,255,255,0.8)'
        ctx.arc(x, y, s, 0, Math.PI * 2)
        ctx.fill()
      }

      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [scrollYProgress])

  // Helper for cubic Bezier evaluation
  function bezierPoint(p0, p1, p2, p3, t) {
    const u = 1 - t
    return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3
  }

  const glowBorder = useMemo(
    () => ({
      boxShadow:
        '0 0 40px rgba(99,102,241,0.25), inset 0 0 30px rgba(34,211,238,0.15), 0 0 8px rgba(255,255,255,0.05)'
    }),
    []
  )

  return (
    <section ref={sectionRef} className="relative z-10">
      <div className="h-[180vh] w-full"></div>
      <div className="sticky top-0 h-[100vh] w-full overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-0">
          <canvas ref={canvasRef} className="h-full w-full" />
        </div>

        {/* Pen */}
        <motion.div
          ref={penRef}
          style={{
            rotateZ: rotZ,
            rotateX: rotX,
            rotateY: rotY,
            x: penX,
            y: penY,
            transformStyle: 'preserve-3d',
          }}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="[perspective:1200px]">
            <div className="relative h-52 w-10 origin-center [transform:rotateX(18deg)_rotateZ(-10deg)]">
              {/* Barrel */}
              <div
                className="absolute inset-0 rounded-full backdrop-blur-md"
                style={{
                  background:
                    'linear-gradient(120deg, rgba(120,0,255,0.35), rgba(0,220,255,0.35))',
                  border: '1px solid rgba(255,255,255,0.18)',
                  ...glowBorder,
                }}
              />
              {/* Highlights */}
              <div className="absolute inset-0 rounded-full">
                <div className="absolute left-1 top-4 h-40 w-2 rounded-full bg-white/30 blur-[2px]" />
                <div className="absolute right-1 top-6 h-40 w-[3px] rounded-full bg-cyan-300/30 blur-[1px]" />
              </div>
              {/* Rim */}
              <div
                className="absolute -bottom-1 left-1/2 h-3 w-12 -translate-x-1/2 rounded-full"
                style={{
                  background:
                    'radial-gradient(ellipse at center, rgba(0,255,255,0.5), rgba(0,0,0,0))',
                  filter: 'blur(6px)'
                }}
              />
              {/* Tip */}
              <div className="absolute -bottom-7 left-1/2 h-9 w-9 -translate-x-1/2">
                <div
                  className="absolute inset-0 rotate-45 rounded-md"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(0,255,200,0.9), rgba(120,0,255,0.5))',
                    border: '1px solid rgba(255,255,255,0.35)',
                    boxShadow:
                      '0 0 16px rgba(0,255,200,0.8), 0 0 40px rgba(0,255,255,0.35)'
                  }}
                />
                {/* Tip light */}
                <div className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-cyan-300/80 blur-[2px]" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Subtle holographic rings */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2">
          <div className="h-[700px] w-[700px] rounded-full border border-white/10" style={glowBorder} />
          <div className="absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/10" />
        </div>

        {/* Labels */}
        <div className="pointer-events-none absolute bottom-10 left-1/2 -translate-x-1/2 text-center">
          <div className="text-sm uppercase tracking-[0.35em] text-white/60">Scroll to Sketch</div>
          <div className="mt-1 bg-gradient-to-r from-fuchsia-400 via-cyan-300 to-emerald-300 bg-clip-text text-xl font-semibold text-transparent">
            Holographic Ink Trail
          </div>
        </div>
      </div>
      <div className="h-[120vh] w-full"></div>
    </section>
  )
}

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'

// A 3D-styled pen with a glowing trail that reacts to scroll and mouse.
// Enhancements:
// - Mouse-reactive tilt/parallax and tip glow following cursor
// - Ink color shifts by scroll section (purple -> blue -> aqua)
// - Reduced-motion mode with gentler rendering
// - Mobile polish: fewer particles, lighter glows, DPR-aware canvas
// - Performance: memoized drawing, RAF-timed updates, throttled on reduced motion

export default function Pen3D() {
  const sectionRef = useRef(null)
  const canvasRef = useRef(null)
  const penRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })

  // Map scroll progress to transforms
  const rotZ = useTransform(scrollYProgress, [0, 1], [-25, 35])
  const rotXBase = useTransform(scrollYProgress, [0, 1], [12, -18])
  const rotYBase = useTransform(scrollYProgress, [0, 1], [-10, 15])
  const penXBase = useTransform(scrollYProgress, [0, 1], [-80, 120])
  const penYBase = useTransform(scrollYProgress, [0, 1], [40, -60])

  // Mouse parallax
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotXMouse = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 120, damping: 18 })
  const rotYMouse = useSpring(useTransform(mx, [-0.5, 0.5], [-10, 10]), { stiffness: 120, damping: 18 })
  const penXMouse = useSpring(useTransform(mx, [-0.5, 0.5], [-30, 30]), { stiffness: 140, damping: 20 })
  const penYMouse = useSpring(useTransform(my, [-0.5, 0.5], [-20, 20]), { stiffness: 140, damping: 20 })

  const rotX = useTransform([rotXBase, rotXMouse], ([a, b]) => a + b)
  const rotY = useTransform([rotYBase, rotYMouse], ([a, b]) => a + b)
  const penX = useTransform([penXBase, penXMouse], ([a, b]) => a + b)
  const penY = useTransform([penYBase, penYMouse], ([a, b]) => a + b)

  const [prefs, setPrefs] = useState({ reduced: false, particles: 40, dpr: 1, glow: 1 })

  useEffect(() => {
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isMobile = window.innerWidth < 768
    const dpr = Math.min(window.devicePixelRatio || 1, reduced ? 1 : isMobile ? 1.25 : 2)
    setPrefs({
      reduced,
      particles: reduced ? 10 : isMobile ? 18 : 40,
      dpr,
      glow: reduced ? 0.5 : isMobile ? 0.8 : 1,
    })
  }, [])

  const [dims, setDims] = useState({ w: 0, h: 0 })

  useEffect(() => {
    const resize = () => {
      const el = sectionRef.current
      const canvas = canvasRef.current
      if (!el || !canvas) return
      const w = Math.min(window.innerWidth, 1400)
      const h = Math.min(window.innerHeight, 900)
      // Style size (CSS pixels)
      canvas.style.width = w + 'px'
      canvas.style.height = h + 'px'
      // Internal buffer with DPR scaling
      const bw = Math.floor(w * prefs.dpr)
      const bh = Math.floor(h * prefs.dpr)
      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw
        canvas.height = bh
      }
      setDims({ w, h })
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [prefs.dpr])

  // Color interpolation helpers
  const lerp = (a, b, t) => a + (b - a) * t
  const hsl = (h, s, l, a = 1) => `hsla(${h}, ${s}%, ${l}%, ${a})`
  function segmentColor(p) {
    // 0-0.5: magenta(285,90,55) -> blue(210,100,60), 0.5-1: blue -> aqua(170,95,60)
    if (p <= 0.5) {
      const t = p / 0.5
      const h = lerp(285, 210, t)
      const s = lerp(90, 100, t)
      const l = lerp(55, 60, t)
      return { core: hsl(h, s, l, 0.95), glow1: hsl(h, s, l, 0.35), glow2: hsl(h, s, l, 0.22) }
    } else {
      const t = (p - 0.5) / 0.5
      const h = lerp(210, 170, t)
      const s = lerp(100, 95, t)
      const l = lerp(60, 60, t)
      return { core: hsl(h, s, l, 0.95), glow1: hsl(h, s, l, 0.35), glow2: hsl(h, s, l, 0.22) }
    }
  }

  // Draw neon curve with particles; adapt to DPR
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.scale(prefs.dpr, prefs.dpr)

    let raf
    let last = 0

    const draw = (ts = 0) => {
      const w = dims.w
      const h = dims.h
      if (!w || !h) { raf = requestAnimationFrame(draw); return }

      const p = scrollYProgress.get()

      // Throttle if reduced motion
      const minDelta = prefs.reduced ? 1000 / 24 : 0
      if (ts - last < minDelta) { raf = requestAnimationFrame(draw); return }
      last = ts

      // Clear background
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      // Reset scaling per DPR for drawing in CSS pixels
      ctx.setTransform(prefs.dpr, 0, 0, prefs.dpr, 0, 0)

      // Background gradient glow
      const grd = ctx.createLinearGradient(0, 0, w, h)
      grd.addColorStop(0, 'rgba(120, 0, 255, 0.07)')
      grd.addColorStop(1, 'rgba(0, 220, 255, 0.05)')
      ctx.fillStyle = grd
      ctx.fillRect(0, 0, w, h)

      // Path control points evolve with progress
      const start = { x: w * 0.15, y: h * 0.75 }
      const cp1 = { x: w * (0.25 + p * 0.15), y: h * (0.2 + p * 0.15) }
      const cp2 = { x: w * (0.55 + p * 0.25), y: h * (0.85 - p * 0.45) }
      const end = { x: w * (0.75 + p * 0.15), y: h * (0.35 - p * 0.15) }

      const cols = segmentColor(p)
      const glowScale = prefs.glow

      const drawStroke = (width, color, shadowBlur) => {
        ctx.beginPath()
        ctx.moveTo(start.x, start.y)
        ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y)
        ctx.lineWidth = width
        ctx.strokeStyle = color
        ctx.shadowBlur = shadowBlur * glowScale
        ctx.shadowColor = color
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.stroke()
      }

      // Glow layers (order: outer glows, then core)
      drawStroke(12, cols.glow2, 24)
      drawStroke(8, cols.glow1, 28)
      drawStroke(3, cols.core, 16)

      // Particles along the path
      const N = prefs.particles
      if (N > 0) {
        for (let i = 0; i < N; i++) {
          const t = Math.max(0, Math.min(1, p * 1.1 - i * (1 / N)))
          const x = bezierPoint(start.x, cp1.x, cp2.x, end.x, t)
          const y = bezierPoint(start.y, cp1.y, cp2.y, end.y, t)
          const s = 1 + (1 - t) * 3
          ctx.beginPath()
          ctx.fillStyle = cols.core
          ctx.shadowBlur = 16 * glowScale
          ctx.shadowColor = cols.core
          ctx.arc(x, y, s, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(raf)
  }, [scrollYProgress, dims.w, dims.h, prefs])

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

  // Mouse handling inside sticky stage
  useEffect(() => {
    const stage = sectionRef.current
    if (!stage) return

    const onMove = (e) => {
      const rect = stage.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width
      const y = (e.clientY - rect.top) / rect.height
      mx.set(x - 0.5)
      my.set(y - 0.5)
    }
    const onLeave = () => { mx.set(0); my.set(0) }

    stage.addEventListener('mousemove', onMove)
    stage.addEventListener('mouseleave', onLeave)
    return () => {
      stage.removeEventListener('mousemove', onMove)
      stage.removeEventListener('mouseleave', onLeave)
    }
  }, [mx, my])

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
                {/* Tip light follows cursor subtly */}
                <motion.div
                  className="absolute -bottom-2 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-cyan-300/80 blur-[2px]"
                  style={{
                    x: useTransform(mx, v => v * 8),
                    y: useTransform(my, v => v * -6),
                  }}
                />
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

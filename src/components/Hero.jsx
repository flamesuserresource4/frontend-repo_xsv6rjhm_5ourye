import { motion } from 'framer-motion'
import Spline from '@splinetool/react-spline'

const container = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.12, duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }
  }
}

const item = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
}

export default function Hero() {
  return (
    <div className="relative pt-28">
      {/* Spline 3D Animation */}
      <div className="absolute inset-0 z-0">
        <Spline scene="https://prod.spline.design/4Zh-Q6DWWp5yPnQf/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        {/* Dark overlay with gradient and glow, non-blocking */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_40%,rgba(0,0,0,0),rgba(0,0,0,0.35))]" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 py-24">
        <motion.div variants={container} initial="hidden" animate="visible" className="max-w-3xl">
          <motion.h1 variants={item} className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-cyan-200 to-blue-200 drop-shadow-[0_0_30px_rgba(59,130,246,0.4)]">
            Automating Evaluation, Ensuring Fairness
          </motion.h1>
          <motion.p variants={item} className="mt-6 text-lg sm:text-xl text-cyan-100/80 max-w-xl">
            From paper to precision transition
          </motion.p>
          <motion.div variants={item} className="mt-10 flex items-center gap-4">
            <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} href="#features" className="inline-flex items-center rounded-full px-5 py-3 text-sm font-semibold text-black bg-gradient-to-r from-cyan-300 to-purple-300 shadow-[0_10px_40px_rgba(59,130,246,0.35)]">
              Explore Features
            </motion.a>
            <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} href="#about" className="inline-flex items-center rounded-full px-5 py-3 text-sm font-semibold text-cyan-100/90 border border-cyan-300/30 backdrop-blur-xl bg-white/5">
              How it works
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Floating geometric shapes and streaks */}
        <div className="pointer-events-none absolute inset-0">
          <motion.div
            className="absolute top-40 right-20 h-24 w-24 rounded-3xl border border-cyan-300/40 bg-white/5 backdrop-blur-xl shadow-[0_0_40px_rgba(34,211,238,0.25)]"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-20 left-8 h-16 w-16 rounded-full border border-purple-400/40 bg-white/5 backdrop-blur-xl shadow-[0_0_40px_rgba(168,85,247,0.25)]"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-10 left-1/3 h-[2px] w-40 bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent"
            animate={{ x: [-40, 40] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </div>
  )
}

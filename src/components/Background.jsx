import { motion } from 'framer-motion'

const gradientVariants = {
  animate: {
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    transition: { duration: 20, repeat: Infinity, ease: 'linear' }
  }
}

function Particles({ count = 60 }) {
  const particles = Array.from({ length: count })
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((_, i) => {
        const size = Math.random() * 3 + 1
        const left = Math.random() * 100
        const delay = Math.random() * 10
        const duration = Math.random() * 20 + 10
        const blur = Math.random() * 4
        return (
          <motion.span
            key={i}
            className="absolute rounded-full bg-cyan-300/30 shadow-[0_0_20px_4px_rgba(34,211,238,0.15)]"
            style={{ width: size, height: size, left: `${left}%`, top: '-10%' }}
            initial={{ y: '-10%', opacity: 0 }}
            animate={{ y: '110%', opacity: [0, 1, 0.6, 0] }}
            transition={{ duration, delay, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span style={{ filter: `blur(${blur}px)` }} />
          </motion.span>
        )
      })}
    </div>
  )
}

export default function Background() {
  return (
    <div className="fixed inset-0 -z-0">
      {/* Animated holographic gradient */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(168,85,247,0.25),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(59,130,246,0.25),transparent_45%),radial-gradient(circle_at_40%_80%,rgba(34,211,238,0.25),transparent_40%)]"
      />
      <motion.div
        className="absolute inset-0 bg-[linear-gradient(120deg,#6d28d9,#2563eb,#06b6d4,#6d28d9)] bg-[length:200%_200%] opacity-30"
        variants={gradientVariants}
        animate="animate"
      />

      {/* Soft atmospheric glows */}
      <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-[28rem] w-[28rem] rounded-full bg-cyan-400/20 blur-3xl" />

      {/* Moving gradient waves */}
      <div className="absolute inset-x-0 top-0 h-72 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute -top-20 left-0 right-0 h-72 opacity-40"
          style={{ background: 'radial-gradient(120%_50% at 50% 50%, rgba(59,130,246,0.35), transparent 60%)' }}
          animate={{ x: ['-10%', '10%', '-10%'] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -top-16 left-0 right-0 h-64 opacity-30"
          style={{ background: 'radial-gradient(120%_50% at 50% 50%, rgba(168,85,247,0.35), transparent 60%)' }}
          animate={{ x: ['10%', '-10%', '10%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Floating particles */}
      <Particles />
    </div>
  )
}

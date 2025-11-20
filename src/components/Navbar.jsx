import { motion } from 'framer-motion'

export default function Navbar() {
  return (
    <div className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-[0_0_40px_rgba(59,130,246,0.15)]">
          <div className="flex items-center gap-3 pl-4">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-400 shadow-[0_0_20px_rgba(59,130,246,0.35)]" />
            <span className="text-white/90 font-semibold tracking-wide">AI Eval Pro</span>
          </div>
          <div className="flex items-center gap-3 pr-4">
            {['Features','About','Contact'].map((item)=> (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-sm text-white/70 hover:text-white transition-colors px-2 py-2 rounded-lg">
                {item}
              </a>
            ))}
            <motion.a
              whileHover={{ scale: 1.04, boxShadow: '0 0 30px rgba(34,211,238,0.5)' }}
              whileTap={{ scale: 0.98 }}
              href="#contact"
              className="ml-2 inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-cyan-100 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 border border-cyan-300/30 shadow-[0_0_20px_rgba(34,211,238,0.35)] hover:shadow-[0_0_35px_rgba(34,211,238,0.55)] transition-all"
            >
              Get Early Access
            </motion.a>
          </div>
        </div>
      </div>
    </div>
  )
}

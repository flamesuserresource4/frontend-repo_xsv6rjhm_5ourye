import { motion } from 'framer-motion'

export default function Contact() {
  return (
    <section id="contact" className="relative py-24">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <h2 className="text-3xl font-bold text-white/90">Stay in the loop</h2>
        <p className="mt-3 text-white/70">Join the early access list. We’ll reach out with updates.</p>
        <form onSubmit={(e)=> e.preventDefault()} className="mt-8 grid grid-cols-1 gap-4">
          <motion.input whileFocus={{ boxShadow: '0 0 30px rgba(34,211,238,0.35)' }} type="text" placeholder="Your name" className="w-full rounded-xl bg-transparent border border-cyan-300/30 px-4 py-3 text-white placeholder:text-white/40 outline-none backdrop-blur-xl" />
          <motion.input whileFocus={{ boxShadow: '0 0 30px rgba(34,211,238,0.35)' }} type="email" placeholder="Email address" className="w-full rounded-xl bg-transparent border border-cyan-300/30 px-4 py-3 text-white placeholder:text-white/40 outline-none backdrop-blur-xl" />
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="rounded-xl border border-white/20 bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 text-black font-semibold py-3 shadow-[0_10px_40px_rgba(59,130,246,0.35)]">
            Request Access
          </motion.button>
        </form>
      </div>
    </section>
  )
}

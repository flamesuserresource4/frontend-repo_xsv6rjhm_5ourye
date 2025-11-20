import { motion } from 'framer-motion'

export default function About() {
  return (
    <section id="about" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white/90">Paper to Precision</h2>
            <p className="mt-4 text-white/70">
              A secure pipeline converts handwritten scripts into structured knowledge graphs, evaluates with rubric-aware reasoning, and calibrates outcomes for fairness.
            </p>
            <ul className="mt-6 space-y-3 text-white/70 text-sm">
              <li>• Privacy-first ingestion with redaction</li>
              <li>• Multi-pass OCR with confidence aggregation</li>
              <li>• Rubric alignment via LLM chains</li>
              <li>• Fairness audits and score normalization</li>
            </ul>
          </div>
          <div className="relative">
            <div className="relative h-72 rounded-3xl overflow-hidden border border-white/10 backdrop-blur-xl bg-white/5">
              {/* Hologram: paper → AI → precision */}
              <motion.div className="absolute left-6 top-1/2 -translate-y-1/2 h-32 w-24 rounded-xl border border-white/20 bg-white/10" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} />
              <motion.div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-24 w-24 rounded-full border border-purple-400/40 bg-purple-500/20" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} />
              <motion.div className="absolute right-6 top-1/2 -translate-y-1/2 h-16 w-36 rounded-xl border border-cyan-300/40 bg-cyan-400/20" initial={{ opacity: 0, x: 10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} />
              <motion.div className="absolute left-24 right-24 top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-purple-400/0 via-cyan-300/70 to-purple-400/0" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 2, repeat: Infinity }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

import { motion } from 'framer-motion'
import { Brain, ScanText, ShieldCheck, LayoutDashboard } from 'lucide-react'

const features = [
  {
    title: 'AI OCR Processing',
    icon: ScanText,
    desc: 'High-accuracy handwritten text extraction with adaptive preprocessing and denoising.'
  },
  {
    title: 'Semantic Evaluation',
    icon: Brain,
    desc: 'Large-language-model powered rubric alignment, reasoning chains, and scoring.'
  },
  {
    title: 'Fairness Verification',
    icon: ShieldCheck,
    desc: 'Bias detection across cohorts with transparent audit trails and score calibration.'
  },
  {
    title: 'Real-Time Dashboard',
    icon: LayoutDashboard,
    desc: 'Live ingestion, analytics, and anomaly monitoring with exportable insights.'
  }
]

export default function Features() {
  return (
    <section id="features" className="relative py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white/90">Core Capabilities</h2>
          <p className="mt-3 text-white/60 max-w-2xl">Four pillars power the evaluation pipeline from paper to precision with provable fairness.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="relative rounded-2xl p-6 backdrop-blur-xl bg-white/5 border border-white/10 shadow-[0_10px_60px_rgba(59,130,246,0.15)] overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-400/10" />
              <div className="relative z-10">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center text-black shadow-[0_0_30px_rgba(59,130,246,0.35)]">
                    <f.icon className="h-6 w-6 text-black" />
                  </div>
                  <h3 className="text-white font-semibold">{f.title}</h3>
                </div>
                <p className="mt-3 text-white/70 text-sm leading-relaxed">{f.desc}</p>
              </div>
              <motion.div
                className="absolute -bottom-10 -right-10 h-36 w-36 rounded-full bg-cyan-400/20 blur-2xl"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

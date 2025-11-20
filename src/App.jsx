import Background from './components/Background'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import About from './components/About'
import Contact from './components/Contact'
import Pen3D from './components/Pen3D'

function App() {
  return (
    <div className="relative min-h-screen text-white">
      <Background />
      <Navbar />
      <main>
        <Hero />
        <Pen3D />
        <Features />
        <About />
        <Contact />
      </main>
      <footer className="relative z-10 py-10 text-center text-white/60">
        © {new Date().getFullYear()} AI Eval Pro — Crafted with precision
      </footer>
    </div>
  )
}

export default App

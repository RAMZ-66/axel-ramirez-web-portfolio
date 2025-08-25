import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition ${scrolled ? 'bg-black/60 backdrop-blur' : 'bg-transparent'}`}>
      <div className="section flex items-center justify-between py-4">
        <Link href="/" className="font-bold tracking-wide">
          <span className="text-white">Axel</span><span className="text-accent">Ramirez</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted">
          <a href="#work" className="hover:text-white">Work</a>
          <a href="#about" className="hover:text-white">About</a>
          <a href="#contact" className="hover:text-white">Contact</a>
        </nav>
        <a href="#contact" className="button-primary">Let’s talk</a>
      </div>
    </header>
  )
}

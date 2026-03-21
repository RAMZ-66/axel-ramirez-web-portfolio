import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useLang } from '@/context/LanguageContext'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const { lang, toggle, tr } = useLang()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition ${scrolled ? 'bg-black/60 backdrop-blur' : 'bg-transparent'}`}>
      <div className="section flex items-center justify-between py-4">
        <Link href="/" className="font-normal tracking-wide">
          <span className="text-white">Axel</span><span className="text-accent">Ramirez</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm text-muted">
          <a href="#work" className="hover:text-white">{tr.nav.work}</a>
          <a href="#about" className="hover:text-white">{tr.nav.about}</a>
          <a href="#contact" className="hover:text-white">{tr.nav.contact}</a>
        </nav>
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="text-xs font-medium text-muted hover:text-white transition tracking-widest uppercase"
            aria-label="Toggle language"
          >
            {lang === 'en' ? 'ES' : 'EN'}
          </button>
          <a href="#contact" className="button-secondary">{tr.nav.cta}</a>
        </div>
      </div>
    </header>
  )
}

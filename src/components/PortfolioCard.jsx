import Image from 'next/image'
import { useLang } from '@/context/LanguageContext'

// 'YYYY-MM' -> 'October 2026' / 'octubre de 2026'
function formatLaunch(launched, lang) {
  const [year, month] = launched.split('-').map(Number)
  return new Intl.DateTimeFormat(lang, { month: 'long', year: 'numeric' }).format(new Date(year, month - 1))
}

export default function PortfolioCard({ title, img, hoverImg, tags = [], link = '#', delay = 0, featured = false, launched }) {
  const { lang, tr } = useLang()

  return (
    <a href={link} target="_blank" rel="noreferrer"
       className={`group rounded-xl border border-white/20 hover:border-accent overflow-hidden hover:-translate-y-1 transition transform-gpu portfolio-card ${featured ? 'md:col-span-2' : ''}`}
       style={{ animationDelay: `${delay}ms` }}>
      <div className={`relative w-full overflow-hidden ${featured ? 'h-72 md:h-[28rem]' : 'h-56'}`}>
        {/* White gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100"></div>
        {/* Default image */}
        <Image src={img} alt={title} fill className={`object-contain transition-opacity duration-500 ease-in-out opacity-30 group-hover:opacity-0 ${featured ? 'p-10 md:p-16' : 'p-4'}`}/>
        {/* Hover image */}
        {hoverImg && (
          <Image src={hoverImg} alt={`${title} preview`} fill className="object-cover transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100"/>
        )}
        {featured && launched && (
          <span className="absolute top-4 left-4 z-10 text-xs font-semibold px-3 py-1 rounded-full bg-bg/80 text-accent border border-accent/40 backdrop-blur-sm">
            {tr.work.launched} {formatLaunch(launched, lang)}
          </span>
        )}
      </div>
      <div className={featured ? 'p-6 md:p-8' : 'p-5'}>
        <h3 className={`font-semibold mb-2 ${featured ? 'text-2xl md:text-3xl' : 'text-lg'}`}>{title}</h3>
        <div className="flex flex-wrap gap-2 text-xs text-muted mb-3">
          {tags.map(t => <span key={t} className="px-2 py-1 rounded bg-white/5 border border-white/10">{t}</span>)}
        </div>
        <span className="link">View project →</span>
      </div>
    </a>
  )
}

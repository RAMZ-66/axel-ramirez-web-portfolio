import Image from 'next/image'

export default function PortfolioCard({ title, img, hoverImg, tags = [], link = '#', delay = 0 }) {
  return (
    <a href={link} target="_blank" rel="noreferrer"
       className="group rounded-xl border border-white/20 hover:border-accent overflow-hidden hover:-translate-y-1 transition transform-gpu portfolio-card"
       style={{ animationDelay: `${delay}ms` }}>
      <div className="relative h-56 w-full overflow-hidden">
        {/* White gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100"></div>
        {/* Default image */}
        <Image src={img} alt={title} fill className="object-contain transition-opacity duration-500 ease-in-out opacity-30 group-hover:opacity-0 p-4"/>
        {/* Hover image */}
        {hoverImg && (
          <Image src={hoverImg} alt={`${title} preview`} fill className="object-cover transition-opacity duration-500 ease-in-out opacity-0 group-hover:opacity-100"/>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <div className="flex flex-wrap gap-2 text-xs text-muted mb-3">
          {tags.map(t => <span key={t} className="px-2 py-1 rounded bg-white/5 border border-white/10">{t}</span>)}
        </div>
        <span className="link">View project →</span>
      </div>
    </a>
  )
}

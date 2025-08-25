import Image from 'next/image'

export default function PortfolioCard({ title, img, tags = [], link = '#', delay = 0 }) {
  return (
    <a href={link} target="_blank" rel="noreferrer"
       className="card group overflow-hidden hover:-translate-y-1 hover:shadow-xl transition transform-gpu portfolio-card"
       style={{ animationDelay: `${delay}ms` }}>
      <div className="relative h-56 w-full overflow-hidden">
        <Image src={img} alt={title} fill className="object-cover transition scale-105 group-hover:scale-110"/>
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

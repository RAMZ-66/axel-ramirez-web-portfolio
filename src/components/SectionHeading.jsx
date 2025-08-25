export default function SectionHeading({ kicker, title, subtitle }) {
  return (
    <div className="max-w-3xl mb-10">
      {kicker && <div className="text-xs uppercase tracking-widest text-accent/80 mb-2">{kicker}</div>}
      <h2 className="text-3xl md:text-4xl font-bold mb-3">{title}</h2>
      {subtitle && <p className="text-muted">{subtitle}</p>}
    </div>
  )
}

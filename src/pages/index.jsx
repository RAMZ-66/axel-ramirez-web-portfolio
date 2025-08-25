import Head from 'next/head'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SectionHeading from '@/components/SectionHeading'
import PortfolioCard from '@/components/PortfolioCard'
import ThreeHero from '@/components/ThreeHero'
import ThreeScene from '@/components/ThreeScene'
import { useEffect } from 'react'
import { fadeUpStagger } from '../utils/gsapAnimations'

export default function Home() {
  useEffect(() => {
    fadeUpStagger('.reveal')
    fadeUpStagger('.portfolio-card')
  }, [])

  const projects = [
    {
      title: 'Industrial Automation Website',
      img: '/images/industrial-automation.svg',
      tags: ['Next.js', 'Tailwind', 'SEO', 'Lead Gen'],
      link: '#'
    },
    {
      title: 'Consulting Company Website',
      img: '/images/consulting-company.svg',
      tags: ['React', 'Animations', 'Content Strategy'],
      link: '#'
    }
  ]

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Axel Ramirez",
    "jobTitle": "Web Developer & SEO Specialist",
    "url": "https://your-domain.com/",
    "sameAs": [
      "https://www.linkedin.com/",
      "https://github.com/"
    ]
  }

  return (
    <>
      <Head>
        <title>Axel Ramirez — Web Developer & SEO Specialist</title>
        <meta name="description" content="Portfolio of Axel Ramirez, a web developer and SEO specialist. I build fast, elegant websites with modern UX and 3D interactions." />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </Head>

      <Header />

      {/* Hero */}
      <section className="relative pt-28 md:pt-32 pb-20 section">
        <ThreeHero />
        <div className="max-w-3xl reveal">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            I design and build modern web experiences.
          </h1>
          <p className="text-muted mb-8">
            I’m <strong>Axel Ramirez</strong>, a Web Developer & SEO Specialist focused on performance, accessibility, and delightful interactions.
          </p>
          <div className="flex gap-3">
            <a href="#work" className="button-primary">See my work</a>
            <a href="#contact" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-white/10 hover:border-white/20 transition">Contact me</a>
          </div>
        </div>
      </section>

      {/* Work */}
      <section id="work" className="section py-16">
        <SectionHeading
          kicker="Selected Work"
          title="Projects that ship value"
          subtitle="A snapshot of recent client work. Optimized for conversions, built for scale."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((p, i) => (
            <PortfolioCard key={p.title} delay={i * 120} {...p} />
          ))}
        </div>
      </section>

      {/* 3D Section */}
      <section className="section py-20">
        <SectionHeading
          kicker="Playground"
          title="Interactive 3D"
          subtitle="Lightweight Three.js scene. Replace with your GLB when ready."
        />
        <ThreeScene modelUrl="/3d/placeholder.glb" />
      </section>

      {/* About */}
      <section id="about" className="section py-20">
        <SectionHeading
          kicker="About"
          title="What I bring"
          subtitle="Full-stack foundations, strong SEO, and an eye for motion design."
        />
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { t: 'Performance & SEO', d: 'Core Web Vitals, technical SEO, and clean architectures for lasting results.' },
            { t: 'Modern Frontend', d: 'Next.js, React, Tailwind, GSAP & Three.js for polished UX.' },
            { t: 'Scalable Backends', d: 'Prepared for Node/Express microservices and future tools (e.g., image optimizer).' }
          ].map((b) => (
            <div key={b.t} className="card p-6 reveal">
              <h3 className="font-semibold mb-2">{b.t}</h3>
              <p className="text-muted">{b.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section py-20">
        <SectionHeading
          kicker="Contact"
          title="Let’s build something great"
          subtitle="Tell me about your project. I usually reply within 1–2 business days."
        />
        <form className="card p-6 grid md:grid-cols-2 gap-4 max-w-3xl reveal" method="post" action="/api/contact">
          <input className="bg-black/30 border border-white/10 rounded px-4 py-3 outline-none focus:border-accent" name="name" placeholder="Your name" required />
          <input className="bg-black/30 border border-white/10 rounded px-4 py-3 outline-none focus:border-accent" type="email" name="email" placeholder="Email address" required />
          <input className="bg-black/30 border border-white/10 rounded px-4 py-3 outline-none focus:border-accent md:col-span-2" name="subject" placeholder="Subject" />
          <textarea className="bg-black/30 border border-white/10 rounded px-4 py-3 outline-none focus:border-accent md:col-span-2" name="message" placeholder="Project details" rows="5" required />
          <button className="button-primary md:col-span-2" type="submit">Send message</button>
        </form>
      </section>

      <Footer />
    </>
  )
}

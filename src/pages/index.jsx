import Head from 'next/head'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SectionHeading from '@/components/SectionHeading'
import PortfolioCard from '@/components/PortfolioCard'
import ThreeHero from '@/components/ThreeHero'
import ThreeShowcase from '@/components/ThreeShowcase'
import ReCaptcha from '@/components/ReCaptcha'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import { useEffect, useState, useCallback, useRef } from 'react'
import { fadeUpStagger } from '../utils/gsapAnimations'
import { useLang } from '@/context/LanguageContext'

export default function Home() {
  const { tr } = useLang()
  const [recaptchaExecute, setRecaptchaExecute] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const galleryImages = [
    { src: '/images/axel-1.webp',  alt: 'Axel front picture' },
    { src: '/images/axel-2.webp', alt: 'Axel giving a talk' },
    { src: '/images/axel-3.webp', alt: 'Axel Ramirez' },
  ];
  const [activeIdx, setActiveIdx] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx(prev => (prev + 1) % galleryImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const skillsSectionRef = useRef(null)
  const skillsTrackRef = useRef(null)

  useEffect(() => {
    fadeUpStagger('.reveal')
    fadeUpStagger('.portfolio-card')

    // Horizontal scroll animation for skill cards
    const initHorizontalScroll = async () => {
      if (typeof window === 'undefined') return
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/dist/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      const section = skillsSectionRef.current
      const track = skillsTrackRef.current
      if (!section || !track) return

      // Skip horizontal scroll on mobile — cards are stacked vertically instead
      if (window.innerWidth < 768) return

      const totalScrollWidth = track.scrollWidth - window.innerWidth
      const scrollDistance = totalScrollWidth * 0.33

      // Set section height to accommodate the horizontal scroll distance
      section.style.height = `${scrollDistance + window.innerHeight}px`

      gsap.to(track, {
        x: -totalScrollWidth,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${scrollDistance}`,
          pin: '.sticky',
          scrub: 1,
        }
      })
    }

    initHorizontalScroll()
  }, [])

  const handleRecaptchaChange = useCallback((executeFunction) => {
    setRecaptchaExecute(() => executeFunction);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!recaptchaExecute) {
      setSubmitStatus({ type: 'error', message: tr.contact.recaptchaNotReady });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Execute reCAPTCHA to get token
      const recaptchaToken = await recaptchaExecute();
      
      if (!recaptchaToken) {
        setSubmitStatus({ type: 'error', message: tr.contact.recaptchaError });
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData(e.target);
      const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        recaptchaToken: recaptchaToken
      };

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
          setSubmitStatus({ type: 'success', message: tr.contact.successMsg });
          e.target.reset();
        } else {
          setSubmitStatus({ type: 'error', message: result.error || tr.contact.errorMsg });
        }
      } catch (error) {
        console.error('Contact form error:', error);
        setSubmitStatus({ type: 'error', message: tr.contact.genericError });
      } finally {
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('reCAPTCHA execution error:', error);
      setSubmitStatus({ type: 'error', message: tr.contact.recaptchaError });
      setIsSubmitting(false);
    }
  };

  const projects = [
    {
      title: 'DMI - Industrial Automation',
      img: '/images/client-work/dmi-logo.avif',
      hoverImg: '/images/client-work/dmi-website-ss.avif',
      tags: ['JavaScript', 'CSS animations', 'WordPress', 'Multilingual (WPML)', 'Technical SEO'],
      link: 'https://dmiindustriessuppliesinc.com/',
      featured: true,
      launched: '2026-10'
    },
    {
      title: 'Ripipsa - Industrial Automation',
      img: '/images/ripipsa-logo.png',
      hoverImg: '/images/client-work/ripipsa-1.webp',
      tags: ['PHP', 'JavaScript', 'WordPress', 'Role-based access', 'CI/CD'],
      link: 'https://ripipsa.com/'
    },
    {
      title: 'Merodio - Consulting Company',
      img: '/images/merodio-consultores-logo.webp',
      hoverImg: '/images/client-work/merodio-1.webp',
      tags: ['WordPress', 'Elementor', 'Content SEO', 'Blog strategy'],
      link: 'https://merodio.com.mx/'
    },
    {
      title: 'Bosch Car Service - Autoshop',
      img: '/images/bosch-service-logo.webp',
      hoverImg: '/images/client-work/carservicebosch-1.webp',
      tags: ['WordPress', 'Elementor', 'Local SEO'],
      link: 'https://carservicebosch.com/'
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
      <section className="relative py-80 md:py-80 section">
        <ThreeHero />
        <div className="max-w-full mx-auto text-center space-y-8 reveal">
          <h1 className="text-3xl md:text-8xl font-bold md:leading-tight mb-6w ">
            {tr.hero.heading1} <span className="text-outline-mobile md:text-outline">{tr.hero.headingHighlight}</span> {tr.hero.heading2}
          </h1>
          <p className="text-muted mb-8" dangerouslySetInnerHTML={{ __html: tr.hero.sub }} />
          <div className="flex gap-3 justify-center">
            <a href="#work" className="button-primary">{tr.hero.btnWork}</a>
            <a href="#contact" className="button-secondary">{tr.hero.btnContact}</a>
          </div>
        </div>
      </section>

      {/* Work */}
      <section id="work" className="section py-52">
        <SectionHeading
          kicker={tr.work.kicker}
          title={tr.work.title}
          subtitle={tr.work.subtitle}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((p, i) => (
            <PortfolioCard key={p.title} delay={i * 120} {...p} />
          ))}
        </div>
      </section>

      {/* 3D Section */}
      <section className="section py-10 md:py-20">
        <SectionHeading
          kicker={tr.three.kicker}
          title={tr.three.title}
          subtitle={tr.three.subtitle}
        />
        <ThreeShowcase />
      </section>

      {/* About */}
      <section id="about" className="py-40">
        <div className="section mb-16">
          <SectionHeading
            kicker={tr.about.kicker}
            title={tr.about.title}
            subtitle={tr.about.subtitle}
          />
        </div>

        {/* Horizontal scroll skill cards */}
        <div ref={skillsSectionRef} className="relative">
          <div className="md:sticky top-0 md:h-screen flex md:items-center md:overflow-hidden">
            <div ref={skillsTrackRef} className="flex flex-col md:flex-row">
              {[
                {
                  icon: (
                    <svg className="w-12 h-12 mx-auto mb-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="16 18 22 12 16 6" />
                      <polyline points="8 6 2 12 8 18" />
                    </svg>
                  ),
                  video: '/videos/frontend-loop.mp4',
                  videoWebm: '/videos/front-bg-video.webm',
                  poster: '/images/client-work/merodio-1.webp'
                },
                {
                  icon: (
                    <svg className="w-12 h-12 mx-auto mb-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="8" rx="2" />
                      <rect x="2" y="14" width="20" height="8" rx="2" />
                      <line x1="6" y1="6" x2="6.01" y2="6" />
                      <line x1="6" y1="18" x2="6.01" y2="18" />
                    </svg>
                  ),
                  video: '/videos/backend-loop.mp4',
                  videoWebm: '/videos/back-bg-video.webm',
                  poster: '/images/client-work/ripipsa-1.webp'
                },
                {
                  icon: (
                    <svg className="w-12 h-12 mx-auto mb-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" />
                      <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      <polyline points="8 13 11 10 13 12 16 8" />
                    </svg>
                  ),
                  video: '/videos/seo-bg-video.mp4',
                  videoWebm: '/videos/seo-bg-video.webm',
                  poster: '/images/seo-video-poster.webp'
                }
              ].map((b, i) => {
                const card = tr.about.cards[i]
                return (
                <div key={card.t} className="relative w-screen h-[75vh] md:h-screen md:flex-shrink-0 flex items-center justify-center">
                  {/* Video background */}
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    poster={b.poster}
                    className="absolute inset-0 w-full h-full object-cover"
                  >
                    {b.videoWebm && <source src={b.videoWebm} type="video/webm" />}
                    <source src={b.video} type="video/mp4" />
                  </video>
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-black/80" />
                  {/* Content */}
                  <div className="relative z-10 text-center max-w-xl px-6">
                    {b.icon}
                    <h3 className="text-3xl md:text-4xl font-bold mb-3">{card.t}</h3>
                    <p className="text-base md:text-lg text-white/80">{card.d}</p>
                  </div>
                </div>
              )})}

            </div>
          </div>
        </div>
        {/* Extra info about me */}
        <div className="flex p flex-col columns-2 justify-center md:flex-row items-center gap-8 pt-28 section">
          <div className="flex-1 flex flex-col justify-center text-left">
            <h3 className="text-2xl font-semibold pb-6">{tr.about.moreTitle}</h3>
            <p className="text-muted" dangerouslySetInnerHTML={{ __html: tr.about.morePara }} />
            <div className="space-y-2 pt-6">
              <p className="text-muted"><strong>{tr.about.educationLabel}:</strong> {tr.about.education}</p>
              <p className="text-muted"><strong>{tr.about.focusLabel}:</strong> {tr.about.focus}</p>
              <p className="text-muted"><strong>{tr.about.skillsetLabel}:</strong> {tr.about.skillset}</p>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="relative rounded-2xl overflow-hidden w-80 h-80 md:w-96 md:h-96">
              {galleryImages.map(({ src, alt }, i) => (
                <div
                  key={src}
                  className="gallery-slide"
                  style={{ opacity: i === activeIdx ? 1 : 0 }}
                >
                  <Image key={activeIdx === i ? src : undefined} src={src} alt={alt} fill sizes="(max-width: 768px) 320px, 384px" unoptimized />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section py-20">
        <SectionHeading
          kicker={tr.contact.kicker}
          title={tr.contact.title}
          subtitle={tr.contact.subtitle}
        />
        <GoogleReCaptchaProvider
          reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
          scriptProps={{
            async: true,
            defer: true,
            appendTo: 'body',
          }}
        >
          {/* Debug: Check if environment variable is loaded */}
          {console.log('reCAPTCHA Site Key:', process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY)}
          <form className="rounded-xl border border-white/20 hover:border-accent transition p-6 grid md:grid-cols-2 gap-4 max-w reveal" onSubmit={handleSubmit}>
            <input className="bg-black/30 border border-white/10 rounded px-4 py-3 outline-none focus:border-accent" name="name" placeholder={tr.contact.name} required />
            <input className="bg-black/30 border border-white/10 rounded px-4 py-3 outline-none focus:border-accent" type="email" name="email" placeholder={tr.contact.email} required />
            <input className="bg-black/30 border border-white/10 rounded px-4 py-3 outline-none focus:border-accent md:col-span-2" name="subject" placeholder={tr.contact.subject} />
            <textarea className="bg-black/30 border border-white/10 rounded px-4 py-3 outline-none focus:border-accent md:col-span-2" name="message" placeholder={tr.contact.message} rows="5" required />
            
            {/* reCAPTCHA v3 - runs invisibly in background */}
            <div className="md:col-span-2">
              <ReCaptcha onChange={handleRecaptchaChange} />
            </div>

            {/* Status Messages */}
            {submitStatus && (
              <div className={`md:col-span-2 p-3 rounded-lg ${
                submitStatus.type === 'success'
                  ? 'bg-green-500/20 border border-green-500/30 text-green-300'
                  : 'bg-red-500/20 border border-red-500/30 text-red-300'
              }`}>
                {submitStatus.message}
              </div>
            )}

            <button 
              className="button-primary md:col-span-2" 
              type="submit" 
              disabled={isSubmitting || !recaptchaExecute}
            >
              {isSubmitting ? tr.contact.sending : tr.contact.send}
              {!isSubmitting && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              )}
            </button>
          </form>
        </GoogleReCaptchaProvider>
      </section>

      <Footer />
    </>
  )
}

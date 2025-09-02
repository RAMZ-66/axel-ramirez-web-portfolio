import Head from 'next/head'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SectionHeading from '@/components/SectionHeading'
import PortfolioCard from '@/components/PortfolioCard'
import ThreeHero from '@/components/ThreeHero'
import ThreeScene from '@/components/ThreeScene'
import ReCaptcha from '@/components/ReCaptcha'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'
import { useEffect, useState } from 'react'
import { fadeUpStagger } from '../utils/gsapAnimations'

export default function Home() {
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    fadeUpStagger('.reveal')
    fadeUpStagger('.portfolio-card')
  }, [])

  const handleRecaptchaChange = (token) => {
    setRecaptchaToken(token);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!recaptchaToken) {
      setSubmitStatus({ type: 'error', message: 'Please complete the reCAPTCHA verification.' });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

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
        setSubmitStatus({ type: 'success', message: 'Message sent successfully! I\'ll get back to you soon.' });
        e.target.reset();
        setRecaptchaToken(null);
        // Reset reCAPTCHA
        if (window.grecaptcha) {
          window.grecaptcha.reset();
        }
      } else {
        setSubmitStatus({ type: 'error', message: result.error || 'Failed to send message. Please try again.' });
      }
    } catch (error) {
      console.error('Contact form error:', error);
      setSubmitStatus({ type: 'error', message: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const projects = [
    {
      title: 'Industrial Automation Company',
      img: '/images/intechmotion-logo.png',
      tags: ['SEO', 'UI/UX', 'Web architecture'],
      link: 'https://intechmotion.com/'
    },
    {
      title: 'Industrial Automation Company',
      img: '/images/ripipsa-logo.png',
      tags: ['SEO', 'UI/UX', 'Web architecture','Dynamic content (User credentials based) ', 'CI/CD'],
      link: 'https://ripipsa.com/'
    },
    {
      title: 'Consulting Company Website',
      img: '/images/merodio-consultores-logo.webp',
      tags: ['SEO', 'Blog content strategy', 'Custom solutions'],
      link: 'https://merodio.com.mx/'
    },
    {
      title: 'Local Autoshop',
      img: '/images/bosch-service-logo.webp',
      tags: ['Local SEO', 'Brand consistency'],
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
        <div className="max-w-full mx-auto text-center reveal">
          <h1 className="text-3xl md:text-8xl font-bold leading-tight mb-6">
            Making Unforgettable Web Experiences
          </h1>
          <p className="text-muted mb-8">
            Hi there, I&apos;m <strong>Axel</strong>. Web Developer & SEO Specialist focused on dynamic web experiences that drive results.
          </p>
          <div className="flex gap-3 justify-center">
            <a href="#work" className="button-primary">See my work</a>
            <a href="#contact" className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-white/10 hover:border-white/20 transition">Contact me</a>
          </div>
        </div>
      </section>

      {/* Work */}
      <section id="work" className="section py-52">
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
      <section className="section py-10 md:py-20">
        <SectionHeading
          kicker="Playground"
          title="Interactive 3D"
          subtitle="Lightweight Three.js model, scene coming soon..."
        />
        <ThreeScene modelUrl="/3d/placeholder.glb" />
      </section>

      {/* About */}
      <section id="about" className="section py-40">
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
        {/* Extra info about me */}
        <div className="flex flex-col md:flex-row items-center gap-8 pt-28">
          <div className="flex-1 space-y-4 max-w-md">
            <h3 className="text-2xl font-semibold">More About Me</h3>
            <p className="text-muted">
              I'm a <strong>Web developer</strong> with a passion for technology and innovation. 
              My background combines technical expertise with creative problem-solving, resulting in awesome projects that create value I'm also a big time gamer, gym rat and chilaquiles lover.
            </p>
            <div className="space-y-2 pt-10">
              <p className="text-muted">
                <strong>Education:</strong> Multimedia Engineering Bachelor's Degree
              </p>
              <p className="text-muted">
                <strong>Focus:</strong> Web Development & SEO Optimization
              </p>
              <p className="text-muted">
                <strong>General skillset:</strong> Fulltsack web development, SEO, Web design, 3D design, Videogame development, Video production, Marketing, and more.
              </p>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <Image 
              src="/images/axel-picture.jpg" 
              alt="Axel Ramirez" 
              width={400} 
              height={400} 
              className="rounded-full"
            />
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section py-20">
        <SectionHeading
          kicker="Contact"
          title="Let’s build something great"
          subtitle="Tell me what you have in mind."
        />
        <GoogleReCaptchaProvider
          reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
          scriptProps={{
            async: false,
            defer: false,
            appendTo: 'head',
            nonce: undefined,
          }}
        >
          <form className="card p-6 grid md:grid-cols-2 gap-4 max-w-3xl reveal" onSubmit={handleSubmit}>
            <input className="bg-black/30 border border-white/10 rounded px-4 py-3 outline-none focus:border-accent" name="name" placeholder="Your name" required />
            <input className="bg-black/30 border border-white/10 rounded px-4 py-3 outline-none focus:border-accent" type="email" name="email" placeholder="Email address" required />
            <input className="bg-black/30 border border-white/10 rounded px-4 py-3 outline-none focus:border-accent md:col-span-2" name="subject" placeholder="Subject" />
            <textarea className="bg-black/30 border border-white/10 rounded px-4 py-3 outline-none focus:border-accent md:col-span-2" name="message" placeholder="Project details" rows="5" required />
            
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
              disabled={isSubmitting || !recaptchaToken}
            >
              {isSubmitting ? 'Sending...' : 'Send message'}
            </button>
          </form>
        </GoogleReCaptchaProvider>
      </section>

      <Footer />
    </>
  )
}

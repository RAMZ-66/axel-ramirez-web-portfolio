# Axel Ramirez — Portfolio (Next.js)

Modern dark-themed portfolio built with Next.js, Tailwind CSS, GSAP scroll animations, and a Three.js scene.
Prepared for Vercel deployment and future custom backend (Node/Express).

## Quick Start
```bash
npm install
npm run dev
```
Visit http://localhost:3000

## Deploy to Vercel
- Push to GitHub
- Import repo in Vercel — default settings work

## Structure
- `src/pages` — pages routing
- `src/components` — UI components
- `src/utils/gsapAnimations.js` — helpers for scroll animations
- `public/3d` — 3D assets (placeholder procedural geometry in code; replace when needed)
- `public/images` — project thumbnails

## Future Backend (Node/Express)
A placeholder Express server is under `server/` for future tools (e.g., image optimizer). Keep it separate from Next.js runtime for Vercel.
- In the future, deploy Express separately (Render/Fly.io/DigitalOcean) or use Next.js API routes.
- Sample API route lives in `src/pages/api/contact.js` for the contact form.

## SEO
- `<Head>` meta tags in `index.jsx`
- JSON-LD structured data example included

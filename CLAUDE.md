# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Modern dark-themed portfolio website for Axel Ramirez built with Next.js 14, featuring 3D graphics (Three.js), scroll animations (GSAP), internationalization (next-intl), and a secure contact form with reCAPTCHA v3 and email integration (Resend).

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

Development server runs at http://localhost:3000

## Architecture Overview

### Framework & Routing
- **Next.js 14** using Pages Router (not App Router)
- Pages located in `src/pages/`
- API routes in `src/pages/api/`
- TypeScript path alias: `@/` → `src/`

### Internationalization (next-intl)
- **Configured locales**: English (`en`), Spanish (`es`)
- **Default locale**: `en`
- **Implementation**:
  - `middleware.js` - Routes traffic with locale prefixes (`/en/*`, `/es/*`)
  - `i18n.js` - Loads locale messages from `/messages/{locale}.json`
  - Translation files in `/messages/` directory
  - **Current status**: Spanish translations are incomplete (es.json is mostly empty)

### Contact Form Flow
The contact form on the homepage follows this architecture:

1. **Frontend** (`src/pages/index.jsx`):
   - Form wrapped in `GoogleReCaptchaProvider` from `react-google-recaptcha-v3`
   - `ReCaptcha` component (`src/components/ReCaptcha.jsx`) provides on-demand token generation
   - Submit handler executes reCAPTCHA, then POSTs to `/api/contact` with token

2. **Backend** (`src/pages/api/contact.js`):
   - Validates required fields (name, email, message)
   - Sanitizes input to prevent XSS (`sanitizeInput()` function)
   - Verifies reCAPTCHA token with Google's API
   - Sends email via Resend service (`src/utils/emailService.js`)
   - Returns success/error JSON response

3. **Email Service** (`src/utils/emailService.js`):
   - Uses Resend API (not SMTP)
   - From: `website-contact@axelramirez.dev`
   - To: `contact@axelramirez.dev`
   - HTML email template with contact details

### 3D Graphics (Three.js)
- **ThreeHero** (`src/components/ThreeHero.jsx`): Background spinning torus knot geometry
- **ThreeScene** (`src/components/ThreeScene.jsx`): GLB model loader with orbit controls and fallback to icosahedron
- Uses `@react-three/fiber` and `@react-three/drei` for React integration
- 3D assets stored in `public/3d/` (currently using procedural geometry)

### Animations
- GSAP ScrollTrigger in `src/utils/gsapAnimations.js`
- Animates `.reveal` and `.portfolio-card` classes
- Fade-up stagger effect (0.8s duration, 0.08s stagger, `power3.out` easing)
- Trigger point: `top 90%`

### Styling
- Tailwind CSS 3.4.9 with custom dark theme
- Configuration in `tailwind.config.js`
- Global styles and utilities in `src/styles/globals.css`
- Custom color scheme:
  - `bg: #0b0e14` - Dark background
  - `surface: #131a23` - Card backgrounds
  - `accent: #8b9cff` - Periwinkle accent (defined in `src/styles/theme.js`)
  - `muted: #94a3b8` - Gray text
- Utility classes: `.section`, `.card`, `.button-primary`, `.link`, `.reveal`

## Environment Variables

Required in `.env.local` for full functionality:

```env
# reCAPTCHA (required for contact form)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_site_key
RECAPTCHA_SECRET_KEY=your_secret_key

# Email service (required for contact form)
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

See `RECAPTCHA_SETUP.md` and `EMAIL_SETUP.md` for detailed setup instructions.

## Key Files & Locations

### Pages
- `src/pages/index.jsx` - Main portfolio page (fully featured with hero, projects, 3D scene, about, contact form)
- `src/pages/about_me.jsx` - Stub page (placeholder)
- `src/pages/industrial-automation-company/index.jsx` - Stub page (placeholder)

### API Routes
- `src/pages/api/contact.js` - Contact form handler (validates, sanitizes, verifies reCAPTCHA, sends email)
- `src/pages/api/test.js` - Debug endpoint for testing

### Components
- `src/components/Header.jsx` - Fixed navigation with scroll-aware styling
- `src/components/Footer.jsx` - Simple copyright footer
- `src/components/PortfolioCard.jsx` - Project showcase cards
- `src/components/ReCaptcha.jsx` - reCAPTCHA v3 wrapper (provides execute function to parent)
- `src/components/SectionHeading.jsx` - Reusable section title component
- `src/components/ThreeHero.jsx` - Background 3D scene
- `src/components/ThreeScene.jsx` - Interactive 3D model viewer

### Utilities
- `src/utils/emailService.js` - Email template builder and Resend integration
- `src/utils/gsapAnimations.js` - Scroll animation helpers

### Configuration
- `next.config.js` - Next.js config with next-intl plugin
- `i18n.js` - Internationalization configuration
- `middleware.js` - Locale routing middleware
- `tailwind.config.js` - Tailwind theme configuration
- `jsconfig.json` - Path aliases

## Important Implementation Details

### Security Measures
- **Server-side reCAPTCHA verification**: Never trust client-side validation
- **Input sanitization**: `sanitizeInput()` escapes `< > " ' /` characters in contact form
- **Email validation**: Basic regex pattern on server side
- **Environment variable protection**: Sensitive keys only in `.env.local`, never committed
- **Error handling**: No sensitive data exposed in error responses

### Contact Form Email Configuration
When updating email recipients or senders:
- Edit `src/pages/api/contact.js` line 58 for recipient (`to: ['your-email@example.com']`)
- Edit `src/utils/emailService.js` for sender details
- For production, verify domain with Resend and update `from` address

### Adding New Pages
When creating new pages:
- Add to `src/pages/` directory
- Follow naming convention: `page_name.jsx` or `folder-name/index.jsx`
- Ensure i18n support if needed (wrap with locale context)
- Update navigation in `Header.jsx` if adding to main menu

### Working with Translations
To add or update translations:
1. Add keys to `/messages/en.json` (English - primary)
2. Add corresponding translations to `/messages/es.json` (Spanish)
3. Use `useTranslations()` hook in components
4. **Note**: Spanish translations are currently incomplete

### Modifying 3D Scenes
- Background hero scene: Edit `src/components/ThreeHero.jsx`
- Interactive model viewer: Edit `src/components/ThreeScene.jsx`
- Add `.glb` model files to `public/3d/` directory
- Update model path in component props

## Deployment

**Primary target**: Vercel (optimized for Next.js)

Deployment checklist:
1. Set environment variables in Vercel dashboard
2. Connect GitHub repository
3. Use default build settings (`npm run build`)
4. Verify domain configuration for email service
5. Add production domain to reCAPTCHA admin console

**Alternative deployments**: Compatible with any Node.js hosting (Netlify, Render, etc.)

## Known Incomplete Features

1. **Spanish translations**: `/messages/es.json` exists but is mostly empty
2. **Stub pages**: `about_me.jsx` and `industrial-automation-company/index.jsx` are placeholders
3. **Portuguese locale**: Configured in `next.config.js` but not implemented in middleware/i18n
4. **Express server**: Placeholder in `server/` directory (commented out, not used)

## Testing the Application

### Test contact form locally:
1. Ensure `.env.local` has valid reCAPTCHA and Resend keys
2. Run `npm run dev`
3. Fill out form at http://localhost:3000/#contact
4. Check console logs for debugging
5. Verify email delivery

### Test production build:
```bash
npm run build
npm start
```
Access at http://localhost:3000

## Project Dependencies

Key packages and their purposes:
- `next` 14.2.32 - Framework
- `react` 18.3.1 - UI library
- `next-intl` 4.3.9 - Internationalization
- `resend` 6.0.2 - Email service API
- `react-google-recaptcha-v3` 1.11.0 - Bot protection
- `@react-three/fiber` 8.15.16 - Three.js React integration
- `@react-three/drei` 9.105.5 - Three.js helpers
- `gsap` 3.10.4 - Animation library
- `tailwindcss` 3.4.9 - CSS framework
- `three` 0.179.1 - 3D graphics library

## Additional Documentation

- `README.md` - Quick start guide
- `RECAPTCHA_SETUP.md` - Detailed reCAPTCHA configuration
- `EMAIL_SETUP.md` - Email service setup (Resend, Nodemailer alternatives)
- `IMPLEMENTATION_SUMMARY.md` - Implementation notes

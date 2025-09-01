# Google reCAPTCHA Setup Guide

This guide will help you set up Google reCAPTCHA v3 for your contact form.

## Why reCAPTCHA v3?

- ✅ **Better UX**: No checkbox or challenges for users
- ✅ **Invisible**: Runs in the background automatically
- ✅ **Smart**: Uses AI to detect bots vs humans
- ✅ **Modern**: Latest version with improved security

## Step 1: Get reCAPTCHA Keys

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Click "Create" to register a new site
3. Choose **"reCAPTCHA v3"** (recommended for better UX)
4. Add your domain(s):
   - For development: `localhost`, `127.0.0.1`
   - For production: your actual domain (e.g., `yourdomain.com`)
5. Accept the terms and click "Submit"
6. Copy both the **Site Key** and **Secret Key**

## Step 2: Configure Environment Variables

1. Create a `.env.local` file in your project root
2. Add the following variables:

```env
# Google reCAPTCHA Configuration
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key_here
```

**Important Notes:**
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is used in the frontend and is safe to expose
- `RECAPTCHA_SECRET_KEY` is used only in the backend API and must be kept secret
- Never commit your `.env.local` file to version control

## Step 3: Test the Integration

1. Start your development server: `npm run dev`
2. Navigate to your contact form
3. Fill out the form and complete the reCAPTCHA
4. Submit the form to test the integration

## Step 4: Production Deployment

When deploying to production:

1. Add your production domain to the reCAPTCHA admin console
2. Update your environment variables with the production keys
3. Ensure your hosting platform supports environment variables

## Troubleshooting

### Common Issues:

1. **"reCAPTCHA verification failed"**
   - Check that your secret key is correct
   - Verify the domain is added to reCAPTCHA admin console

2. **"Site key not found"**
   - Ensure `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` is set correctly
   - Check that the domain matches in reCAPTCHA admin console

3. **reCAPTCHA not loading**
   - Check browser console for errors
   - Verify the site key is correct
   - Ensure you're on an allowed domain

### Testing in Development:

For local development, make sure to add `localhost` and `127.0.0.1` to your reCAPTCHA domain list in the Google admin console.

## Security Notes

- The reCAPTCHA secret key should never be exposed to the client
- Always verify the reCAPTCHA token on the server side
- Consider implementing rate limiting for additional protection
- Monitor your reCAPTCHA analytics in the Google admin console

# Email Service Integration Guide

This guide covers how to set up email services for your contact form. I've implemented **Resend** as the primary option, but I'll also show you how to use **Nodemailer** as an alternative.

## Option 1: Resend (Recommended)

### Why Resend?
- ✅ **Free tier**: 3,000 emails/month
- ✅ **Modern API**: Easy to use
- ✅ **Great deliverability**: Built on top of AWS SES
- ✅ **Developer-friendly**: Excellent documentation
- ✅ **No domain verification needed** for testing

### Step 1: Sign Up for Resend

1. Go to [resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your email address
4. Go to the API Keys section
5. Create a new API key

### Step 2: Configure Environment Variables

Update your `.env.local` file:

```env
# Google reCAPTCHA Configuration
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key_here

# Email Service Configuration (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 3: Update Email Settings

In `src/pages/api/contact.js`, update these lines:

```javascript
// Line 58: Update with your email address
to: ['your-email@example.com'], // Replace with your actual email

// Line 56: Update sender (optional for testing)
from: 'Portfolio Contact <onboarding@resend.dev>', // Works for testing
```

### Step 4: Test the Integration

1. Start your development server: `npm run dev`
2. Fill out the contact form
3. Complete the reCAPTCHA
4. Submit the form
5. Check your email inbox

## Option 2: Nodemailer (Alternative)

If you prefer to use a traditional SMTP service like Gmail, Outlook, or your own server:

### Step 1: Install Nodemailer

```bash
npm install nodemailer
```

### Step 2: Configure Environment Variables

Add these to your `.env.local`:

```env
# Email Service Configuration (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Step 3: Alternative API Implementation

Create `src/pages/api/contact-nodemailer.js`:

```javascript
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, subject, message, recaptchaToken } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate reCAPTCHA token
    if (!recaptchaToken) {
      return res.status(400).json({ error: 'reCAPTCHA verification required' });
    }

    // Verify reCAPTCHA token with Google
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    if (!recaptchaSecret) {
      console.error('RECAPTCHA_SECRET_KEY not configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${recaptchaSecret}&response=${recaptchaToken}`,
    });

    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success) {
      console.error('reCAPTCHA verification failed:', recaptchaData['error-codes']);
      return res.status(400).json({ error: 'reCAPTCHA verification failed' });
    }

    // Create transporter
    const transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email template
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Contact Form Submission</h2>
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject || 'No subject'}</p>
          <p><strong>Message:</strong></p>
          <div style="background-color: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
            ${message.replace(/\n/g, '<br>')}
          </div>
        </div>
        <p style="color: #666; font-size: 12px;">
          This message was sent from your portfolio contact form.
        </p>
      </div>
    `;

    // Send email
    const info = await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to: 'your-email@example.com', // Update with your email
      subject: `Portfolio Contact: ${subject || 'New Message'}`,
      html: emailHtml,
      replyTo: email,
    });

    console.log('Email sent successfully:', info.messageId);

    return res.status(200).json({ 
      success: true, 
      message: 'Message sent successfully! I\'ll get back to you soon.' 
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
```

## Option 3: Other Email Services

### SendGrid
- Install: `npm install @sendgrid/mail`
- Free tier: 100 emails/day
- Good for high volume

### Mailgun
- Install: `npm install mailgun.js`
- Free tier: 5,000 emails/month for 3 months
- Good for transactional emails

## Production Deployment

### For Vercel/Netlify:
1. Add environment variables in your hosting platform dashboard
2. Update the `from` email to use your verified domain
3. Test the contact form in production

### For Custom Server:
1. Ensure environment variables are set on your server
2. Configure your domain's DNS records for email
3. Set up proper SSL certificates

## Troubleshooting

### Common Issues:

1. **"Email service not configured"**
   - Check that your API key is set correctly
   - Verify the environment variable name

2. **"Failed to send email"**
   - Check your API key permissions
   - Verify the recipient email address
   - Check Resend dashboard for error details

3. **Emails going to spam**
   - Use a verified domain for the `from` address
   - Set up proper SPF/DKIM records
   - Avoid spam trigger words

### Testing Tips:

1. **Use a test email** first to verify the setup
2. **Check the console logs** for detailed error messages
3. **Monitor your email service dashboard** for delivery status
4. **Test with different email clients** to ensure compatibility

## Security Notes

- Never commit API keys to version control
- Use environment variables for all sensitive data
- Consider rate limiting for additional protection
- Monitor your email service usage and costs

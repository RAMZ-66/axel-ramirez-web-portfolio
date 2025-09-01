import { sendEmailWithResend, validateEmail, sanitizeInput } from '@/utils/emailService';

// Contact form API route with reCAPTCHA verification and email sending
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

    // Validate email format
    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedSubject = sanitizeInput(subject);
    const sanitizedMessage = sanitizeInput(message);

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

    // Send email using Resend
    try {
      const emailData = await sendEmailWithResend({
        name: sanitizedName,
        email: sanitizedEmail,
        subject: sanitizedSubject,
        message: sanitizedMessage,
        recipientEmail: 'axel.ramirez.dev@gmail.com' // Update with your email
      });

      console.log('Email sent successfully:', emailData);

      return res.status(200).json({ 
        success: true, 
        message: 'Message sent successfully! I\'ll get back to you soon.' 
      });

    } catch (emailError) {
      console.error('Email sending error:', emailError);
      return res.status(500).json({ error: 'Failed to send email' });
    }

  } catch (error) {
    console.error('Contact form error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

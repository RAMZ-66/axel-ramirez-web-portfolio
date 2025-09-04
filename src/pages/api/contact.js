import { sendEmailWithResend, validateEmail, sanitizeInput } from '@/utils/emailService';

// Contact form API route with reCAPTCHA verification and email sending
export default async function handler(req, res) {
  console.log('=== CONTACT API CALLED ===');
  console.log('Method:', req.method);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  
  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Contact API called with body:', req.body);
    
    const { name, email, subject, message, recaptchaToken } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      console.log('Missing required fields:', { name: !!name, email: !!email, message: !!message });
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate email format
    if (!validateEmail(email)) {
      console.log('Invalid email format:', email);
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedSubject = sanitizeInput(subject);
    const sanitizedMessage = sanitizeInput(message);

    console.log('Sanitized inputs:', { sanitizedName, sanitizedEmail, sanitizedSubject, sanitizedMessage });

    // Validate reCAPTCHA token
    if (!recaptchaToken) {
      console.log('No reCAPTCHA token provided');
      return res.status(400).json({ error: 'reCAPTCHA verification required' });
    }

    console.log('reCAPTCHA token received:', recaptchaToken.substring(0, 20) + '...');

    // Verify reCAPTCHA token with Google
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    if (!recaptchaSecret) {
      console.error('RECAPTCHA_SECRET_KEY not configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    console.log('reCAPTCHA secret key configured:', recaptchaSecret.substring(0, 20) + '...');

    console.log('Verifying reCAPTCHA with Google...');
    
    const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${recaptchaSecret}&response=${recaptchaToken}`,
    });

    console.log('reCAPTCHA response status:', recaptchaResponse.status);
    
    const recaptchaData = await recaptchaResponse.json();
    console.log('reCAPTCHA verification result:', recaptchaData);

    if (!recaptchaData.success) {
      console.error('reCAPTCHA verification failed:', recaptchaData['error-codes']);
      return res.status(400).json({ 
        error: 'reCAPTCHA verification failed',
        details: recaptchaData['error-codes'] || 'Unknown error'
      });
    }

    console.log('reCAPTCHA verification successful');

    // Send email using Resend
    try {
      const emailData = await sendEmailWithResend({
        name: sanitizedName,
        email: sanitizedEmail,
        subject: sanitizedSubject,
        message: sanitizedMessage,
        recipientEmail: 'contact@axelramirez.dev' // Update with your email
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
    console.error('Error stack:', error.stack);
    return res.status(500).json({ 
      error: 'Internal server error',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

import { Resend } from 'resend';

// Email template generator
export const generateEmailTemplate = ({ name, email, subject, message }) => {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
      <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #333; margin-bottom: 20px; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
          📧 New Contact Form Submission
        </h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #007bff;">
          <p style="margin: 8px 0;"><strong>👤 Name:</strong> ${name}</p>
          <p style="margin: 8px 0;"><strong>📧 Email:</strong> <a href="mailto:${email}" style="color: #007bff;">${email}</a></p>
          <p style="margin: 8px 0;"><strong>📝 Subject:</strong> ${subject || 'No subject'}</p>
        </div>
        
        <div style="background-color: #fff; padding: 20px; border-radius: 8px; border: 1px solid #e9ecef; margin: 20px 0;">
          <h3 style="color: #333; margin-top: 0;">💬 Message:</h3>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; line-height: 1.6; color: #333;">
            ${message.replace(/\n/g, '<br>')}
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef;">
          <p style="color: #666; font-size: 12px; margin: 0;">
            This message was sent from your portfolio contact form at ${new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  `;
};

// Send email using Resend
export const sendEmailWithResend = async ({ name, email, subject, message, recipientEmail }) => {
  const resendApiKey = process.env.RESEND_API_KEY;
  
  if (!resendApiKey) {
    throw new Error('RESEND_API_KEY not configured');
  }

  const resend = new Resend(resendApiKey);
  const emailHtml = generateEmailTemplate({ name, email, subject, message });

  const { data, error } = await resend.emails.send({
    from: 'Portfolio Contact <website-contact@axelramirez.dev>', // Update with your verified domain
    to: [recipientEmail || 'contact@axelramirez.dev'], // Update with your email
    subject: `Portfolio Contact: ${subject || 'New Message'}`,
    html: emailHtml,
    reply_to: email, // This allows you to reply directly to the sender
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }

  return data;
};

// Validate email format
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Sanitize input to prevent XSS
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

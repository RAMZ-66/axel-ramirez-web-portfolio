import React from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

const ReCaptcha = ({ onChange, onError, className = '' }) => {
  const { executeRecaptcha, recaptchaLoaded } = useGoogleReCaptcha();

  // For v3, we need to execute on demand, not automatically
  // The token will be generated when the form is submitted
  const executeOnDemand = async () => {
    if (!executeRecaptcha) {
      console.log('Execute recaptcha not yet available');
      return null;
    }

    try {
      const token = await executeRecaptcha('contact_form');
      return token;
    } catch (error) {
      console.error('reCAPTCHA error:', error);
      if (onError) {
        onError(error);
      }
      return null;
    }
  };

  // Store the execute function so the parent can call it
  React.useEffect(() => {
    if (onChange) {
      onChange(executeOnDemand);
    }
  }, [executeRecaptcha, onChange]);

  return (
    <div className={`${className}`}>
      {/* Hidden reCAPTCHA v3 - will execute on form submission */}
      <div style={{ display: 'none' }}>
        reCAPTCHA v3 ready
      </div>
    </div>
  );
};

export default ReCaptcha;

import React, { useCallback } from 'react';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

const ReCaptcha = ({ onChange, onError, className = '' }) => {
  const { executeRecaptcha, recaptchaLoaded } = useGoogleReCaptcha();

  // Debug logging
  console.log('ReCaptcha component loaded:', { recaptchaLoaded, executeRecaptcha: !!executeRecaptcha });

  // For v3, we need to execute on demand, not automatically
  // The token will be generated when the form is submitted
  const executeOnDemand = useCallback(async () => {
    console.log('Attempting to execute reCAPTCHA...');
    
    if (!executeRecaptcha) {
      console.log('Execute recaptcha not yet available');
      return null;
    }

    try {
      console.log('Executing reCAPTCHA with action: contact_form');
      const token = await executeRecaptcha('contact_form');
      console.log('reCAPTCHA token received:', token ? 'Yes' : 'No');
      return token;
    } catch (error) {
      console.error('reCAPTCHA execution error:', error);
      if (onError) {
        onError(error);
      }
      return null;
    }
  }, [executeRecaptcha, onError]);

  // Store the execute function so the parent can call it
  React.useEffect(() => {
    if (onChange) {
      onChange(executeOnDemand);
    }
  }, [executeOnDemand, onChange]);

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

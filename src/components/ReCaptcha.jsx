import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { useEffect } from 'react';

const ReCaptcha = ({ onChange, onError, className = '' }) => {
  const { executeRecaptcha, recaptchaLoaded } = useGoogleReCaptcha();

  useEffect(() => {
    if (recaptchaLoaded) {
      // Execute reCAPTCHA when component mounts to get initial token
      handleExecuteRecaptcha();
    }
  }, [recaptchaLoaded]);

  const handleExecuteRecaptcha = async () => {
    if (!executeRecaptcha) {
      console.log('Execute recaptcha not yet available');
      return;
    }

    try {
      const token = await executeRecaptcha('contact_form');
      if (onChange) {
        onChange(token);
      }
    } catch (error) {
      console.error('reCAPTCHA error:', error);
      if (onError) {
        onError(error);
      }
    }
  };

  // For v3, we don't need to show a visible widget
  // The reCAPTCHA runs in the background
  return (
    <div className={`${className}`}>
      {/* Hidden reCAPTCHA v3 - runs automatically */}
      <div style={{ display: 'none' }}>
        reCAPTCHA v3 is running in the background
      </div>
    </div>
  );
};

export default ReCaptcha;

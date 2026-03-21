import { notFound } from 'next/navigation';
import { getRequestConfig, localeMatch } from 'next-intl/server';

export const locales = ['en', 'es'];

export default getRequestConfig(async ({ locale }) => {
  // Validate the locale
  if (!localeMatch(locales, locale)) {
    notFound();
  }
  
  return {
    messages: (await import(`/messages/${locale}.json`)).default
  };
});
import React from 'react';
import '@/styles/globals.css'
import Head from 'next/head'
import CustomCursor from '@/components/CustomCursor'
import { LanguageProvider } from '@/context/LanguageContext'

export default function MyApp({ Component, pageProps }) {
  return (
    <LanguageProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <CustomCursor />
      <Component {...pageProps} />
    </LanguageProvider>
  )
}

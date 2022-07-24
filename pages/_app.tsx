import React from 'react';
import { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import { GoogleAnalytics } from 'nextjs-google-analytics';

import '../styles/index.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <GoogleAnalytics />
      <ThemeProvider
        attribute="class"
        value={{
          light: 'light-theme',
          dark: 'dark-theme',
          greenOrange: 'green-orange-theme',
          bluePink: 'blue-pink-theme',
        }}
        themes={['light', 'dark', 'greenOrange', 'bluePink']}
      >
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}

export default MyApp;

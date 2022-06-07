import React from 'react';
import { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';

import '../styles/index.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;

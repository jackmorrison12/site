import React from 'react';
import { AppProps, NextWebVitalsMetric } from 'next/app';
import { ThemeProvider } from 'next-themes';
import { GoogleAnalytics, usePageViews, event } from 'nextjs-google-analytics';

import '../styles/index.css';

export function reportWebVitals(metric: NextWebVitalsMetric) {
  event(metric.name, {
    category: metric.label === 'web-vital' ? 'Web Vitals' : 'Next.js custom metric',
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value), // values must be integers
    label: metric.id, // id unique to current page load
    nonInteraction: true, // avoids affecting bounce rate.
  });
}

function MyApp({ Component, pageProps }: AppProps) {
  usePageViews();
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

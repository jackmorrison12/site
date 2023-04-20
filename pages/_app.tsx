import React from 'react';
import { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import { GoogleAnalytics } from 'nextjs-google-analytics';

import { GlobalStyle } from '../utils/styles/globalStyles';

import { ThemeProvider as SCThemeProvider } from 'styled-components';
import { getThemeTemplate } from '../utils/theme/themeTemplate';

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
        <GlobalStyle />
        <SCThemeProvider theme={getThemeTemplate()}>
          <Component {...pageProps} />
        </SCThemeProvider>
      </ThemeProvider>
    </>
  );
}

export default MyApp;

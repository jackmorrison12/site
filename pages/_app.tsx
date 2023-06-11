import React from 'react';
import { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import { GoogleAnalytics } from 'nextjs-google-analytics';

import { GlobalStyle } from '../utils/styles/globalStyles';

import { ThemeProvider as SCThemeProvider } from 'styled-components';
import { getThemeTemplate } from '../utils/theme/themeTemplate';
import { themes } from '../utils/theme';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <GoogleAnalytics />
      <ThemeProvider
        attribute="class"
        value={themes.reduce((a, v) => ({ ...a, [v.themeName]: v.className }), {})}
        themes={themes.map((t) => t.themeName)}
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

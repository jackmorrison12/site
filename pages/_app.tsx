import React from 'react';
import { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import { GoogleAnalytics } from 'nextjs-google-analytics';

import { GlobalStyle } from '../utils/styles/globalStyles';

import { ThemeProvider as SCThemeProvider } from 'styled-components';
import { unflatten } from 'flat';
import { DefaultLightTheme } from '../utils/theme';
import { Theme } from '../utils/theme/theme.types';

import _ from 'lodash';

function MyApp({ Component, pageProps }: AppProps) {
  let themeTemplate = {} as Theme;

  const generateTheme = (theme: any, currPath: string = '') => {
    Object.keys(theme).forEach((key) => {
      if (typeof theme[key as keyof typeof theme] === 'object' && theme[key as keyof typeof theme] !== null) {
        generateTheme(theme[key], currPath === '' ? currPath + key : currPath + '_' + key);
      } else {
        themeTemplate = _.merge(
          themeTemplate,
          unflatten({ [currPath + '_' + key]: 'var(--' + currPath + '_' + key + ')' }, { delimiter: '_' }),
        );
      }
    });
  };

  generateTheme(DefaultLightTheme);

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
        <SCThemeProvider theme={themeTemplate}>
          <Component {...pageProps} />
        </SCThemeProvider>
      </ThemeProvider>
    </>
  );
}

export default MyApp;

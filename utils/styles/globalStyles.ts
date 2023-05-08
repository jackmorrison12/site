import { createGlobalStyle } from 'styled-components';
import { themes } from '../theme';
import { generateLegacyTheme, generateTheme } from './generateTheme';

export const GlobalStyle = createGlobalStyle`
    *,
    *::before,
    *::after {
    box-sizing: border-box;
    }
    * {
    margin: 0;
    }
    html,
    body {
    height: 100%;
    margin: auto;
    }
    body {
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    }
    img,
    picture,
    video,
    canvas,
    svg {
    display: block;
    max-width: 100%;
    }
    input,
    button,
    textarea,
    select {
    font: inherit;
    }
    p,
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
    overflow-wrap: break-word;
    }
    #root,
    #__next {
    isolation: isolate;
    }

    /*
    Fonts
    */
    html {
    font-family: 'Poppins', sans-serif;
    }

    /* generateLegacyTheme generates legacy styles for the css modules - 
       new StyledComponents will use generateTheme and the theme object */
    ${themes.reduce(
      (a, v) =>
        a +
        (v.isRoot ? ':root' : `.${v.className}`) +
        '{' +
        (v.isDark ? 'color-scheme: dark;' : '') +
        generateLegacyTheme(v.theme) +
        generateTheme(v.theme) +
        '}',
      '',
    )}

    html {
        /* We need to get this from the theme */
        background-color: var(--greyBase);
        color: var(--greyTextContrast);
        accent-color: var(--accentSolid);
    }

    a {
        color: var(--accentText);
        text-decoration-line: none;
    }

    iframe {
        max-width: 100%;
        display: block;
        margin-left: auto;
        margin-right: auto;
    }

`;

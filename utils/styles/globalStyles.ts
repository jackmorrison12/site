import { createGlobalStyle } from 'styled-components';
import { DefaultDarkTheme, DefaultLightTheme } from '../theme';
import { Theme } from '../theme/theme.types';
import { flatten } from 'flat';

const generateTheme = (theme: Theme) => {
  const flattened: Record<string, string> = flatten(theme, { delimiter: '_' });
  return Object.keys(flattened).reduce((prev, curr) => (prev += `--${curr}: ${flattened[curr]};`), '');
};

const generateLegacyTheme = (theme: Theme) => `        
--accentBase: ${theme.colours.primary[1]};
--accentBgSubtle: ${theme.colours.primary[2]};
--accentBg: ${theme.colours.primary[3]};
--accentBgHover: ${theme.colours.primary[4]};
--accentBgActive: ${theme.colours.primary[5]};
--accentLine: ${theme.colours.primary[6]};
--accentBorder: ${theme.colours.primary[7]};
--accentBorderHover: ${theme.colours.primary[8]};
--accentSolid: ${theme.colours.primary[9]};
--accentSolidHover: ${theme.colours.primary[10]};
--accentText: ${theme.colours.primary[11]};
--accentTextContrast: ${theme.colours.primary[12]};

--gray1: hsl(0, 0%, 8.5%);
--gray2: hsl(0, 0%, 11.0%);
--gray3: hsl(0, 0%, 13.6%);
--gray4: hsl(0, 0%, 15.8%);
--gray5: hsl(0, 0%, 17.9%);
--gray6: hsl(0, 0%, 20.5%);
--gray7: hsl(0, 0%, 24.3%);
--gray8: hsl(0, 0%, 31.2%);
--gray9: hsl(0, 0%, 43.9%);
--gray10: hsl(0, 0%, 49.4%);
--gray11: hsl(0, 0%, 62.8%);
--gray12: hsl(0, 0%, 93.0%);

--greyBase: ${theme.colours.background.default};
--greyBgSubtle: var(--gray2);
--greyBg: var(--gray3);
--greyBgHover: var(--gray4);
--greyBgActive: var(--gray5);
--greyLine: ${theme.colours.background.soft};
--greyBorder: var(--gray7);
--greyBorderHover: var(--gray8);
--greySolid: ${theme.colours.background.softest};
--greySolidHover: var(--gray10);
--greyText: var(--gray11);
--greyTextContrast: ${theme.colours.text.default};

`;

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

    /* These are legacy styles for the css modules - new StyledComponents will use the theme object */
    :root {
        ${generateLegacyTheme(DefaultLightTheme)}
        ${generateTheme(DefaultLightTheme)}
    }

    .dark-theme{
        ${generateLegacyTheme(DefaultDarkTheme)}
        ${generateTheme(DefaultDarkTheme)}
    }

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

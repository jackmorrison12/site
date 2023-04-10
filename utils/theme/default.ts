import { Theme } from './theme.types';

export const DefaultThemeWithoutColours: Omit<Theme, 'colours'> = {
  fontSizes: {
    h1: '3rem',
    h2: '2.5rem',
    h3: '2rem',
    h4: '1.5rem',
    h5: '1.25rem',
    h6: '1rem',
    p: '1rem',
    tiny: '0.75rem',
    small: '0.875rem',
    default: '1rem',
    large: '1.5rem',
    xl: '2rem',
    xxl: '3rem',
  },
  fontWeights: { thinnest: '200', thin: '300', default: '400', thick: '600', thickest: '800' },
};

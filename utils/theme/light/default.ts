import { DefaultThemeWithoutColours } from '../default';
import { ColourRange, generateSpectrum, Theme } from '../theme.types';
import { mintGreen } from './colours/mintGreen';

// Orange
const secondary: ColourRange = {
  1: 'hsl(30, 70%, 7.2%)',
  2: 'hsl(28, 100%, 8.4%)',
  3: 'hsl(26, 91.1%, 11.6%)',
  4: 'hsl(25, 88.3%, 14.1%)',
  5: 'hsl(24, 87.6%, 16.6%)',
  6: 'hsl(24, 88.6%, 19.8%)',
  7: 'hsl(24, 92.4%, 24%)',
  8: 'hsl(25, 100%, 29%)',
  9: 'hsl(24, 94%, 50%)',
  10: 'hsl(24, 100%, 58.5%)',
  11: 'hsl(24, 100%, 62.2%)',
  12: 'hsl(24, 97%, 93.6%)',
};

export const DefaultLightTheme: Theme = {
  ...DefaultThemeWithoutColours,
  colours: {
    background: {
      default: 'hsl(0, 0%, 8.5%)',
      soft: 'hsl(0, 0%, 20.5%)',
      softest: 'hsl(0, 0%, 43.9%)',
      heavy: 'hsl(0, 0%, 4%)',
      heaviest: 'hsl(0, 0%, 0%)',
    },
    text: {
      default: 'hsl(0, 0%, 93%)',
      soft: 'hsl(0, 0%, 85.8%)',
      softest: 'hsl(0, 0%, 56.1%)',
      heavy: 'hsl(0, 0%, 99.0%)',
      heaviest: 'hsl(0, 0%, 97.3%)',
    },
    primary: {
      ...mintGreen,
      ...generateSpectrum(mintGreen),
    },
    secondary: {
      ...secondary,
      ...generateSpectrum(secondary),
    },
  },
};

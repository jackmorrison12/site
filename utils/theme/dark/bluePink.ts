import { DefaultThemeWithoutColours } from '../default';
import { generateSpectrum, Theme } from '../theme.types';
import { blue } from './colours/blue';
import { pink } from './colours/pink';

export const BluePinkDarkTheme: Theme = {
  ...DefaultThemeWithoutColours,
  colours: {
    background: {
      default: blue[1],
      soft: blue[6],
      softest: blue[9],
      // TODO: Set these
      heavy: 'hsl(0, 0%, 4%)',
      heaviest: 'hsl(0, 0%, 0%)',
    },
    text: {
      default: blue[12],
      // TODO: Set these
      soft: 'hsl(0, 0%, 85.8%)',
      softest: 'hsl(0, 0%, 56.1%)',
      heavy: 'hsl(0, 0%, 99.0%)',
      heaviest: 'hsl(0, 0%, 97.3%)',
    },
    primary: {
      ...pink,
      ...generateSpectrum(pink),
    },
    secondary: {
      ...blue,
      ...generateSpectrum(blue),
    },
    legacyGrey: { ...blue },
  },
};

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
      heavy: 'hsl(212, 35%, 4%)',
      heaviest: 'hsl(212, 35%, 0%)',
    },
    text: {
      default: blue[12],
      soft: 'hsl(210, 30%, 80%)',
      softest: 'hsl(210, 20%, 60%)',
      heavy: 'hsl(206, 98%, 99%)',
      heaviest: 'hsl(206, 98%, 100%)',
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

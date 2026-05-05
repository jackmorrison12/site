import { DefaultThemeWithoutColours } from '../default';
import { generateSpectrum, Theme } from '../theme.types';
import { blue } from './colours/blue';
import { pink } from './colours/pink';

export const BluePinkLightTheme: Theme = {
  ...DefaultThemeWithoutColours,
  colours: {
    background: {
      default: blue[1],
      soft: blue[6],
      softest: blue[9],
      heavy: 'hsl(212, 100%, 100%)',
      heaviest: 'hsl(212, 100%, 100%)',
    },
    text: {
      default: blue[12],
      soft: 'hsl(210, 30%, 43.5%)',
      softest: 'hsl(210, 20%, 56.1%)',
      heavy: 'hsl(212, 60%, 4%)',
      heaviest: 'hsl(212, 60%, 0%)',
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

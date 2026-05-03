import { DefaultThemeWithoutColours } from '../default';
import { generateSpectrum, Theme } from '../theme.types';
import { blue } from './colours/blue';
import { grey } from './colours/grey';
import { pink } from './colours/pink';

export const BluePinkLightTheme: Theme = {
  ...DefaultThemeWithoutColours,
  colours: {
    background: {
      default: grey[1],
      soft: grey[6],
      softest: grey[9],
      heavy: 'hsl(0, 0%, 100%)',
      heaviest: 'hsl(0, 0%, 100%)',
    },
    text: {
      default: grey[12],
      soft: 'hsl(0, 0%, 43.5%)',
      softest: 'hsl(0, 0%, 56.1%)',
      heavy: 'hsl(0, 0%, 4%)',
      heaviest: 'hsl(0, 0%, 0%)',
    },
    primary: {
      ...pink,
      ...generateSpectrum(pink),
    },
    secondary: {
      ...blue,
      ...generateSpectrum(blue),
    },
    legacyGrey: { ...grey },
  },
};

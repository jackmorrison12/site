import { DefaultThemeWithoutColours } from '../default';
import { generateSpectrum, Theme } from '../theme.types';
import { orange } from './colours/orange';
import { teal } from './colours/teal';

export const GreenOrangeDarkTheme: Theme = {
  ...DefaultThemeWithoutColours,
  colours: {
    background: {
      default: teal[1],
      soft: teal[6],
      softest: teal[9],
      // TODO: Set these
      heavy: 'hsl(0, 0%, 4%)',
      heaviest: 'hsl(0, 0%, 0%)',
    },
    text: {
      default: teal[12],
      // TODO: Set these
      soft: 'hsl(0, 0%, 85.8%)',
      softest: 'hsl(0, 0%, 56.1%)',
      heavy: 'hsl(0, 0%, 99.0%)',
      heaviest: 'hsl(0, 0%, 97.3%)',
    },
    primary: {
      ...orange,
      ...generateSpectrum(orange),
    },
    secondary: {
      ...teal,
      ...generateSpectrum(teal),
    },
    legacyGrey: { ...teal },
  },
};

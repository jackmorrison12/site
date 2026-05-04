import { DefaultThemeWithoutColours } from '../default';
import { generateSpectrum, Theme } from '../theme.types';
import { orange } from './colours/orange';
import { teal } from './colours/teal';

export const GreenOrangeLightTheme: Theme = {
  ...DefaultThemeWithoutColours,
  colours: {
    background: {
      default: teal[1],
      soft: teal[6],
      softest: teal[9],
      heavy: 'hsl(168, 100%, 100%)',
      heaviest: 'hsl(168, 100%, 100%)',
    },
    text: {
      default: teal[12],
      soft: 'hsl(166, 30%, 43.5%)',
      softest: 'hsl(166, 20%, 56.1%)',
      heavy: 'hsl(168, 60%, 4%)',
      heaviest: 'hsl(168, 60%, 0%)',
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

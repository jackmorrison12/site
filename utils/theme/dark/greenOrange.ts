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
      heavy: 'hsl(168, 48%, 3%)',
      heaviest: 'hsl(168, 48%, 0%)',
    },
    text: {
      default: teal[12],
      soft: 'hsl(166, 30%, 80%)',
      softest: 'hsl(166, 20%, 60%)',
      heavy: 'hsl(166, 73%, 98%)',
      heaviest: 'hsl(166, 73%, 100%)',
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

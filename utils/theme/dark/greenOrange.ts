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

// Grey:
// 1: { hue: 0, saturation: 0, lightness: 8.5 },
// 2: { hue: 0, saturation: 0, lightness: 11.0 },
// 3: { hue: 0, saturation: 0, lightness: 13.6 },
// 4: { hue: 0, saturation: 0, lightness: 15.8 },
// 5: { hue: 0, saturation: 0, lightness: 17.9 },
// 6: { hue: 0, saturation: 0, lightness: 20.5 },
// 7: { hue: 0, saturation: 0, lightness: 24.3 },
// 8: { hue: 0, saturation: 0, lightness: 31.2 },
// 9: { hue: 0, saturation: 0, lightness: 43.9 },
// 10: { hue: 0, saturation: 0, lightness: 49.4 },
// 11: { hue: 0, saturation: 0, lightness: 62.8 },
// 12: { hue: 0, saturation: 0, lightness: 93.0 },

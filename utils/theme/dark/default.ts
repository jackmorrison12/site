import { DefaultThemeWithoutColours } from '../default';
import { generateSpectrum, Theme } from '../theme.types';
import { grey } from './colours/grey';
import { mintGreen } from './colours/mintGreen';
import { orange } from './colours/orange';

export const DefaultDarkTheme: Theme = {
  ...DefaultThemeWithoutColours,
  colours: {
    background: {
      default: grey[1],
      soft: grey[6],
      softest: grey[9],
      // TODO: Set these
      heavy: 'hsl(0, 0%, 4%)',
      heaviest: 'hsl(0, 0%, 0%)',
    },
    text: {
      default: grey[12],
      // TODO: Set these
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
      ...orange,
      ...generateSpectrum(orange),
    },
    legacyGrey: { ...grey },
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

import { DefaultThemeWithoutColours } from '../default';
import { generateSpectrum, Theme } from '../theme.types';
import { grey } from './colours/grey';
import { mintGreen } from './colours/mintGreen';
import { orange } from './colours/orange';

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
      ...orange,
      ...generateSpectrum(orange),
    },
    legacyGrey: { ...grey },
  },
};

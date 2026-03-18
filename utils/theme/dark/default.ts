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
      heavy: 'hsl(0, 0%, 4%)',
      heaviest: 'hsl(0, 0%, 0%)',
    },
    text: {
      default: grey[12],
      soft: 'hsl(0, 0%, 62.8%)',
      softest: 'hsl(0, 0%, 43.9%)',
      heavy: 'hsl(0, 0%, 97.0%)',
      heaviest: 'hsl(0, 0%, 100%)',
    },
    primary: {
      ...mintGreen,
      ...generateSpectrum(mintGreen),
      text: { ...generateSpectrum(mintGreen).text, contrast: grey[1] },
    },
    secondary: {
      ...orange,
      ...generateSpectrum(orange),
    },
    legacyGrey: { ...grey },
  },
};

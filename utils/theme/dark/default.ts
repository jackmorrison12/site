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
      text: { ...generateSpectrum(mintGreen).text, contrast: grey[1] },
    },
    secondary: {
      ...orange,
      ...generateSpectrum(orange),
    },
    legacyGrey: { ...grey },
  },
};

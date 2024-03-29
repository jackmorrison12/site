import flatten from 'flat';
import { Theme } from '../theme/theme.types';

export const generateTheme = (theme: Theme) => {
  const flattened: Record<string, string> = flatten(theme, { delimiter: '_' });
  return Object.keys(flattened).reduce((prev, curr) => (prev += `--${curr}: ${flattened[curr]};`), '');
};

/**
 * This is to be deprecated - it's to keep the theming working in the old CSS modules
 * @deprecated
 * @param theme The theme to generate the CSS for
 * @returns Some CSS
 */
export const generateLegacyTheme = (theme: Theme) => `        
  --accentBase: ${theme.colours.primary[1]};
  --accentBgSubtle: ${theme.colours.primary[2]};
  --accentBg: ${theme.colours.primary[3]};
  --accentBgHover: ${theme.colours.primary[4]};
  --accentBgActive: ${theme.colours.primary[5]};
  --accentLine: ${theme.colours.primary[6]};
  --accentBorder: ${theme.colours.primary[7]};
  --accentBorderHover: ${theme.colours.primary[8]};
  --accentSolid: ${theme.colours.primary[9]};
  --accentSolidHover: ${theme.colours.primary[10]};
  --accentText: ${theme.colours.primary[11]};
  --accentTextContrast: ${theme.colours.primary[12]};
  
  --gray1: ${theme.colours.legacyGrey[1]};
  --gray2: ${theme.colours.legacyGrey[2]};
  --gray3: ${theme.colours.legacyGrey[3]};
  --gray4: ${theme.colours.legacyGrey[4]};
  --gray5: ${theme.colours.legacyGrey[5]};
  --gray6: ${theme.colours.legacyGrey[6]};
  --gray7: ${theme.colours.legacyGrey[7]};
  --gray8: ${theme.colours.legacyGrey[8]};
  --gray9: ${theme.colours.legacyGrey[9]};
  --gray10: ${theme.colours.legacyGrey[10]};
  --gray11: ${theme.colours.legacyGrey[11]};
  --gray12: ${theme.colours.legacyGrey[12]};
  
  --greyBase: ${theme.colours.legacyGrey[1]};
  --greyBgSubtle: ${theme.colours.legacyGrey[2]};
  --greyBg: ${theme.colours.legacyGrey[3]};
  --greyBgHover: ${theme.colours.legacyGrey[4]};
  --greyBgActive: ${theme.colours.legacyGrey[5]};
  --greyLine: ${theme.colours.legacyGrey[6]};
  --greyBorder: ${theme.colours.legacyGrey[7]};
  --greyBorderHover: ${theme.colours.legacyGrey[8]};
  --greySolid: ${theme.colours.legacyGrey[9]};
  --greySolidHover: ${theme.colours.legacyGrey[10]};
  --greyText: ${theme.colours.legacyGrey[11]};
  --greyTextContrast: ${theme.colours.legacyGrey[12]};
  `;

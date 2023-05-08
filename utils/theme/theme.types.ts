type HSL = `hsl(${number}, ${number}%, ${number}%)`;
type REM = `${number}rem`;

/**
 * Used for theme colours
 */
type ThemeColourSpectrum = {
  default: HSL;
  hover: HSL;
  background: {
    default: HSL;
    hover: HSL;
    active: HSL;
  };
  border: {
    default: HSL;
    hover: HSL;
  };
  text: {
    default: HSL;
    contrast: HSL;
  };
};

/**
 * Used for background and text
 */
type ColourSpectrum = {
  default: HSL;
  soft: HSL;
  softest: HSL;
  heavy: HSL;
  heaviest: HSL;
};

/**
 * 1 has the least hue, 12 has the most
 * Suggested uses are:
 * - 1 = Base
 * - 2 = Subtle Background
 * - 3 = Background
 * - 4 = Hovered Background
 * - 5 = Active Background
 * - 6 = Line
 * - 7 = Border
 * - 8 = Hovered Border
 * - 9 = Solid
 * - 10 = Solid Hover
 * - 11 = Text
 * - 12 = Text Contrast
 */
export type ColourRange = {
  1: HSL;
  2: HSL;
  3: HSL;
  4: HSL;
  5: HSL;
  6: HSL;
  7: HSL;
  8: HSL;
  9: HSL;
  10: HSL;
  11: HSL;
  12: HSL;
};

export type Theme = {
  colours: {
    background: ColourSpectrum;
    text: ColourSpectrum;
    primary: ThemeColourSpectrum & ColourRange;
    secondary: ThemeColourSpectrum & ColourRange;
    legacyGrey: ColourRange;
  };
  fontSizes: {
    h1: REM;
    h2: REM;
    h3: REM;
    h4: REM;
    h5: REM;
    h6: REM;
    p: REM;
    tiny: REM;
    small: REM;
    default: REM;
    large: REM;
    xl: REM;
    xxl: REM;
  };
  fontWeights: {
    thinnest: `${number}`;
    thin: `${number}`;
    default: `${number}`;
    thick: `${number}`;
    thickest: `${number}`;
  };
};

export const generateSpectrum = (baseColours: ColourRange): ThemeColourSpectrum => ({
  default: baseColours[9],
  hover: baseColours[10],
  background: {
    default: baseColours[3],
    hover: baseColours[4],
    active: baseColours[5],
  },
  border: {
    default: baseColours[7],
    hover: baseColours[8],
  },
  text: {
    default: baseColours[11],
    contrast: baseColours[12],
  },
});

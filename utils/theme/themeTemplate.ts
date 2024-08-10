/**
 * This file exports a method to generate the theme object for Styled Components
 */

import { unflatten } from 'flat';
import { Theme } from './theme.types';
import _ from 'lodash';
import { themes } from './exportedThemes';

export const getThemeTemplate = () => {
  let themeTemplate = {} as Theme;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const generateTheme = (theme: any, currPath = '') => {
    Object.keys(theme).forEach((key) => {
      if (typeof theme[key as keyof typeof theme] === 'object' && theme[key as keyof typeof theme] !== null) {
        generateTheme(theme[key], currPath === '' ? currPath + key : currPath + '_' + key);
      } else {
        themeTemplate = _.merge(
          themeTemplate,
          unflatten({ [currPath + '_' + key]: 'var(--' + currPath + '_' + key + ')' }, { delimiter: '_' }),
        );
      }
    });
  };

  generateTheme(themes[0].theme);
  return themeTemplate;
};

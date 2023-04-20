import { unflatten } from 'flat';
import { DefaultLightTheme } from './light/default';
import { Theme } from './theme.types';
import _ from 'lodash';

export const getThemeTemplate = () => {
  let themeTemplate = {} as Theme;

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

  generateTheme(DefaultLightTheme);
  return themeTemplate;
};

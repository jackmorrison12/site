/**
 * This file exports an object containing all of the themes and associated metadata
 */

import { BluePinkDarkTheme } from './dark/bluePink';
import { DefaultDarkTheme } from './dark/default';
import { GreenOrangeDarkTheme } from './dark/greenOrange';
import { DefaultLightTheme } from './light/default';

export const themes = [
  {
    theme: DefaultLightTheme,
    className: 'light-theme',
    isDark: false,
    isRoot: true,
    themeName: 'light',
  },
  {
    theme: DefaultDarkTheme,
    className: 'dark-theme',
    isDark: true,
    isRoot: false,
    themeName: 'dark',
  },
  {
    theme: BluePinkDarkTheme,
    className: 'blue-pink-theme',
    isDark: true,
    isRoot: false,
    themeName: 'bluePink',
  },
  {
    theme: GreenOrangeDarkTheme,
    className: 'green-orange-theme',
    isDark: true,
    isRoot: false,
    themeName: 'greenOrange',
  },
] as const;

export const getThemeByName = (themeName: (typeof themes)[number]['themeName']) => {
  switch (themeName) {
    case 'light':
      return DefaultLightTheme;
    case 'dark':
      return DefaultDarkTheme;
    case 'bluePink':
      return BluePinkDarkTheme;
    case 'greenOrange':
      return GreenOrangeDarkTheme;
  }
};

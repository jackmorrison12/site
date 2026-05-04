/**
 * This file exports an object containing all of the themes and associated metadata
 */

import { BluePinkDarkTheme } from './dark/bluePink';
import { DefaultDarkTheme } from './dark/default';
import { GreenOrangeDarkTheme } from './dark/greenOrange';
import { BluePinkLightTheme } from './light/bluePink';
import { DefaultLightTheme } from './light/default';
import { GreenOrangeLightTheme } from './light/greenOrange';

export const themes = [
  {
    theme: DefaultLightTheme,
    className: 'light-theme',
    isDark: false,
    isRoot: true,
    themeName: 'light',
    palette: 'mint',
    mode: 'light',
  },
  {
    theme: DefaultDarkTheme,
    className: 'dark-theme',
    isDark: true,
    isRoot: false,
    themeName: 'dark',
    palette: 'mint',
    mode: 'dark',
  },
  {
    theme: BluePinkLightTheme,
    className: 'blue-pink-light-theme',
    isDark: false,
    isRoot: false,
    themeName: 'bluePinkLight',
    palette: 'pink',
    mode: 'light',
  },
  {
    theme: BluePinkDarkTheme,
    className: 'blue-pink-theme',
    isDark: true,
    isRoot: false,
    themeName: 'bluePink',
    palette: 'pink',
    mode: 'dark',
  },
  {
    theme: GreenOrangeLightTheme,
    className: 'green-orange-light-theme',
    isDark: false,
    isRoot: false,
    themeName: 'greenOrangeLight',
    palette: 'orange',
    mode: 'light',
  },
  {
    theme: GreenOrangeDarkTheme,
    className: 'green-orange-theme',
    isDark: true,
    isRoot: false,
    themeName: 'greenOrange',
    palette: 'orange',
    mode: 'dark',
  },
] as const;

export type Palette = (typeof themes)[number]['palette'];
export type Mode = (typeof themes)[number]['mode'];
export type ThemeName = (typeof themes)[number]['themeName'];

export const getThemeByName = (themeName: ThemeName) => {
  switch (themeName) {
    case 'light':
      return DefaultLightTheme;
    case 'dark':
      return DefaultDarkTheme;
    case 'bluePink':
      return BluePinkDarkTheme;
    case 'bluePinkLight':
      return BluePinkLightTheme;
    case 'greenOrange':
      return GreenOrangeDarkTheme;
    case 'greenOrangeLight':
      return GreenOrangeLightTheme;
  }
};

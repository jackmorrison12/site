'use client';

import { useTheme } from 'next-themes';
import { isThemeDark } from '../../utils/theme';

export const TweetThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();
  return <div data-theme={theme ? (isThemeDark[theme] ? 'dark' : 'light') : ''}>{children}</div>;
};

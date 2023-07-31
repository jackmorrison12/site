'use client';

import { useTheme } from 'next-themes';
import { isThemeDark } from '../../utils/theme';

export const TweetThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { resolvedTheme } = useTheme();
  return <div data-theme={resolvedTheme ? (isThemeDark[resolvedTheme] ? 'dark' : 'light') : ''}>{children}</div>;
};

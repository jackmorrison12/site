'use client';

import { ThemeProvider } from 'next-themes';
import { themes } from '../utils/theme';
import { ThemeProvider as SCThemeProvider } from 'styled-components';
import { getThemeTemplate } from '../utils/theme/themeTemplate';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      value={themes.reduce((a, v) => ({ ...a, [v.themeName]: v.className }), {})}
      themes={themes.map((t) => t.themeName)}
    >
      <SCThemeProvider theme={getThemeTemplate()}>{children}</SCThemeProvider>
    </ThemeProvider>
  );
}

'use client';

import { ThemeProvider } from 'next-themes';
import { themes } from '../utils/theme';
import { ThemeProvider as SCThemeProvider } from 'styled-components';
import { getThemeTemplate } from '../utils/theme/themeTemplate';
import { QueryClient, QueryClientProvider } from 'react-query';
import Analytics from 'utils/analytics/GoogleAnalytics';
import { SessionProvider } from 'next-auth/react';

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        value={themes.reduce((a, v) => ({ ...a, [v.themeName]: v.className }), {})}
        themes={themes.map((t) => t.themeName)}
      >
        <SCThemeProvider theme={getThemeTemplate()}>
          <QueryClientProvider client={queryClient}>
            <Analytics measurementId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? ''} />
            {children}
          </QueryClientProvider>
        </SCThemeProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}

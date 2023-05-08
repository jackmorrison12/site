import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { event } from 'nextjs-google-analytics';

export const useHeader = () => {
  const router = useRouter();

  const [navViewable, setNavViewable] = useState(false);

  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, themes } = useTheme();

  const setThemeWithTracking = (theme: string) => {
    event('change_theme', {
      category: 'dropdown_select',
      label: theme,
    });
    setTheme(theme);
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return {
    router,
    navViewable,
    setNavViewable,
    mounted,
    setMounted,
    theme,
    setTheme: setThemeWithTracking,
    themes,
  };
};

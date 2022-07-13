import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';

export const useHeader = () => {
  const router = useRouter();

  const [navViewable, setNavViewable] = useState(false);

  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, themes } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  return { router, navViewable, setNavViewable, mounted, setMounted, theme, setTheme, themes };
};

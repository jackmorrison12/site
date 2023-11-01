'use client';
import { useTheme } from 'next-themes';
import { FC, useEffect, useState } from 'react';
import { event } from 'nextjs-google-analytics';
import { themes, getThemeByName } from '../../../utils/theme/';
import styles from './ThemePicker.module.css';

export const ThemePicker: FC = () => {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

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

  const [themesViewable, setThemesViewable] = useState(false);

  const currentTheme = getThemeByName(resolvedTheme as Parameters<typeof getThemeByName>[0]);

  return mounted ? (
    <div className={styles.circleWrapper}>
      {!themesViewable && (
        <button className={styles.clickable} key={resolvedTheme} onClick={() => setThemesViewable(true)}>
          <div
            className={styles.circle}
            style={{
              borderColor: currentTheme.colours.primary.default,
              backgroundColor: currentTheme.colours.background.default,
              boxShadow: `0 0 0 0.3rem ${currentTheme.colours.secondary.default}`,
            }}
          />
        </button>
      )}
      {themesViewable &&
        themes.map((t) => (
          <button
            key={t.themeName}
            className={styles.clickable}
            onClick={(e) => {
              setThemeWithTracking(t.themeName);
              setThemesViewable(false);
            }}
          >
            <div
              className={styles.circle}
              style={{
                borderColor: t.theme.colours.primary.default,
                backgroundColor: t.theme.colours.background.default,
                boxShadow: `0 0 0 0.3rem ${t.theme.colours.secondary.default}`,
              }}
            />
          </button>
        ))}
    </div>
  ) : (
    <button className={styles.clickable}>
      <div
        className={styles.circle}
        style={{
          borderColor: 'var(--colours_primary_default)',
          backgroundColor: 'var(--colours_background_default)',
          boxShadow: '0 0 0 0.3rem var(--colours_secondary_default)',
        }}
      />
    </button>
  );
};

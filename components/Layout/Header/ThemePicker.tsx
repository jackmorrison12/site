'use client';
import { useTheme } from 'next-themes';
import { FC, useEffect, useRef, useState } from 'react';
import { event } from 'nextjs-google-analytics';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { themes, getThemeByName } from '../../../utils/theme/';
import type { Theme } from '../../../utils/theme/theme.types';
import styles from './ThemePicker.module.css';

const ORBIT_RADIUS = 28;
const SLINGSHOT_MS = 450;

type ThemeName = (typeof themes)[number]['themeName'];

const swatchStyle = (theme: Theme) => ({
  borderColor: theme.colours.primary.default,
  backgroundColor: theme.colours.background.default,
});

export const ThemePicker: FC = () => {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [pickedName, setPickedName] = useState<ThemeName | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { setTheme, resolvedTheme } = useTheme();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const currentTheme = getThemeByName(resolvedTheme as ThemeName);
  const otherThemes = themes.filter((t) => t.themeName !== resolvedTheme);

  const onSelect = (name: ThemeName) => {
    if (pickedName) return;
    event('change_theme', {
      category: 'dropdown_select',
      label: name,
    });
    if (reducedMotion) {
      setTheme(name);
      setOpen(false);
      return;
    }
    setPickedName(name);
    timeoutRef.current = setTimeout(() => {
      setTheme(name);
      setPickedName(null);
      setOpen(false);
    }, SLINGSHOT_MS);
  };

  if (!mounted) {
    return (
      <div className={styles.circleWrapper}>
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
      </div>
    );
  }

  const secondary = currentTheme.colours.secondary.default;
  const idleShadow = `0 0 0 0.3rem ${secondary}`;
  const pulseShadow = [idleShadow, `0 0 0 0.55rem ${secondary}`, idleShadow];
  const isPulsing = !open && !pickedName && !reducedMotion;

  return (
    <div ref={wrapperRef} className={styles.circleWrapper}>
      <button
        type="button"
        aria-label={open ? 'Close theme picker' : 'Open theme picker'}
        aria-expanded={open}
        className={`${styles.center} ${styles.clickable}`}
        onClick={() => !pickedName && setOpen((v) => !v)}
      >
        <motion.div
          className={styles.circle}
          style={swatchStyle(currentTheme)}
          animate={
            pickedName
              ? { opacity: 0, scale: 0.6, boxShadow: idleShadow }
              : isPulsing
                ? { opacity: 1, scale: 1, boxShadow: pulseShadow }
                : { opacity: 1, scale: 1, boxShadow: idleShadow }
          }
          transition={
            pickedName
              ? { duration: 0.2 }
              : isPulsing
                ? { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }
                : { duration: 0.2 }
          }
          whileHover={pickedName || open ? undefined : { scale: 1.1 }}
          whileTap={pickedName || open ? undefined : { scale: 0.94 }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            key="orbit"
            className={styles.orbit}
            animate={reducedMotion ? undefined : { rotate: 360 }}
            transition={reducedMotion ? undefined : { duration: 9, repeat: Infinity, ease: 'linear' }}
          >
            {otherThemes.map((t, i) => {
              const angle = (i / otherThemes.length) * 2 * Math.PI - Math.PI / 2;
              const x = Math.cos(angle) * ORBIT_RADIUS;
              const y = Math.sin(angle) * ORBIT_RADIUS;
              const isPicked = pickedName === t.themeName;
              const animateProps = isPicked
                ? { x: 0, y: 0, scale: 1.15, opacity: 1 }
                : pickedName
                  ? { x, y, scale: 0, opacity: 0 }
                  : { x, y, scale: 1, opacity: 1 };
              const transitionProps = isPicked
                ? { type: 'spring' as const, stiffness: 260, damping: 11 }
                : pickedName
                  ? { duration: 0.2 }
                  : { type: 'spring' as const, stiffness: 320, damping: 18 };
              return (
                <motion.button
                  type="button"
                  key={t.themeName}
                  aria-label={`Switch to ${t.themeName} theme`}
                  className={styles.satellite}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                  animate={animateProps}
                  exit={{ scale: 0, opacity: 0, transition: { duration: 0.15 } }}
                  whileHover={pickedName ? undefined : { scale: 1.25 }}
                  whileTap={pickedName ? undefined : { scale: 0.9 }}
                  transition={transitionProps}
                  onClick={() => onSelect(t.themeName)}
                >
                  <div
                    className={styles.circle}
                    style={{
                      ...swatchStyle(t.theme),
                      boxShadow: `0 0 0 0.3rem ${t.theme.colours.secondary.default}`,
                    }}
                  />
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

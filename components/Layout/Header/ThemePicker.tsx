'use client';
import { useTheme } from 'next-themes';
import { FC, useEffect, useRef, useState } from 'react';
import { event } from 'nextjs-google-analytics';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { themes, getThemeByName } from '../../../utils/theme/';
import type { Theme } from '../../../utils/theme/theme.types';
import styles from './ThemePicker.module.css';

type ThemeName = (typeof themes)[number]['themeName'];
type ThemeEntry = (typeof themes)[number];

const ARC_POSITIONS = [
  { x: -30, y: 38 },
  { x: 0, y: 50 },
  { x: 30, y: 38 },
];

const SLINGSHOT_MS = 420;

const swatchStyle = (theme: Theme) => ({
  borderColor: theme.colours.primary.default,
  backgroundColor: theme.colours.background.default,
  boxShadow: `0 0 0 0.3rem ${theme.colours.secondary.default}`,
});

export const ThemePicker: FC = () => {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [pickedName, setPickedName] = useState<ThemeName | null>(null);
  const [snapshot, setSnapshot] = useState<readonly ThemeEntry[] | null>(null);
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
  const liveOthers = themes.filter((t) => t.themeName !== resolvedTheme);
  const otherThemes = snapshot ?? liveOthers;

  const onSelect = (name: ThemeName) => {
    if (pickedName) return;
    event('change_theme', { category: 'dropdown_select', label: name });
    if (reducedMotion) {
      setTheme(name);
      setOpen(false);
      return;
    }
    setSnapshot(liveOthers);
    setPickedName(name);
    setTheme(name);
    timeoutRef.current = setTimeout(() => {
      setSnapshot(null);
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
          whileHover={reducedMotion || pickedName ? undefined : { scale: 1.1 }}
          whileTap={reducedMotion || pickedName ? undefined : { scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 360, damping: 18 }}
        />
      </button>

      <div className={styles.popoutWrapper}>
        <AnimatePresence>
          {open &&
            otherThemes.map((t, i) => {
              const pos = ARC_POSITIONS[i] ?? ARC_POSITIONS[0];
              const isPicked = pickedName === t.themeName;

              const animateProps = isPicked
                ? { x: 0, y: 0, scale: 1.2, opacity: 1 }
                : pickedName
                  ? { x: pos.x, y: pos.y, scale: 0, opacity: 0 }
                  : { x: pos.x, y: pos.y, scale: 1, opacity: 1 };

              const transitionProps = isPicked
                ? { type: 'spring' as const, stiffness: 280, damping: 11 }
                : pickedName
                  ? { duration: 0.18, ease: 'easeIn' as const }
                  : { type: 'spring' as const, stiffness: 380, damping: 16, delay: i * 0.06 };

              return (
                <motion.button
                  type="button"
                  key={t.themeName}
                  aria-label={`Switch to ${t.themeName} theme`}
                  className={styles.satellite}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                  animate={animateProps}
                  exit={{ x: 0, y: 0, scale: 0, opacity: 0, transition: { duration: 0.18 } }}
                  whileHover={pickedName ? undefined : { scale: 1.2, rotate: 8 }}
                  whileTap={pickedName ? undefined : { scale: 0.9 }}
                  transition={transitionProps}
                  onClick={() => onSelect(t.themeName)}
                >
                  <div className={styles.circle} style={swatchStyle(t.theme)} />
                </motion.button>
              );
            })}
        </AnimatePresence>
      </div>
    </div>
  );
};

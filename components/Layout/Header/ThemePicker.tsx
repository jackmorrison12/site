'use client';
import { useTheme } from 'next-themes';
import { FC, useEffect, useRef, useState } from 'react';
import { event } from 'nextjs-google-analytics';
import { AnimatePresence, motion, useReducedMotion, type Variants } from 'motion/react';
import { themes, getThemeByName } from '../../../utils/theme/';
import type { Theme } from '../../../utils/theme/theme.types';
import styles from './ThemePicker.module.css';

type ThemeName = (typeof themes)[number]['themeName'];

const swatchStyle = (theme: Theme) => ({
  borderColor: theme.colours.primary.default,
  backgroundColor: theme.colours.background.default,
  boxShadow: `0 0 0 0.3rem ${theme.colours.secondary.default}`,
});

const containerVariants: Variants = {
  open: {
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
  closed: {
    transition: { staggerChildren: 0.04, staggerDirection: -1 },
  },
};

const itemVariants: Variants = {
  open: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 420, damping: 14 },
  },
  closed: {
    scale: 0,
    opacity: 0,
    y: -10,
    transition: { duration: 0.14, ease: 'easeIn' },
  },
};

export const ThemePicker: FC = () => {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { setTheme, resolvedTheme } = useTheme();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
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
    event('change_theme', { category: 'dropdown_select', label: name });
    setTheme(name);
    setOpen(false);
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
        onClick={() => setOpen((v) => !v)}
      >
        <motion.div
          className={styles.circle}
          style={swatchStyle(currentTheme)}
          whileHover={reducedMotion ? undefined : { scale: 1.1 }}
          whileTap={reducedMotion ? undefined : { scale: 0.94 }}
          transition={{ type: 'spring', stiffness: 360, damping: 18 }}
        />
      </button>

      <div className={styles.popoutWrapper}>
        <AnimatePresence>
          {open && (
            <motion.div
              key="popout"
              className={styles.popout}
              initial="closed"
              animate="open"
              exit="closed"
              variants={containerVariants}
            >
              {otherThemes.map((t) => (
                <motion.button
                  type="button"
                  key={t.themeName}
                  aria-label={`Switch to ${t.themeName} theme`}
                  className={styles.satellite}
                  variants={itemVariants}
                  whileHover={reducedMotion ? undefined : { scale: 1.2, rotate: 8 }}
                  whileTap={reducedMotion ? undefined : { scale: 0.85 }}
                  onClick={() => onSelect(t.themeName)}
                >
                  <div className={styles.circle} style={swatchStyle(t.theme)} />
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

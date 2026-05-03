'use client';
import { useTheme } from 'next-themes';
import { FC, useEffect, useRef, useState } from 'react';
import { event } from 'nextjs-google-analytics';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { themes, getThemeByName } from '../../../utils/theme/';
import type { Theme } from '../../../utils/theme/theme.types';
import styles from './ThemePicker.module.css';

type ThemeName = (typeof themes)[number]['themeName'];

const SATELLITE_RADIUS = 44;
const SATELLITE_BASE_ANGLE = 90;
const SATELLITE_STEP_DEG = 50;
const SATELLITE_MAX_SPREAD = 160;

const computeSatellitePositions = (count: number): Array<{ x: number; y: number }> => {
  if (count === 0) return [];
  if (count === 1) return [{ x: 0, y: SATELLITE_RADIUS }];
  const spread = Math.min(SATELLITE_MAX_SPREAD, (count - 1) * SATELLITE_STEP_DEG);
  const start = SATELLITE_BASE_ANGLE - spread / 2;
  const step = spread / (count - 1);
  return Array.from({ length: count }, (_, i) => {
    const rad = ((start + i * step) * Math.PI) / 180;
    return {
      x: SATELLITE_RADIUS * Math.cos(rad),
      y: SATELLITE_RADIUS * Math.sin(rad),
    };
  });
};

const ringGradient = (() => {
  const segment = 360 / themes.length;
  const stops = themes
    .map((t, i) => `${t.theme.colours.primary.default} ${i * segment}deg ${(i + 1) * segment}deg`)
    .join(', ');
  return `conic-gradient(from 0deg, ${stops})`;
})();

const ringRotationFor = (themeName: ThemeName | undefined) => {
  const idx = themes.findIndex((t) => t.themeName === themeName);
  if (idx < 0) return 0;
  const segment = 360 / themes.length;
  return -((idx + 0.5) * segment);
};

const swatchStyle = (theme: Theme) => ({
  borderColor: theme.colours.primary.default,
  backgroundColor: theme.colours.background.default,
  boxShadow: `0 0 0 0.3rem ${theme.colours.secondary.default}`,
});

export const ThemePicker: FC = () => {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const celebrateTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { setTheme, resolvedTheme } = useTheme();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    setMounted(true);
    return () => {
      if (celebrateTimeoutRef.current) clearTimeout(celebrateTimeoutRef.current);
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
  const satellitePositions = computeSatellitePositions(otherThemes.length);
  const ringRotation = ringRotationFor(resolvedTheme as ThemeName);

  const onSelect = (name: ThemeName) => {
    event('change_theme', { category: 'dropdown_select', label: name });
    setTheme(name);
    setOpen(false);
    if (!reducedMotion) {
      setCelebrate(true);
      if (celebrateTimeoutRef.current) clearTimeout(celebrateTimeoutRef.current);
      celebrateTimeoutRef.current = setTimeout(() => setCelebrate(false), 450);
    }
  };

  if (!mounted) {
    return (
      <div className={styles.circleWrapper}>
        <div className={styles.ring} style={{ background: ringGradient }} />
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
      <motion.div
        className={styles.ring}
        style={{ background: ringGradient }}
        animate={{ rotate: reducedMotion ? 0 : ringRotation }}
        transition={{ type: 'spring', stiffness: 200, damping: 26 }}
        whileHover={reducedMotion ? undefined : { scale: 1.05 }}
      />
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
          animate={celebrate ? { scale: [1, 1.25, 1] } : { scale: 1 }}
          transition={
            celebrate
              ? { duration: 0.45, ease: 'easeOut' }
              : { type: 'spring', stiffness: 360, damping: 18 }
          }
          whileHover={reducedMotion || celebrate ? undefined : { scale: 1.1 }}
          whileTap={reducedMotion || celebrate ? undefined : { scale: 0.94 }}
        />
      </button>

      <div className={styles.popoutWrapper}>
        <AnimatePresence>
          {open &&
            otherThemes.map((t, i) => {
              const pos = satellitePositions[i] ?? { x: 0, y: SATELLITE_RADIUS };
              return (
                <motion.button
                  type="button"
                  key={t.themeName}
                  aria-label={`Switch to ${t.themeName} theme`}
                  className={styles.satellite}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                  animate={{ x: pos.x, y: pos.y, scale: 1, opacity: 1 }}
                  exit={{ x: 0, y: 0, scale: 0, opacity: 0, transition: { duration: 0.18 } }}
                  whileHover={reducedMotion ? undefined : { scale: 1.2, rotate: 8 }}
                  whileTap={reducedMotion ? undefined : { scale: 0.9 }}
                  transition={{
                    type: 'spring',
                    stiffness: 380,
                    damping: 16,
                    delay: i * 0.06,
                  }}
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

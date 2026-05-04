'use client';
import { useTheme } from 'next-themes';
import { FC, useEffect, useRef, useState } from 'react';
import { event } from 'nextjs-google-analytics';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { themes, getThemeByName } from '../../../utils/theme/';
import type { Palette, ThemeName } from '../../../utils/theme/exportedThemes';
import type { Theme } from '../../../utils/theme/theme.types';
import styles from './ThemePicker.module.css';

const SATELLITE_FAN_DEG = 90;
const SATELLITE_START_DEG = 90;
const INNER_ARC_RADIUS = 56;
const OUTER_ARC_RADIUS = 100;
const SATELLITE_DELAY_STEP = 0.05;

const computeArcPositions = (count: number, radius: number) => {
  if (count === 0) return [];
  if (count === 1) return [{ x: 0, y: radius }];
  const step = SATELLITE_FAN_DEG / (count - 1);
  return Array.from({ length: count }, (_, i) => {
    const rad = ((SATELLITE_START_DEG + i * step) * Math.PI) / 180;
    return {
      x: radius * Math.cos(rad),
      y: radius * Math.sin(rad),
    };
  });
};

const uniquePalettes: Palette[] = (() => {
  const seen = new Set<Palette>();
  const out: Palette[] = [];
  themes.forEach((t) => {
    if (!seen.has(t.palette)) {
      seen.add(t.palette);
      out.push(t.palette);
    }
  });
  return out;
})();

type ThemeEntry = (typeof themes)[number];

const lightThemes: ThemeEntry[] = uniquePalettes
  .map((p) => themes.find((t) => t.palette === p && t.mode === 'light'))
  .filter((t): t is ThemeEntry => t !== undefined);

const darkThemes: ThemeEntry[] = uniquePalettes
  .map((p) => themes.find((t) => t.palette === p && t.mode === 'dark'))
  .filter((t): t is ThemeEntry => t !== undefined);

const lightPositions = computeArcPositions(lightThemes.length, INNER_ARC_RADIUS);
const darkPositions = computeArcPositions(darkThemes.length, OUTER_ARC_RADIUS);

const paletteTheme = (palette: Palette): Theme => themes.find((t) => t.palette === palette)!.theme;

const ringGradient = (() => {
  const segment = 360 / uniquePalettes.length;
  const stops = uniquePalettes
    .map((p, i) => `${paletteTheme(p).colours.primary.default} ${i * segment}deg ${(i + 1) * segment}deg`)
    .join(', ');
  return `conic-gradient(from 0deg, ${stops})`;
})();

const ringRotationFor = (palette: Palette) => {
  const idx = uniquePalettes.indexOf(palette);
  if (idx < 0) return 0;
  const segment = 360 / uniquePalettes.length;
  return -((idx + 0.5) * segment);
};

const PALETTE_LABELS: Record<Palette, string> = {
  mint: 'Mint & orange',
  pink: 'Pink & blue',
  orange: 'Orange & teal',
};

const themeLabel = (entry: ThemeEntry) => `${PALETTE_LABELS[entry.palette]} (${entry.mode})`;

const SunIcon: FC<{ size?: number }> = ({ size = 14 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </svg>
);

const MoonIcon: FC<{ size?: number }> = ({ size = 14 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

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

  const currentEntry = themes.find((t) => t.themeName === resolvedTheme) ?? themes[0];
  const currentPalette = currentEntry.palette;
  const currentMode = currentEntry.mode;
  const currentTheme = getThemeByName(currentEntry.themeName);
  const ringRotation = ringRotationFor(currentPalette);

  const triggerCelebrate = () => {
    if (reducedMotion) return;
    setCelebrate(true);
    if (celebrateTimeoutRef.current) clearTimeout(celebrateTimeoutRef.current);
    celebrateTimeoutRef.current = setTimeout(() => setCelebrate(false), 450);
  };

  const onSelectTheme = (themeName: ThemeName) => {
    if (themeName === resolvedTheme) {
      setOpen(false);
      return;
    }
    event('change_theme', { category: 'satellite_select', label: themeName });
    setTheme(themeName);
    setOpen(false);
    triggerCelebrate();
  };

  const centerStyle = {
    backgroundColor: currentTheme.colours.primary.default,
    color: currentTheme.colours.primary.text.contrast,
  };

  const allSatellites = [
    ...lightThemes.map((entry, i) => ({ entry, pos: lightPositions[i], delay: i * SATELLITE_DELAY_STEP })),
    ...darkThemes.map((entry, i) => ({
      entry,
      pos: darkPositions[i],
      delay: (lightThemes.length + i) * SATELLITE_DELAY_STEP,
    })),
  ];

  if (!mounted) {
    return (
      <div className={styles.circleWrapper}>
        <button type="button" className={styles.triggerButton} aria-label="Open theme picker">
          <div className={styles.ring} style={{ background: ringGradient }} />
          <div
            className={styles.centerIndicator}
            style={{
              backgroundColor: 'var(--colours_primary_default)',
              color: 'var(--colours_primary_text_contrast)',
            }}
          >
            <SunIcon size={12} />
          </div>
        </button>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className={styles.circleWrapper}>
      <motion.button
        type="button"
        aria-label={open ? 'Close theme picker' : 'Open theme picker'}
        aria-expanded={open}
        className={styles.triggerButton}
        onClick={() => setOpen((v) => !v)}
        animate={celebrate ? { scale: [1, 1.18, 1] } : { scale: 1 }}
        transition={
          celebrate ? { duration: 0.45, ease: 'easeOut' } : { type: 'spring', stiffness: 360, damping: 18 }
        }
        whileHover={reducedMotion || celebrate ? undefined : { scale: 1.05 }}
        whileTap={reducedMotion || celebrate ? undefined : { scale: 0.96 }}
      >
        <motion.div
          className={styles.ring}
          style={{ background: ringGradient }}
          animate={{ rotate: reducedMotion ? 0 : ringRotation }}
          transition={{ type: 'spring', stiffness: 200, damping: 26 }}
        />
        <div className={styles.centerIndicator} style={centerStyle}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={currentMode}
              className={styles.modeIcon}
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              {currentMode === 'light' ? <SunIcon size={12} /> : <MoonIcon size={12} />}
            </motion.span>
          </AnimatePresence>
        </div>
      </motion.button>

      <div className={styles.popoutWrapper}>
        <AnimatePresence>
          {open &&
            allSatellites.map(({ entry, pos, delay }) => {
              const isActive = entry.themeName === resolvedTheme;
              return (
                <motion.button
                  type="button"
                  key={entry.themeName}
                  aria-label={`Switch to ${themeLabel(entry)}`}
                  aria-pressed={isActive}
                  className={styles.satellite}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                  animate={{ x: pos.x, y: pos.y, scale: 1, opacity: 1 }}
                  exit={{ x: 0, y: 0, scale: 0, opacity: 0, transition: { duration: 0.18 } }}
                  whileHover={reducedMotion ? undefined : { scale: 1.12 }}
                  whileTap={reducedMotion ? undefined : { scale: 0.92 }}
                  transition={{
                    type: 'spring',
                    stiffness: 380,
                    damping: 18,
                    delay,
                  }}
                  onClick={() => onSelectTheme(entry.themeName)}
                >
                  <motion.div
                    className={styles.satelliteSwatch}
                    style={{
                      backgroundColor: entry.theme.colours.primary.default,
                      color: entry.theme.colours.primary.text.contrast,
                      boxShadow: isActive
                        ? `0 0 0 2px ${entry.theme.colours.secondary[1]}, 0 0 0 4px ${entry.theme.colours.secondary[12]}`
                        : undefined,
                    }}
                    animate={isActive && !reducedMotion ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                    transition={
                      isActive && !reducedMotion
                        ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' }
                        : { duration: 0.2 }
                    }
                  >
                    {entry.mode === 'light' ? <SunIcon size={12} /> : <MoonIcon size={12} />}
                  </motion.div>
                </motion.button>
              );
            })}
        </AnimatePresence>
      </div>
    </div>
  );
};

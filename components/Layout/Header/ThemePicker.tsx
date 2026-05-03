'use client';
import { useTheme } from 'next-themes';
import { FC, useEffect, useRef, useState } from 'react';
import { event } from 'nextjs-google-analytics';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { themes, getThemeByName } from '../../../utils/theme/';
import type { Mode, Palette, ThemeName } from '../../../utils/theme/exportedThemes';
import type { Theme } from '../../../utils/theme/theme.types';
import styles from './ThemePicker.module.css';

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

const findThemeName = (palette: Palette, mode: Mode): ThemeName | undefined =>
  themes.find((t) => t.palette === palette && t.mode === mode)?.themeName;

const PALETTE_LABELS: Record<Palette, string> = {
  mint: 'Mint & orange',
  pink: 'Pink & blue',
  orange: 'Orange & teal',
};

const SunIcon: FC = () => (
  <svg
    viewBox="0 0 24 24"
    width="14"
    height="14"
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

const MoonIcon: FC = () => (
  <svg
    viewBox="0 0 24 24"
    width="14"
    height="14"
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

  const otherPalettes = uniquePalettes.filter((p) => p !== currentPalette);
  const satellitePositions = computeSatellitePositions(otherPalettes.length);
  const ringRotation = ringRotationFor(currentPalette);

  const triggerCelebrate = () => {
    if (reducedMotion) return;
    setCelebrate(true);
    if (celebrateTimeoutRef.current) clearTimeout(celebrateTimeoutRef.current);
    celebrateTimeoutRef.current = setTimeout(() => setCelebrate(false), 450);
  };

  const onSelectPalette = (palette: Palette) => {
    const target = findThemeName(palette, currentMode);
    if (!target) return;
    event('change_theme', { category: 'palette_select', label: target });
    setTheme(target);
    setOpen(false);
    triggerCelebrate();
  };

  const onToggleMode = () => {
    const targetMode: Mode = currentMode === 'light' ? 'dark' : 'light';
    const target = findThemeName(currentPalette, targetMode);
    if (!target) return;
    event('change_theme', { category: 'mode_toggle', label: target });
    setTheme(target);
    triggerCelebrate();
  };

  const modeButtonStyle = {
    backgroundColor: currentTheme.colours.primary.default,
    color: currentTheme.colours.primary.text.contrast,
  };

  if (!mounted) {
    return (
      <div className={styles.circleWrapper}>
        <button type="button" className={styles.ringButton} aria-label="Open palette picker">
          <div className={styles.ring} style={{ background: ringGradient }} />
        </button>
        <button
          type="button"
          className={styles.modeButton}
          aria-label="Toggle light/dark mode"
          style={{
            backgroundColor: 'var(--colours_primary_default)',
            color: 'var(--colours_primary_text_contrast)',
          }}
        >
          <SunIcon />
        </button>
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className={styles.circleWrapper}>
        <motion.button
          type="button"
          aria-label={open ? 'Close palette picker' : `Open palette picker (current: ${PALETTE_LABELS[currentPalette]})`}
          aria-expanded={open}
          className={styles.ringButton}
          onClick={() => setOpen((v) => !v)}
          whileHover={reducedMotion ? undefined : { scale: 1.05 }}
          whileTap={reducedMotion ? undefined : { scale: 0.97 }}
        >
          <motion.div
            className={styles.ring}
            style={{ background: ringGradient }}
            animate={{ rotate: reducedMotion ? 0 : ringRotation }}
            transition={{ type: 'spring', stiffness: 200, damping: 26 }}
          />
        </motion.button>

        <motion.button
          type="button"
          aria-label={`Switch to ${currentMode === 'light' ? 'dark' : 'light'} mode`}
          className={styles.modeButton}
          onClick={onToggleMode}
          style={modeButtonStyle}
          animate={celebrate ? { scale: [1, 1.25, 1] } : { scale: 1 }}
          transition={
            celebrate ? { duration: 0.45, ease: 'easeOut' } : { type: 'spring', stiffness: 360, damping: 18 }
          }
          whileHover={reducedMotion || celebrate ? undefined : { scale: 1.1 }}
          whileTap={reducedMotion || celebrate ? undefined : { scale: 0.94 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={currentMode}
              className={styles.modeIcon}
              initial={reducedMotion ? { opacity: 1 } : { opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={reducedMotion ? { opacity: 0 } : { opacity: 0, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              {currentMode === 'light' ? <SunIcon /> : <MoonIcon />}
            </motion.span>
          </AnimatePresence>
        </motion.button>

        <div className={styles.popoutWrapper}>
          <AnimatePresence>
            {open &&
              otherPalettes.map((p, i) => {
                const pos = satellitePositions[i] ?? { x: 0, y: SATELLITE_RADIUS };
                return (
                  <motion.button
                    type="button"
                    key={p}
                    aria-label={`Switch to ${PALETTE_LABELS[p]} palette`}
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
                    onClick={() => onSelectPalette(p)}
                  >
                    <div
                      className={styles.satelliteSwatch}
                      style={{ backgroundColor: paletteTheme(p).colours.primary.default }}
                    />
                  </motion.button>
                );
              })}
          </AnimatePresence>
        </div>
      </div>
  );
};

'use client';

import { ReactNode, useEffect, useRef } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'motion/react';
import styles from './Corkboard.module.scss';
import { HotspotId } from '../CartoonAvatar/CartoonAvatar.types';
import { TileContent, TILE_LABELS } from './TileContent';
import pic2 from 'content/about-me/img/g.jpeg';
import pic3 from 'content/about-me/img/i.jpeg';
import pic4 from 'content/about-me/img/j.jpeg';

type Props = {
  /** The open story — pinned over the gap on wide boards, in flow below the avatar when stacked. */
  active: HotspotId | null;
  onSelect: (id: HotspotId | null) => void;
  topTrackSlot: ReactNode;
  /** Server-rendered Last.fm stats shown inside the music story card. */
  musicStatsSlot: ReactNode;
  /** Server-rendered contribution graph shown inside the open-source story card. */
  contributionsCardSlot: ReactNode;
  /** The CartoonAvatar, pinned centre-left of the board. */
  children: ReactNode;
};

const PIN_COLOURS = [styles.pinYellow, '', styles.pinWhite];

const PHOTOS: { src: typeof pic2; alt: string; caption?: string; className: string }[] = [
  { src: pic2, alt: 'Myself and some friends at IC Hack 2019', caption: "IC Hack '19", className: styles.polaroid1 },
  { src: pic3, alt: 'Myself and some friends', className: styles.polaroid2 },
  { src: pic4, alt: 'Myself and some friends', className: styles.polaroid3 },
];

export const Corkboard = ({
  active,
  onSelect,
  topTrackSlot,
  musicStatsSlot,
  contributionsCardSlot,
  children,
}: Props) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<Element | null>(null);

  useEffect(() => {
    if (!active) return;
    triggerRef.current = document.activeElement;
    cardRef.current?.focus();
    return () => {
      if (triggerRef.current instanceof HTMLElement) triggerRef.current.focus();
    };
  }, [active]);

  return (
    <div className={styles.board}>
      <div className={styles.avatarArea}>
        {children}
        <span className={styles.doodle} style={{ left: '56%', top: '74%' }}>
          that&apos;s me ↑
        </span>
      </div>

      {/* wait: the old card leaves before the new one drops in, so only ever
          one #story-card exists (the hotspots' aria-controls target) */}
      <AnimatePresence mode="wait">
        {active && (
          <motion.div
            key={active}
            ref={cardRef}
            id="story-card"
            className={styles.storyCard}
            role="region"
            aria-label={TILE_LABELS[active]}
            aria-live="polite"
            tabIndex={-1}
            initial={{ opacity: 0, y: -12, rotate: -3 }}
            animate={{ opacity: 1, y: 0, rotate: -1 }}
            // Quick drop onto the pin; the exit is faster still so swapping
            // cards (which waits for the exit) doesn't feel sluggish.
            exit={{ opacity: 0, y: 8, rotate: 1, transition: { duration: 0.09, ease: 'easeIn' } }}
            transition={{ duration: 0.16, ease: [0.2, 0.8, 0.3, 1] }}
          >
            <span className={`${styles.pin} ${styles.pinPrimary}`} />
            <div className={styles.storyInner}>
              <TileContent
                active={active}
                musicStatsSlot={musicStatsSlot}
                contributionsCardSlot={contributionsCardSlot}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={styles.scatter}>
        <div className={styles.stickyIntro}>
          <span className={styles.pin} />
          <h3>Hey, I&apos;m Jack! 👋</h3>
          <p>
            Software Engineer @ Bloomberg, Imperial grad. Grew up in the UK, now living in NY 🗽. 
            Into music, travel & throwing myself out of planes for fun! 🪂
          </p>
        </div>

        {PHOTOS.map((photo) => (
          <div key={photo.src.src} className={`${styles.polaroid} ${photo.className}`}>
            <span className={`${styles.pin} ${PIN_COLOURS[PHOTOS.indexOf(photo) % PIN_COLOURS.length]}`} />
            <div className={styles.polaroidPhoto}>
              <Image src={photo.src} fill placeholder="blur" sizes="(max-width: 75em) 50vw, 200px" alt={photo.alt} />
            </div>
            {photo.caption && <span className={styles.polaroidCaption}>{photo.caption}</span>}
          </div>
        ))}

        <div
          className={styles.musicWrap}
          role="button"
          tabIndex={0}
          aria-label="Music"
          aria-expanded={active === 'headphones'}
          data-hotspot="headphones-polaroid"
          onClickCapture={(e) => {
            e.preventDefault();
            onSelect(active === 'headphones' ? null : 'headphones');
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onSelect(active === 'headphones' ? null : 'headphones');
            }
          }}
        >
          <span className={`${styles.pin} ${styles.pinBlue}`} />
          {topTrackSlot}
        </div>
      </div>

      {!active && (
        <span className={styles.gapHint} aria-hidden="true">
          <span className={`${styles.pin} ${styles.pinWhite}`} />
          <span className={styles.gapHintScrap}>psst… click my stuff ☝</span>
        </span>
      )}
    </div>
  );
};

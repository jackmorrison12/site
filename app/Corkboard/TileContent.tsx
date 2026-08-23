'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import styles from './Corkboard.module.scss';
import { HotspotId } from '../CartoonAvatar/CartoonAvatar.types';
import {
  BloombergLogo,
  GitHubIcon,
  ImperialLogo,
  InstagramIcon,
  LastFmIcon,
  LinkedInIcon,
  SpotifyIcon,
  TwitterIcon,
} from 'components/Logos';
import { FT_IN_MARATHON, NUM_COUNTRIES, NUM_SKYDIVES, socials } from 'content/about-me';

export const TILE_LABELS: Record<HotspotId, string> = {
  headphones: 'Music',
  keyboard: 'Open source',
  shirt: 'Work',
  cap: 'Education',
  pin: 'Location',
  parachute: 'Skydiving',
  plane: 'Travel',
  phone: 'Socials',
};

type Props = {
  active: HotspotId;
  /** Server-rendered Last.fm stats for the music card. */
  musicStatsSlot?: ReactNode;
  /** Server-rendered GitHub contribution graph for the open-source card. */
  contributionsCardSlot?: ReactNode;
};

export const TileContent = ({ active, musicStatsSlot, contributionsCardSlot }: Props) => {
  switch (active) {
    case 'headphones':
      return (
        <Link href={`/wrapped/${new Date().getFullYear()}`} className={styles.contentLink}>
          <h2>Listening</h2>
          {musicStatsSlot}
          <span className={styles.cta}>See my listening wrapped →</span>
        </Link>
      );

    case 'keyboard':
      return (
        <div className={styles.contentBlock}>
          <h2>Open source</h2>
          {contributionsCardSlot}
          <a href={socials.github.url} className={styles.iconRow} target="_blank" rel="noreferrer">
            <span className={styles.iconChip} style={{ background: 'black', color: 'white' }}>
              <GitHubIcon />
            </span>
            <span>@{socials.github.username}</span>
          </a>
        </div>
      );

    case 'shirt':
      return (
        <Link href="/me/experience" className={styles.contentLink}>
          <div className={styles.heroLogoDark}>
            <BloombergLogo />
          </div>
          <h2>Bloomberg</h2>
          <p>Software Engineer in New York since 2021, working in our AI Augmented Development team.</p>
          <span className={styles.cta}>See my full experience →</span>
        </Link>
      );

    case 'cap':
      return (
        <Link href="/me/education" className={styles.contentLink}>
          <div className={styles.heroLogoLight}>
            <ImperialLogo />
          </div>
          <h2>Imperial College London</h2>
          <p>MEng Computing, 2017 – 2021. Graduated with First Class Honours.</p>
          <span className={styles.cta}>Education timeline →</span>
        </Link>
      );

    case 'pin':
      return (
        <div className={styles.contentBlock}>
          <div className={styles.bigEmoji}>🗽</div>
          <h2>New York, USA</h2>
          <p>From the UK 🇬🇧 originally; in NYC for work.</p>
        </div>
      );

    case 'parachute':
      return (
        <div className={styles.contentBlock}>
          <h2>{NUM_SKYDIVES} skydives and counting</h2>
          <p>
            That&apos;s the equivalent of{' '}
            <strong>{((NUM_SKYDIVES * 15000) / FT_IN_MARATHON).toFixed(2)} marathons</strong> in vertical
            descent — though, to be fair, I cheat a bit by using gravity.
          </p>
          <p className={styles.muted}>British A licence.</p>
        </div>
      );

    case 'plane':
      return (
        <div className={styles.contentBlock}>
          <h2>{NUM_COUNTRIES} countries</h2>
          <p>I try to use my time off well.</p>
        </div>
      );

    case 'phone':
      return (
        <div className={styles.contentBlock}>
          <h2>Socials</h2>
          <div className={styles.socialsList}>
            <a href={socials.twitter.url} className={styles.socialRow} style={{ background: 'hsl(203, 89%, 53%)' }}>
              <TwitterIcon />
              <span>@{socials.twitter.username}</span>
            </a>
            <a href={socials.github.url} className={styles.socialRow} style={{ background: 'black' }}>
              <GitHubIcon />
              <span>@{socials.github.username}</span>
            </a>
            <a href={socials.linkedin.url} className={styles.socialRow} style={{ background: 'hsl(201, 100%, 35%)' }}>
              <LinkedInIcon />
              <span>{socials.linkedin.username}</span>
            </a>
            <a href={socials.instagram.url} className={styles.socialRow} style={{ background: '#bc318f' }}>
              <InstagramIcon />
              <span>@{socials.instagram.username}</span>
            </a>
            <a href={socials.lastfm.url} className={styles.socialRow} style={{ background: 'hsl(3, 94%, 43%)' }}>
              <LastFmIcon />
              <span>{socials.lastfm.username}</span>
            </a>
            <a href={socials.spotify.url} className={styles.socialRow} style={{ background: 'hsl(141, 73%, 42%)' }}>
              <SpotifyIcon />
              <span>{socials.spotify.username}</span>
            </a>
          </div>
        </div>
      );
  }
};

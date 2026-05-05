'use client';

import Link from 'next/link';
import styles from './ViewingPanel.module.scss';
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
import { FT_IN_MARATHON, NUM_SKYDIVES, socials } from 'content/about-me';

const NUM_COUNTRIES = 27;

type Props = {
  active: HotspotId;
  onClose: () => void;
};

export const ViewingPanel = ({ active, onClose }: Props) => {
  return (
    <aside className={styles.panel} key={active} aria-live="polite">
      <button className={styles.closeBtn} onClick={onClose} aria-label="Close detail panel">
        ×
      </button>
      <PanelContent active={active} />
    </aside>
  );
};

const PanelContent = ({ active }: { active: HotspotId }) => {
  switch (active) {
    case 'headphones':
      return (
        <Link href={`/wrapped/${new Date().getFullYear()}`} className={styles.contentLink}>
          <span className={styles.eyebrow}>🎧 Now in my ears</span>
          <h2>Listening</h2>
          <p>
            I scrobble everything — over a decade of listens on Last.fm. There&apos;s a wrapped page that
            breaks down the year by track, artist, time of day, day of week, and a few patterns I didn&apos;t
            know I had.
          </p>
          <span className={styles.cta}>See my listening wrapped →</span>
        </Link>
      );

    case 'keyboard':
      return (
        <a href={socials.github.url} className={styles.contentLink} target="_blank" rel="noreferrer">
          <span className={styles.eyebrow}>⌨️ Code I push</span>
          <h2>GitHub</h2>
          <p>
            Most of my open-source effort goes into this site, internal tooling that didn&apos;t need to
            stay internal, and the occasional contribution to libraries I depend on.
          </p>
          <div className={styles.iconRow}>
            <span className={styles.iconChip} style={{ background: 'black', color: 'white' }}>
              <GitHubIcon />
            </span>
            <span>@{socials.github.username}</span>
          </div>
          <span className={styles.cta}>Open profile →</span>
        </a>
      );

    case 'shirt':
      return (
        <Link href="/me/experience" className={styles.contentLink}>
          <span className={styles.eyebrow}>👕 Where I work</span>
          <div className={styles.heroLogoDark}>
            <BloombergLogo />
          </div>
          <h2>Bloomberg</h2>
          <p>
            Software Engineer in New York since 2021. I work on the Terminal&apos;s frontend platform —
            tooling and frameworks that the rest of engineering uses to ship faster.
          </p>
          <span className={styles.cta}>See my full experience →</span>
        </Link>
      );

    case 'cap':
      return (
        <Link href="/me/education" className={styles.contentLink}>
          <span className={styles.eyebrow}>🎓 Where I studied</span>
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
          <span className={styles.eyebrow}>📍 Where I am</span>
          <div className={styles.bigEmoji}>🗽</div>
          <h2>New York, USA</h2>
          <p>
            From the UK 🇬🇧 originally; in NYC for work. Always happy to grab a coffee — drop me a line on
            any of the socials.
          </p>
        </div>
      );

    case 'parachute':
      return (
        <div className={styles.contentBlock}>
          <span className={styles.eyebrow}>🪂 Free time</span>
          <h2>{NUM_SKYDIVES} skydives and counting</h2>
          <p>
            That&apos;s the equivalent of{' '}
            <strong>{((NUM_SKYDIVES * 15000) / FT_IN_MARATHON).toFixed(2)} marathons</strong> in vertical
            descent — though, to be fair, I cheat a bit by using gravity.
          </p>
          <p className={styles.muted}>USPA-A licensed.</p>
        </div>
      );

    case 'plane':
      return (
        <div className={styles.contentBlock}>
          <span className={styles.eyebrow}>✈️ Travel</span>
          <h2>{NUM_COUNTRIES} countries</h2>
          <p>
            I try to use my time off well — long weekends, friends&apos; weddings, scuba trips, and the
            occasional skydive boogie. Highlights so far: Japan, Iceland, Patagonia.
          </p>
        </div>
      );

    case 'phone':
      return (
        <div className={styles.contentBlock}>
          <span className={styles.eyebrow}>📱 Find me online</span>
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

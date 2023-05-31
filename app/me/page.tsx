import { Title } from '../../components/shared/Title';
import styles from './me.module.scss';
import Image from 'next/image';
import SVGIMG from './logos/imperial.svg';
import { TwitterIcon } from './logos/twitter';
import { GitHubIcon } from './logos/github';
import { LinkedInIcon } from './logos/linkedin';
import { InstagramIcon } from './logos/instagram';
import { LastFmIcon } from './logos/lastfm';
import { SpotifyIcon } from './logos/spotify';

export default async function Page() {
  const NUM_SKYDIVES = 23;
  const NUM_COUNTRIES = 27;
  const NUM_OS = 2;
  const FT_IN_MARATHON = 138336;
  return (
    <>
      <Title value="ME" offset="-757.2" bgOverride="ABOUTME" />
      <div className={styles.layout}>
        <div className={`${styles.box} ${styles.intro}`}>I&apos;m a software engineer at Bloomberg in London</div>
        <div className={`${styles.box} ${styles.imperial}`}>
          <p>I studied</p>
          <p>Computing</p>
          <p>@</p>
          <Image src={SVGIMG} alt={'Imperial College London Logo'} height={55} />
        </div>
        <div className={`${styles.box} ${styles.bbg}`}>I&apos;m a SWE at Bloomberg</div>
        <div className={`${styles.box} ${styles.os}`}>
          👨‍💻 I&apos;ve contributed to {NUM_OS} open source projects (so far...)
        </div>
        <div className={`${styles.box} ${styles.twt}`}>
          <TwitterIcon />
        </div>
        <div className={`${styles.box} ${styles.gh}`}>
          <GitHubIcon />
        </div>
        <div className={`${styles.box} ${styles.linkedin}`}>
          <LinkedInIcon />
        </div>
        <div className={`${styles.box} ${styles.insta}`}>
          <InstagramIcon />
        </div>
        <div className={`${styles.box} ${styles.about}`}>About me</div>
        <div className={`${styles.box} ${styles.lastfm}`}>
          <LastFmIcon />
        </div>
        <div className={`${styles.box} ${styles.spotify}`}>
          <SpotifyIcon />
        </div>
        <div className={`${styles.box} ${styles.music}`}>music</div>
        <div className={`${styles.box} ${styles.countries}`}>✈️ I&apos;ve travelled to {NUM_COUNTRIES} countries</div>
        <div className={`${styles.box} ${styles.skydiving}`}>
          {/* <span>🪂</span> */}
          <p>I enjoy skydiving!</p>
          <p>I&apos;ve fallen the equivalent of {((NUM_SKYDIVES * 15000) / FT_IN_MARATHON).toFixed(2)} marathons</p>
        </div>
        <div className={`${styles.box} ${styles.weather}`}>wth</div>
      </div>
    </>
  );
}

export const metadata = {
  title: 'About Me',
  description: 'A brief overview on me',
};

import { Title } from '../../components/shared/Title';
import styles from './me.module.scss';
import { TwitterIcon } from './logos/twitter';
import { GitHubIcon } from './logos/github';
import { LinkedInIcon } from './logos/linkedin';
import { InstagramIcon } from './logos/instagram';
import { LastFmIcon } from './logos/lastfm';
import { SpotifyIcon } from './logos/spotify';
import { ImperialLogo } from './logos/imperial';
import { BloombergLogo } from './logos/bloomberg';

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
        <div className={`${styles.box} ${styles.bbg}`}>
          <BloombergLogo />
        </div>
        <div className={`${styles.box} ${styles.imperial}`}>
          <ImperialLogo />
        </div>
        <div className={`${styles.box} ${styles.os}`}>
          👨‍💻 I&apos;ve contributed to {NUM_OS} open source projects (so far...)
        </div>
        <a href="https://twitter.com/jsm_99" className={`${styles.icon} ${styles.twt}`}>
          <TwitterIcon />
        </a>
        <a href="https://github.com/jackmorrison12" className={`${styles.icon} ${styles.gh}`}>
          <GitHubIcon />
        </a>
        <a href="https://www.linkedin.com/in/jackmorrison12/" className={`${styles.icon} ${styles.linkedin}`}>
          <LinkedInIcon />
        </a>
        <a href="https://www.instagram.com/jackmorrison12/" className={`${styles.icon} ${styles.insta}`}>
          <InstagramIcon />
        </a>
        <div className={`${styles.box} ${styles.about}`}>About me</div>
        <a href="https://www.last.fm/user/Jackmorrison12" className={`${styles.icon} ${styles.lastfm}`}>
          <LastFmIcon />
        </a>
        <a href="https://open.spotify.com/user/112282925" className={`${styles.icon} ${styles.spotify}`}>
          <SpotifyIcon />
        </a>
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
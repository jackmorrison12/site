import { Title } from 'components/shared/Title';
import styles from './me.module.scss';
import Link from 'next/link';
import Image from 'next/image';
import avatar from 'content/about-me/avatar.jpg';
import pic2 from 'content/about-me/img/g.jpeg';
import pic3 from 'content/about-me/img/i.jpeg';
import pic4 from 'content/about-me/img/j.jpeg';
import { TopTrack } from './TopTrack';
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

export default async function Page() {
  const NUM_COUNTRIES = 27;
  const NUM_OS = 2;
  return (
    <>
      <Title value="ME" offset="-757.2" bgOverride="ABOUTME" />
      <div className={styles.layout}>
        <div className={`${styles.box} ${styles.intro}`}>
          <h3>Hey, I&apos;m Jack! 👋</h3>
          <p>A 26 year old Software Engineer @ Bloomberg</p>
        </div>
        <div className={`${styles.pic} ${styles.pic1}`}>
          <Image src={avatar} fill={true} placeholder="blur" alt={'My Avatar'} />
        </div>
        <div className={`${styles.pic} ${styles.pic2}`}>
          <Image
            src={pic2}
            fill={true}
            placeholder="blur"
            objectFit="cover"
            alt={'Myself and some friends at IC Hack 2019'}
          />
        </div>
        <div className={`${styles.pic} ${styles.pic3}`}>
          <Image src={pic3} fill={true} placeholder="blur" objectFit="cover" alt={'Myself and some friends'} />
        </div>
        <div className={`${styles.pic} ${styles.pic4}`}>
          <Image src={pic4} fill={true} placeholder="blur" objectFit="cover" alt={'Myself and some friends'} />
        </div>
        <Link
          href="/me/experience"
          className={`${styles.box} ${styles.bbg} ${styles.overlayParent} ${styles.clickable}`}
        >
          <BloombergLogo />
          <div className={styles.overlayWrapper}>
            <p className={styles.overlayContent}>I&apos;ve been a Software Engineer at Bloomberg since 2021!</p>
          </div>
        </Link>
        <Link
          href="/me/education"
          className={`${styles.box} ${styles.imperial} ${styles.overlayParent}  ${styles.clickable}`}
        >
          <ImperialLogo />
          <div className={styles.overlayWrapper}>
            <p className={styles.overlayContent}>I graduated from Imperial in 2021!</p>
          </div>
        </Link>
        <div className={`${styles.box} ${styles.os}`}>
          <p className={styles.bigNumber}>{NUM_OS}</p>
          <p>open source projects contributed to</p>
          <p className={styles.smallFooter}>(so far... 👨‍💻)</p>
        </div>
        <a href={socials.twitter.url} className={`${styles.icon} ${styles.twt}`}>
          <TwitterIcon />
        </a>
        <a href={socials.github.url} className={`${styles.icon} ${styles.gh}`}>
          <GitHubIcon />
        </a>
        <a href={socials.linkedin.url} className={`${styles.icon} ${styles.linkedin}`}>
          <LinkedInIcon />
        </a>
        <a href={socials.instagram.url} className={`${styles.icon} ${styles.insta}`}>
          <InstagramIcon />
        </a>
        <div className={`${styles.box} ${styles.about}`}>
          <p>
            Hey 👋 I&apos;m Jack, a Software Engineer from the UK, currently living in NY. I graduated from Imperial a
            few years ago now, but have been programming since long before then.
          </p>
          <br />
          <p>
            In my free time, I like music (both listening and making it), travelling, and I&apos;ve also recently
            started throwing myself out of planes for fun! 🪂
          </p>
          <br />
          <p>
            Explore the widgets around here for more info!{' '}
            <span className={styles.smallFooter}>(hint: some of them are clickable)</span>
          </p>
        </div>
        <a href={socials.lastfm.url} className={`${styles.icon} ${styles.lastfm}`}>
          <LastFmIcon />
        </a>
        <a href={socials.spotify.url} className={`${styles.icon} ${styles.spotify}`}>
          <SpotifyIcon />
        </a>
        <TopTrack />
        <div className={`${styles.box} ${styles.countries}`}>
          <p>I&apos;ve travelled to</p>
          <p className={styles.bigNumber}>{NUM_COUNTRIES}</p>
          <p>countries ✈️</p>
        </div>
        <div className={`${styles.box} ${styles.skydiving}`}>
          <p>I&apos;ve skydived the equivalent of</p>
          <p className={styles.bigNumber}>{((NUM_SKYDIVES * 15000) / FT_IN_MARATHON).toFixed(2)}</p>
          <p> marathons 🪂</p>
        </div>
        <div className={`${styles.box} ${styles.emoji} ${styles.emoji1}`}>
          <div>🏠</div>
          <div>🇬🇧</div>
        </div>
        <div className={`${styles.box} ${styles.emoji} ${styles.emoji2}`}>
          <div>📍</div>
          <div>🗽</div>
        </div>
      </div>
    </>
  );
}

export const metadata = {
  title: 'About Me',
  description: 'A brief overview on me',
};

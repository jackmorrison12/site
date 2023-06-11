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
import Link from 'next/link';
import Image from 'next/image';
// TODO: Update these imports
import avatar from '../../content/about-me/avatar.jpg';
import pic2 from '../../content/about-me/img/g.jpeg';
import pic3 from '../../content/about-me/img/i.jpeg';
import pic4 from '../../content/about-me/img/j.jpeg';
import { getTopTracks } from '../../data-access/lastfm/api/getTopTracks';
import { getTrackInfo } from '../../data-access/lastfm/api/getTrackInfo';

export default async function Page() {
  const NUM_SKYDIVES = 23;
  const NUM_COUNTRIES = 27;
  const NUM_OS = 2;
  const FT_IN_MARATHON = 138336;
  const topTrack = (await getTopTracks({ period: '7day', limit: 1 })).toptracks.track[0];
  const trackInfo = await getTrackInfo({ track: topTrack.name, artist: topTrack.artist.name });
  return (
    <>
      <Title value="ME" offset="-757.2" bgOverride="ABOUTME" />
      <div className={styles.layout}>
        <div className={`${styles.box} ${styles.intro}`}>
          <h3>Hey, I&apos;m Jack! 👋</h3>
          <p>A 24 year old Software Engineer @ Bloomberg</p>
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
        <div className={`${styles.box} ${styles.bbg} ${styles.overlayParent}`}>
          <BloombergLogo />
          <div className={styles.overlayWrapper}>
            <p className={styles.overlayContent}>I&apos;ve been a Software Engineer at Bloomberg since 2021!</p>
          </div>
        </div>
        <div className={`${styles.box} ${styles.imperial} ${styles.overlayParent}`}>
          <ImperialLogo />
          <div className={styles.overlayWrapper}>
            <p className={styles.overlayContent}>I graduated from Imperial in 2021!</p>
          </div>
        </div>
        <Link href="/me/open-source" passHref className={`${styles.box} ${styles.os} ${styles.clickable}`}>
          <p className={styles.bigNumber}>{NUM_OS}</p>
          <p>open source projects contributed to</p>
          <p className={styles.smallFooter}>(so far... 👨‍💻)</p>
        </Link>
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
        <div className={`${styles.box} ${styles.about}`}>
          {/* TODO: This text should change size to fit in the box, not the other way around */}
          {/* TODO: link gg quote */}
          <h4>
            Who Am I? <i>Now that&apos;s a secret I&apos;ll never tell...</i>
          </h4>
          <p>
            ...just kidding, hey 👋 I&apos;m Jack, a Software Engineer from London. I graduated from Imperial a few
            years ago now, but have been programming since long before then.
          </p>
          <br />
          <p>
            As you can see from these widgets around me, in my free time, I like music (both listening and making it),
            travelling, and I&apos;ve also recently started throwing myself out of planes for fun! 🪂
          </p>
        </div>
        <a href="https://www.last.fm/user/Jackmorrison12" className={`${styles.icon} ${styles.lastfm}`}>
          <LastFmIcon />
        </a>
        <a href="https://open.spotify.com/user/112282925" className={`${styles.icon} ${styles.spotify}`}>
          <SpotifyIcon />
        </a>
        {/* TODO: This is a hack to get the image into the before selector, since you can't
                  pass variables into CSS modules, and I don't want to duplicate the code
                  into a styles component */}
        <style>{`.music::before { background-image: url(${trackInfo.track.album.image.extralarge})}`}</style>
        <a href={topTrack.url} className={`${styles.box} ${styles.music} ${styles.clickable} music`}>
          <div className={styles.musicText}>
            <p className={styles.musicTitle}>Top track this week:</p>
            <div>
              <p>{topTrack.name}</p>
              <p className={styles.musicArtist}>{topTrack.artist.name}</p>
              <p className={styles.musicListens}>{topTrack.playcount} listens</p>
            </div>
          </div>
        </a>
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
        <div className={`${styles.box} ${styles.weather}`}>wth</div>
      </div>
    </>
  );
}

export const metadata = {
  title: 'About Me',
  description: 'A brief overview on me',
};

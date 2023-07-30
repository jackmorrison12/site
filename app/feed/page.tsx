import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNowStrict } from 'date-fns';
import { Title } from '../../components/shared/Title';
import { GitHubIcon } from '../me/logos/github';
import { Heatmap } from './Heatmap';
import { useHeatmap } from './Heatmap.hooks';
import styles from './feed.module.scss';
import { LastFmIcon } from '../me/logos/lastfm';
import { getRecentTracks } from '../../data-access/lastfm/api/getRecentTracks';

export default async function Page() {
  const { data, xLabels, yLabels } = await useHeatmap();

  const { recenttracks } = await getRecentTracks({ limit: 5 });

  return (
    <>
      <Title value="FEED" offset="-310.76" />
      <div className={styles.wrapper}>
        <div className={styles.main}>
          <h1>Recent Activity</h1>
          <ul>
            <li>item</li>
          </ul>
        </div>
        <div className={styles.sidebar}>
          <Link passHref href="/feed/github">
            <div className={`${styles.github} ${styles.clickable}`}>
              <div className={styles.activityTitle}>
                <div className={styles.icon}>
                  <GitHubIcon />
                </div>
                <h3>Recent Activity</h3>
              </div>
              <Heatmap data={data} xLabels={xLabels} yLabels={yLabels} />
            </div>
          </Link>
          <Link passHref href="/feed/lastfm">
            <div className={`${styles.lastfm} ${styles.clickable}`}>
              <div className={styles.activityTitle}>
                <div className={styles.icon}>
                  <LastFmIcon />
                </div>
                <h3>Recent Activity</h3>
              </div>
              {recenttracks.track.slice(0, 3).map((t) => (
                <div key={t.mbid} className={styles.trackWrapper}>
                  <Image src={t.image.extralarge} alt={`Artwork for ${t.name}`} height={60} width={60} />
                  <div className={styles.textWrapper}>
                    <p key={t.mbid} className={styles.name}>
                      {t.name}
                    </p>
                    <p key={t.mbid} className={styles.artist}>
                      {t.artist.name}
                    </p>
                    <p key={t.mbid} className={styles.date}>
                      {t.date ? ` ${formatDistanceToNowStrict(t.date, { addSuffix: true })}` : ' Now Playing...'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}

export const metadata = {
  title: 'Feed',
  description: "What I've been getting up to recently",
};

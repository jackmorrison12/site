import Link from 'next/link';
import { Title } from '../../components/shared/Title';
import { GitHubIcon } from '../me/logos/github';
import { Heatmap } from './Heatmap';
import { useHeatmap } from './Heatmap.hooks';
import styles from './feed.module.scss';
import { LastFmIcon } from '../me/logos/lastfm';
import { getTopTracks } from '../../data-access/lastfm/api/getTopTracks';

export default async function Page() {
  const { data, xLabels, yLabels } = await useHeatmap();

  const { toptracks } = await getTopTracks({ period: '7day' });

  return (
    <>
      <Title value="FEED" offset="-310.76" />
      <div className={styles.wrapper}>
        <div className={styles.main}>
          <h1>Recent Activity</h1>
          <ul>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
            <li>item</li>
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
          <div className={styles.lastfm}>
            <div className={styles.activityTitle}>
              <div className={styles.icon}>
                <LastFmIcon />
              </div>
              <h3>Recent Activity</h3>
            </div>
            {toptracks.track.slice(0, 3).map((t) => (
              <p key={t.mbid}>
                {t.name} ({t.playcount} streams)
              </p>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export const metadata = {
  title: 'Feed',
  description: "What I've been getting up to recently",
};

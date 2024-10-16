import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNowStrict } from 'date-fns';
import { Title } from 'components/shared/Title';
import { Heatmap } from './Heatmap';
import { useHeatmap } from './Heatmap.hooks';
import styles from './feed.module.scss';
import { getRecentTracks } from 'data-access/lastfm/api/getRecentTracks';
import { GitHubIcon, LastFmIcon } from 'components/Logos';
import { getTweets } from 'data-access/twitter/database/getTweet';
import _ from 'lodash';

export default async function Page() {
  const { data, xLabels, yLabels } = await useHeatmap();

  let recenttracks = undefined;
  try {
    const response = await getRecentTracks({ limit: 5 });
    recenttracks = response.recenttracks;
  } catch {
    recenttracks = { track: [] };
  }

  const { tweets } = await getTweets();

  return (
    <>
      <Title value="FEED" offset="-310.76" />
      <div className={styles.wrapper}>
        <div className={styles.main}>
          <h1>Recent Activity</h1>
          <div></div>
          {tweets.map((t) => (
            <div key={t.tweetId}>
              {t.message && <div>{t.message}</div>}
              <div>
                <span dangerouslySetInnerHTML={{ __html: t.enrichedBody }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {t.userProfileImage && (
                  <Image
                    src={t.userProfileImage}
                    alt={`Profile image for ${t.userScreenName}`}
                    width={40}
                    height={40}
                    style={{ borderRadius: '10px' }}
                  />
                )}
                {t.userName} (<a href={`https://twitter.com/${t.userScreenName}`}>@{t.userScreenName}</a>)
              </div>
              <a href={`https://twitter.com/${t.userScreenName}/status/${t.tweetId}`}>
                {t.tweetTimeOverride && t.tweetTime ? t.tweetTime.toDateString() : t.createdOn.toDateString()}
              </a>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                {t.images?.map((i) => (
                  <div key={i} style={{ position: 'relative', padding: '10%', width: '100%' }}>
                    <Image src={i} alt={`Image`} objectFit="contain" fill={true} />
                  </div>
                ))}
              </div>
            </div>
          ))}
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
              {_.castArray(recenttracks.track)
                .slice(0, 3)
                .map((t) => (
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

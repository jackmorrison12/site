import { Suspense } from 'react';
import { getRecentTracks } from 'data-access/lastfm/api/getRecentTracks';
import type { Listening as ListeningData } from 'data-access/now/now.types';
import { plural } from '../format';
import styles from '../now.module.scss';

/** The one live bit of the page: Last.fm's own "now playing", refreshed every few minutes. */
async function LatestTrack() {
  let track;
  try {
    const recent = (await getRecentTracks({ limit: 1 })).recenttracks.track;
    track = Array.isArray(recent) ? recent[0] : recent;
  } catch {
    return null;
  }
  if (!track) return null;
  const playing = Boolean(track['@attr']?.nowplaying);

  return (
    <a className={styles.feature} href={track.url} target="_blank" rel="noreferrer">
      {track.image.large && (
        // eslint-disable-next-line @next/next/no-img-element
        <img className={styles.cover} src={track.image.large} alt="" width={64} height={64} />
      )}
      <div className={styles.featureText}>
        <span className={styles.eyebrow}>{playing ? 'Playing right now' : 'Last played'}</span>
        <span className={styles.featureTitle}>{track.name}</span>
        <span className={styles.featureSub}>{track.artist.name}</span>
      </div>
    </a>
  );
}

export function Listening({ data }: { data: ListeningData | null }) {
  return (
    <section className={`${styles.card} ${styles.listening}`}>
      <h2 className={styles.heading}>Listening</h2>
      <Suspense fallback={null}>
        <LatestTrack />
      </Suspense>
      {data ? (
        <>
          <p className={styles.summary}>
            {plural(data.last30.listens, 'listen')} across {plural(data.last30.artists, 'artist')} in the last 30 days.
          </p>
          <div className={styles.columns}>
            <div>
              <h3 className={styles.subheading}>On repeat</h3>
              <ol className={styles.list}>
                {data.topArtists.map((a) => (
                  <li key={a.artist}>
                    <span className={styles.itemTitle}>{a.artist}</span>
                    <span className={styles.itemMeta}>{a.count}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className={styles.subheading}>Top tracks</h3>
              <ol className={styles.list}>
                {data.topTracks.map((t) => (
                  <li key={`${t.name}-${t.artist}`}>
                    <span className={styles.itemTitle}>
                      {t.name} <span className={styles.itemSub}>{t.artist}</span>
                    </span>
                    <span className={styles.itemMeta}>{t.count}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </>
      ) : (
        <p className={styles.summary}>I scrobble everything I listen to.</p>
      )}
    </section>
  );
}

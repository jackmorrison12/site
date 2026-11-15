import type { Watch, Watching as WatchingData } from 'data-access/now/now.types';
import { plural, shortDate } from '../format';
import styles from '../now.module.scss';

const describe = (w: Watch) =>
  w.type === 'movie'
    ? { title: w.title, sub: 'Film' }
    : { title: w.showTitle ?? w.title, sub: [w.episode, w.title].filter(Boolean).join(' · ') };

export function Watching({ data }: { data: WatchingData | null }) {
  if (!data?.last) {
    return (
      <section className={`${styles.card} ${styles.watching}`}>
        <h2 className={styles.heading}>Watching</h2>
        <p className={styles.summary}>Everything I watch goes on Trakt. It will show up here soon.</p>
      </section>
    );
  }

  const last = describe(data.last);

  return (
    <section className={`${styles.card} ${styles.watching}`}>
      <h2 className={styles.heading}>Watching</h2>
      <div className={styles.feature}>
        <div className={styles.featureText}>
          <span className={styles.eyebrow}>Last watched, {shortDate(data.last.watchedAt)}</span>
          <span className={styles.featureTitle}>{last.title}</span>
          {last.sub && <span className={styles.featureSub}>{last.sub}</span>}
        </div>
      </div>
      <p className={styles.summary}>
        {plural(data.last30.episodes, 'episode')} and {plural(data.last30.movies, 'film')} in the last 30 days;{' '}
        {plural(data.thisYear.episodes, 'episode')} and {plural(data.thisYear.movies, 'film')} this year.
      </p>
      <div className={styles.columns}>
        {data.shows.length > 0 && (
          <div>
            <h3 className={styles.subheading}>Shows</h3>
            <ul className={styles.list}>
              {data.shows.map((s) => (
                <li key={s.title}>
                  <span className={styles.itemTitle}>
                    {s.title} {s.latest && <span className={styles.itemSub}>{s.latest}</span>}
                  </span>
                  <span className={styles.itemMeta}>{plural(s.episodes, 'ep')}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {data.recentMovies.length > 0 && (
          <div>
            <h3 className={styles.subheading}>Films</h3>
            <ul className={styles.list}>
              {data.recentMovies.map((m) => (
                <li key={`${m.title}-${m.watchedAt}`}>
                  <span className={styles.itemTitle}>{m.title}</span>
                  <span className={styles.itemMeta}>{shortDate(m.watchedAt)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

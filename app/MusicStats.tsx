import { Suspense } from 'react';
import styles from './Corkboard/Corkboard.module.scss';
import { getListeningPatterns, getSummaryStats, getTopArtists } from './wrapped/data';

const formatHour = (hour: number) => {
  const suffix = hour < 12 ? 'am' : 'pm';
  const twelve = hour % 12 === 0 ? 12 : hour % 12;
  return `${twelve}${suffix}`;
};

export const MusicStats = () => (
  <Suspense fallback={<div className={styles.statGrid} />}>
    <MusicStatsAsync />
  </Suspense>
);

const MusicStatsAsync = async () => {
  const year = new Date().getFullYear();
  const range = { startDate: new Date(year, 0, 1), endDate: new Date(year + 1, 0, 1) };

  // The stats need the listens database; if it's unreachable the card falls
  // back to the one thing that's true without it.
  const fallback = <p>I scrobble everything I listen to.</p>;

  let stats;
  try {
    const [summary, topArtists, patterns] = await Promise.all([
      getSummaryStats(range),
      getTopArtists(range, 1),
      getListeningPatterns(range),
    ]);
    const peak = patterns.byHour.reduce<{ hour: number; count: number } | null>(
      (best, row) => (!best || row.count > best.count ? row : best),
      null,
    );
    stats = { summary, topArtist: topArtists[0]?.artist, peakHour: peak?.hour };
  } catch {
    return fallback;
  }

  if (!stats.summary.totalListens) return fallback;

  return (
    <div className={styles.statGrid}>
      <div className={styles.stat}>
        <span className={styles.statValue}>{stats.summary.totalListens.toLocaleString()}</span>
        <span className={styles.statLabel}>listens in {year}</span>
      </div>
      <div className={styles.stat}>
        <span className={styles.statValue}>{stats.summary.uniqueArtists.toLocaleString()}</span>
        <span className={styles.statLabel}>different artists</span>
      </div>
      {stats.topArtist && (
        <div className={styles.stat}>
          <span className={styles.statValue}>{stats.topArtist}</span>
          <span className={styles.statLabel}>on repeat the most</span>
        </div>
      )}
      {stats.peakHour !== undefined && (
        <div className={styles.stat}>
          <span className={styles.statValue}>{formatHour(stats.peakHour)}</span>
          <span className={styles.statLabel}>my noisiest hour</span>
        </div>
      )}
    </div>
  );
};
